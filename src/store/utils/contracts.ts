import { createCompilerInput } from "@/compiler";
import {
  downloadDependenciesForSource,
  generateContractSource,
  getBaseURI,
  getValidContractName,
} from "@/solidity-codegen";
import axios from "axios";
import { ContractFactory } from "ethers";
import { Interface } from "ethers/lib/utils.js";
import { AppDispatch } from "..";
import {
  CollectionType,
  DeploymentStatus,
  addImage,
  completeCompilation,
  contractDeployed,
  contractDeploying,
  handleLoadCollection,
  loadingCompiler,
  removeCollectionImage,
  setCompilerReady,
  setContractURI,
  setStatus,
  submitContractValues,
} from "../reducers/contractReducer";
import {
  handleUploadMetadataAi as createMetadataAiGeneratedImages,
  handleCreateAndUploadMetadata as createMetadataImagesProvided,
} from "./images";
import {
  deleteCollectionImageRequest,
  generateContractUriRequest,
  loadCollectionSettingsRequest,
  saveCollectionRequest,
  uploadCollectionImageRequest,
} from "./requests";

export const COMPILER_VERSION = "v0.8.18+commit.87f61d96";
export const OPEN_ZEPPELIN_VERSION = "4.8.0";

export const prepareContract = async ({
  dispatch,
  compiler,
  state,
  values,
}: {
  dispatch: AppDispatch;
  compiler: any;
  state: any;
  values: any;
}) => {
  console.log("prepareContract");
  const { contract, enqueueSnackbar } = state;
  let contractName;
  let sourceName;
  let source;

  // Generate the contract source
  dispatch(loadingCompiler());
  contractName = getValidContractName(values.tokenName);
  sourceName = contractName + ".sol";
  source = generateContractSource(values);

  // Download dependencies
  const files = await downloadDependenciesForSource(fetch, sourceName, source, {
    "@openzeppelin/contracts": OPEN_ZEPPELIN_VERSION,
  });

  dispatch(setCompilerReady({ files }));

  const output = await compiler.compile(files);
  dispatch(
    completeCompilation({
      value: output,
      sourceName,
      contractName,
    })
  );

  return { contracts: output.contracts, sourceName, contractName, files };
};

export interface EtherscanRequest {
  apikey: string;
  module: "contract";
  action: string;
}

export interface EtherscanVerifyRequest extends EtherscanRequest {
  action: "verify";
  contractaddress: string;
  sourceCode: string;
  codeformat: "solidity-standard-json-input";
  contractname: string;
  compilerversion: string;
  // This is misspelt in Etherscan's actual API parameters.
  // See: https://etherscan.io/apis#contracts
  constructorArguements: string;
}

export const VERIFY_URL =
  "https://blockscout.com/poa/sokol/api?module=contract&action=verify";

export const createDeploymentTransaction = async ({
  dispatch,
  state,
  signer,
  values,
  compiler,
}: any) => {
  const { enqueueSnackbar } = state;
  let valuesCopy = { ...values };
  valuesCopy.tokenURI = state.contract.tokenURI;
  valuesCopy.contractURI = state.contract.contractURI;
  valuesCopy.image = state.contract.image;
  console.log("Preparing contract+");
  const { contractName, sourceName, contracts, files } = await prepareContract({
    dispatch,
    compiler,
    state,
    values: valuesCopy,
  });
  console.log(files);

  const mainContract = contracts[sourceName][contractName];

  const {
    abi,
    evm: { bytecode },
  } = mainContract;

  dispatch(contractDeploying());

  const factory = new ContractFactory(abi, bytecode, signer);

  const contract = await factory.deploy(`${state.contract.tokenURI}/{tokenId}`);
  await contract.deployed();

  dispatch(contractDeployed({ address: contract.address }));

  const contractInterface = new Interface(
    contracts[sourceName][contractName].abi
  );
  console.log(JSON.stringify(createCompilerInput(files)));

  const collectionData = {
    name: valuesCopy.tokenName,
    description: valuesCopy.description,
    image: valuesCopy.image,
    tokenURI: valuesCopy.tokenURI,
    external_url: valuesCopy.externalURL,
    attributes: valuesCopy.attributes,
    address: contract.address,
    abi: JSON.stringify(abi),
    owner: await signer.getAddress(),
  };
  console.log(collectionData);

  await saveCollectionRequest(collectionData);

  enqueueSnackbar("Contract verified successfully", {
    variant: "success",
  });
};

export const loadCollectionSettings = async ({
  dispatch,
}: {
  dispatch: AppDispatch;
}) => {
  const response = await loadCollectionSettingsRequest();

  dispatch(handleLoadCollection(response.data));
};

export const loadCollection = async ({ dispatch }: any) => {
  const response = await loadCollectionSettingsRequest();

  dispatch(handleLoadCollection(response.data));
};

export const uploadImage = async ({
  images,
  dispatch,
  getState,
}: {
  images: any;
  dispatch: AppDispatch;
  getState: any;
}) => {
  const state = getState();
  const { enqueueSnackbar } = state;
  try {
    const formData = new FormData();
    Object.keys(images).forEach((key) => {
      formData.append("image", images[key]);
    });

    const response = await uploadCollectionImageRequest(formData);

    dispatch(addImage(response.data));
  } catch (e) {
    console.error(e);
    enqueueSnackbar("Error uploading collection image please try again", {
      variant: "error",
    });
  }
};

export const deleteCollectionImage = async ({
  dispatch,
}: {
  dispatch: AppDispatch;
}) => {
  await deleteCollectionImageRequest();
  dispatch(removeCollectionImage());
};
export const handleMetadata = async ({
  dispatch,
  state,
  collectionType,
}: any) => {
  if (collectionType === CollectionType.BaseURIProvided) {
    await createMetadataTokenURIProvided({
      dispatch,
      state,
    });
  }

  if (collectionType == CollectionType.ImagesProvided) {
    await createMetadataImagesProvided({
      dispatch,
      state,
    });
  }

  if (collectionType == CollectionType.AiGenerated) {
    await createMetadataAiGeneratedImages({
      dispatch,
      state,
    });
  }
};

export const createMetadataTokenURIProvided = async ({
  dispatch,
  state,
}: {
  dispatch: AppDispatch;
  state: any;
}) => {
  const { contract, enqueueSnackbar } = state;
  dispatch(setStatus(DeploymentStatus.GeneratingContractURI));
  try {
    const response = await generateContractUriRequest({
      name: contract.tokenName,
      description: contract.description,
      image: contract.image,
      external_link: contract.externalURL,
    });

    dispatch(setContractURI(response.data));
  } catch (e) {
    console.error(e);
    enqueueSnackbar("There was an error generating the contract URI", {
      variant: "error",
    });
  }
};

export const deployContract = async ({
  dispatch,
  state,
  provider,
  signer,
  values,
  compiler,
  collectionType,
}: any) => {
  dispatch(submitContractValues(values));
  await handleMetadata({ dispatch, state, collectionType, values });
  await createDeploymentTransaction({
    dispatch,
    state,
    provider,
    signer,
    values,
    compiler,
  });
};

// Currently does not work

const verifyDirect = async ({
  dispatch,
  getState,
  signer,
  values,
  compiler,
  contractInterface,
  contract,
  contractName,
  files,
}: any) => {
  const state = getState();
  const { enqueueSnackbar } = state;
  const deployArguments = contractInterface
    .encodeDeploy([getBaseURI(`${state.contract.tokenURI}/{tokenId}`)])
    .replace("0x", "");

  const verificationRequest = {
    module: "contract",
    action: "verifysourcecode",
    codeformat: "solidity-standard-json-input",
    contractaddress: contract.address,
    contractname: contractName,
    compilerversion: COMPILER_VERSION,
    sourceCode: createCompilerInput(files),
    optimizationUsed: "1",
  };

  const formData = new FormData();

  formData.append("address_hash", contract.address);
  formData.append("verification_type", "json:standard");
  formData.append("smart_contract[address_hash]", contract.address);
  formData.append("smart_contract[name]", contractName);
  formData.append("smart_contract[nightly_builds]", "false");
  formData.append("smart_contract[autodetect_constructor_args]", "true");

  formData.append(
    "smart_contract[compiler_version]",
    "v0.8.18+commit.87f61d96"
  );

  const blob = new Blob([JSON.stringify(createCompilerInput(files))], {
    type: "application/json",
  });

  formData.append("file", blob);
  const res = await axios.post(
    "https://explorer.testnet.mantle.xyz/verify_smart_contract/contract_verifications",
    formData,
    {}
  );

  const parameters = new URLSearchParams(JSON.stringify(verificationRequest));

  const requestDetails = {
    method: "post",
    body: parameters,
  };

  let response: Response;
  try {
    response = await fetch(VERIFY_URL, requestDetails);
    console.log(response);
  } catch (error) {
    console.error("Failed to validate");
    return error as Error;
  }

  if (!response.ok) {
    const responseText = await response.text();

    return new Error(`Error: HTTP request failed. ${responseText}`);
  }

  const json = await response.json();

  if (json.status === "0") {
    enqueueSnackbar("Error verifying contract please try again", {
      variant: "error",
    });
    return new Error(`Error: ${json.result}`);
  }
};

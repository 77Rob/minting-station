import {
  downloadDependenciesForSource,
  generateContractSource,
  getBaseURI,
  getValidContractName,
} from "@/solidity-codegen";
import { ContractFactory } from "ethers";
import { AppDispatch } from "..";
import {
  CollectionType,
  DeploymentStatus,
  addImage,
  completeCompilation,
  contractDeployError,
  contractDeployed,
  contractDeploying,
  handleLoadCollection,
  loadingCompiler,
  setCompilerReady,
  setStatus,
  submitContractValues,
} from "../reducers/contractReducer";
import { setContractURI } from "../reducers/contractReducer";
import {
  handleCreateAndUploadMetadata as createMetadataImagesProvided,
  handleUploadMetadataAi as createMetadataAiGeneratedImages,
} from "./images";
import {
  generateContractUriRequest,
  loadCollectionRequest,
  saveCollectionRequest,
  uploadCollectionImageRequest,
} from "./requests";
import { Interface } from "ethers/lib/utils.js";
import { createCompilerInput } from "@/compiler";
import axios from "axios";

export const COMPILER_VERSION = "v0.8.18+commit.87f61d96";
export const OPEN_ZEPPELIN_VERSION = "4.8.0";

export const prepareContract = async ({
  dispatch,
  compiler,
  getState,
  values,
}: {
  dispatch: AppDispatch;
  compiler: any;
  getState: any;
  values: any;
}) => {
  const state = getState();
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

const saveContractData = async ({
  dispatch,
  getState,
  signer,
  values,
}: any) => {
  const state = getState();
  const { contract, enqueueSnackbar } = state;
  const { sourceName, contractName, contracts } = state.compiler;
  const mainContract = contracts[sourceName][contractName];
  const {
    abi,
    evm: { bytecode },
  } = mainContract;

  const { deploymentAddress } = state;

  const metadataFile = {
    abi,
    deploymentAddress,
    owner: signer.getAddress(),
    name: contract.tokenName,
    description: contract.tokenDescription,
    image: contract.image,
    external_url: contract.externalURL,
    attributes: contract.attributes,
  };

  await saveCollectionRequest(metadataFile);
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

const createDeploymentTransaction = async ({
  dispatch,
  getState,
  signer,
  values,
  compiler,
}: any) => {
  const state = getState();
  const { enqueueSnackbar } = state;
  values.contract.tokenURI = state.contract.tokenURI;

  const { contractName, sourceName, contracts, files } = await prepareContract({
    dispatch,
    compiler,
    getState,
    values,
  });
  console.log("values");
  console.log(values);
  const mainContract = contracts[sourceName][contractName];

  const {
    abi,
    evm: { bytecode },
  } = mainContract;

  dispatch(contractDeploying());

  const factory = new ContractFactory(abi, bytecode, signer);
  console.log(state.contract.tokenURI);
  const contract = await factory.deploy(`${state.contract.tokenURI}/{tokenId}`);
  await contract.deployed();
  dispatch(contractDeployed({ address: contract.address }));

  const contractInterface = new Interface(
    contracts[sourceName][contractName].abi
  );

  console.log(contractInterface);

  const deployArguments = contractInterface
    .encodeDeploy([getBaseURI(`${state.contract.tokenURI}/{tokenId}`)])
    .replace("0x", "");

  console.log(JSON.stringify(createCompilerInput(files)));
  console.log(contractName);
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

  console.log(verificationRequest);
  console.log(verificationRequest);

  const res = await axios.post(
    "https://explorer.testnet.mantle.xyz/verify_smart_contract/contract_verifications",
    formData,
    {}
  );
  console.log("----------res.data----------");
  console.log(res);
  console.log("----------res.data----------");
  console.log(res.data);
  console.log("----------res.data----------");

  const parameters = new URLSearchParams(JSON.stringify(verificationRequest));

  const requestDetails = {
    method: "post",
    body: parameters,
  };

  console.log(requestDetails);
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

  enqueueSnackbar("Contract verified successfully", {
    variant: "success",
  });
};

export const loadCollection = async ({
  dispatch,
}: {
  dispatch: AppDispatch;
}) => {
  const response = await loadCollectionRequest();

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

const handleMetadata = async ({
  dispatch,
  getState,
  collectionType,
  statex,
}: any) => {
  console.log("---------------state2---------------");
  const state = getState();
  console.log(state);
  console.log("---------------statex---------------");
  console.log(statex);
  if (collectionType === CollectionType.BaseURIProvided) {
    await createMetadataTokenURIProvided({
      dispatch,
      getState,
    });
  }

  if (collectionType == CollectionType.ImagesProvided) {
    await createMetadataImagesProvided({
      dispatch,
      getState,
    });
  }

  if (collectionType == CollectionType.AiGenerated) {
    await createMetadataAiGeneratedImages({
      dispatch,
      getState,
    });
  }
};

export const createMetadataTokenURIProvided = async ({
  dispatch,
  getState,
}: {
  dispatch: AppDispatch;
  getState: any;
}) => {
  const state = getState();
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
  getState,
  provider,
  signer,
  values,
  compiler,
  statex,
  collectionType,
}: any) => {
  console.log("------------values------------");
  console.log(values);
  console.log("------------state deploy------------");
  const state = getState();
  console.log(state);

  dispatch(submitContractValues(values));
  console.log("------------state deploy submit------------");
  console.log(state);

  await handleMetadata({ dispatch, getState, collectionType, values });

  await createDeploymentTransaction({
    dispatch,
    getState,
    provider,
    signer,
    values,
    compiler,
  });
  await saveContractData({ dispatch, getState, signer });
};

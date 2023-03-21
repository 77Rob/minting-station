import {
  downloadDependenciesForSource,
  generateContractSource,
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

export const OPEN_ZEPPELIN_VERSION = "4.8.0";

export const prepareContract = async ({
  dispatch,
  compiler,
  getState,
}: {
  dispatch: AppDispatch;
  compiler: any;
  getState: any;
}) => {
  const state = getState();
  const { contract, enqueSnackbar } = state;
  let contractName;
  let sourceName;
  let source;

  // Generate the contract source
  try {
    dispatch(loadingCompiler());
    contractName = getValidContractName(contract.tokenName);
    sourceName = contractName + ".sol";
    source = generateContractSource(contract);
  } catch (e) {
    console.log(e);
    enqueSnackbar({
      message: "Error generating contract source",
      options: {
        variant: "error",
      },
    });
    return;
  }

  // Download dependencies
  try {
    const files = await downloadDependenciesForSource(
      fetch,
      sourceName,
      source,
      {
        "@openzeppelin/contracts": OPEN_ZEPPELIN_VERSION,
      }
    );

    dispatch(setCompilerReady({ files }));
  } catch (e) {
    console.log(e);
    enqueSnackbar({
      message: "Error downloading dependencies",
      options: {
        variant: "error",
      },
    });
    return;
  }

  // Compile the contract
  try {
    const output = await compiler.compile(files);
    dispatch(
      completeCompilation({
        value: output,
        sourceName,
        contractName,
      })
    );
  } catch (e) {
    console.log(e);
    enqueSnackbar({
      message: "Error compiling contract",
      options: {
        variant: "error",
      },
    });
    return;
  }
};

const saveContractData = async ({ dispatch, getState, signer }: any) => {
  const state = getState();
  const { contract } = state;
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

const initiateDeploymentTransaction = async ({
  dispatch,
  getState,
  signer,
}: any) => {
  const state = getState();
  const { enqueSnackbar } = state;
  const { sourceName, contractName, contracts } = state.compiler;
  const mainContract = contracts[sourceName][contractName];
  const {
    abi,
    evm: { bytecode },
  } = mainContract;

  dispatch(contractDeploying());

  try {
    const factory = new ContractFactory(abi, bytecode, signer);

    const contract = await factory.deploy(state.contract.tokenURI);
    await contract.deployed();

    dispatch(contractDeployed({ address: contract.address }));
  } catch (e) {
    dispatch(contractDeployError({ error: e }));
    enqueSnackbar("Error deploying contract please try again", {
      variant: "error",
    });
  }
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
  const { enqueSnackbar } = state;
  try {
    const formData = new FormData();
    Object.keys(images).forEach((key) => {
      formData.append("image", images[key]);
    });

    const response = await uploadCollectionImageRequest(formData);

    dispatch(addImage(response.data));
  } catch (e) {
    console.error(e);
    enqueSnackbar("Error uploading collection image please try again", {
      variant: "error",
    });
  }
};

const handleMetadata = async ({ dispatch, getState, collectionType }: any) => {
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
  collectionType,
}: any) => {
  dispatch(submitContractValues(values));
  await handleMetadata({ dispatch, getState, collectionType });
  await prepareContract({ dispatch, compiler, getState });
  await initiateDeploymentTransaction({ dispatch, getState, provider, signer });
  await saveContractData({ dispatch, getState, signer });
};

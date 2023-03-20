import { IContract, setContractURI } from "./../contractReducer";
import {
  handleCreateAndUploadMetadata,
  handleUploadMetadataAi,
} from "./images";
import {
  downloadDependenciesForSource,
  generateContractSource,
  getValidContractName,
} from "@/solidity-codegen";
import { AppDispatch } from "..";
import { ContractFactory } from "ethers";
import axios from "axios";
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
} from "../contractReducer";

export const OPEN_ZEPPELIN_VERSION = "4.3.2";

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
  const { contract } = state;
  dispatch(loadingCompiler());
  const contractName = getValidContractName(contract.tokenName);
  const sourceName = contractName + ".sol";

  const source = generateContractSource(contract);

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
};

const uploadMetadata = async ({ dispatch, getState, signer }: any) => {
  const state = getState();
  const { contract } = state;
  const { sourceName, contractName, contracts } = state.compiler;
  const mainContract = contracts[sourceName][contractName];
  const {
    abi,
    evm: { bytecode },
  } = mainContract;

  const { deploymentAddress } = state;
  console.log(abi);
  console.log(deploymentAddress);

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

  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/collection/abi`, {
    params: metadataFile,
  });
};
const initiateDeploymentTransaction = async ({
  dispatch,
  getState,
  signer,
}: any) => {
  const state = getState();
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
  }
};

export const loadCollection = async ({
  dispatch,
}: {
  dispatch: AppDispatch;
}) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/collection`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );
  console.log(response.data);
  dispatch(handleLoadCollection(response.data));
};

export const uploadImage = async ({
  images,
  dispatch,
}: {
  images: any;
  dispatch: AppDispatch;
}) => {
  const formData = new FormData();
  Object.keys(images).forEach((key) => {
    formData.append("image", images[key]);
  });

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: localStorage.getItem("userId"),
      },
    }
  );
  console.log(response.data);
  dispatch(addImage(response.data));
};

const handleMetadata = async ({ dispatch, getState, collectionType }: any) => {
  const state = getState();
  if (collectionType === CollectionType.MetadataProvided) {
    await createContractURITokenURIProvided({
      dispatch,
      contract: state.contract,
    });
  }
  if (collectionType === CollectionType.BaseURIProvided) {
  }
  if (collectionType == CollectionType.ImagesProvided) {
    await handleCreateAndUploadMetadata({ dispatch, contract: state.contract });
  }
  if (collectionType == CollectionType.AiGenerated) {
    await handleUploadMetadataAi({ dispatch, contract: state.contract });
  }
};

export const createContractURITokenURIProvided = async ({
  dispatch,
  contract,
}: {
  dispatch: AppDispatch;
  contract: IContract;
}) => {
  const contractURIData = {
    name: contract.tokenName,
    description: contract.description,
    image: contract.image,
    external_link: contract.externalURL,
  };

  dispatch(setStatus(DeploymentStatus.GeneratingContractURI));
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/contractURI`,
    {
      params: contractURIData,
    }
  );
  dispatch(setContractURI(response.data));
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
  console.log("Handling metadata");
  dispatch(submitContractValues(values));
  await handleMetadata({ dispatch, getState, collectionType });
  console.log("Preparing contract");
  await prepareContract({ dispatch, compiler, getState });
  console.log("Initiating deployment");
  await initiateDeploymentTransaction({ dispatch, getState, provider, signer });
  console.log("Uploading metadata");
  uploadMetadata({ dispatch, getState, signer });
};

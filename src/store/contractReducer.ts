import { handleCreateAndUploadMetadata } from "./imagesReducer";
import {
  downloadDependenciesForSource,
  generateContractSource,
  getValidContractName,
} from "@/solidity-codegen";
import { Action, createSlice } from "@reduxjs/toolkit";
import { CompilerOutput } from "hardhat/types";
import { useAppSelector } from ".";
import { createCompilerInput } from "@/compiler";
import { ContractFactory } from "ethers";

export interface IContract {
  image?: string;
  tokenName: string;
  ticker: string;
  royaltyBps?: string;
  usesUriStorage: boolean;
  price?: string;
  supply?: number;
  description?: string;
  multimint?: number;
  limitPerWallet?: number;
  mintSpecifiedIds: boolean;
  onlyOwnerCanMint: boolean;
  enumerable: boolean;
  externalURL?: string;
  activateAutomatically: boolean;
  tokenParameters: TokenParameter[];
  payoutDestinations: PayoutDestination[];
  allowlistDestinations: AllowlistDestination[];
  tokenURI?: string;
  contractURI?: string;
}

export type TokenParameter = {
  name: string;
  type: "uint256" | "address" | "string";
};

export type PayoutDestination = {
  address: string;
  amount: number;
};

export type AllowlistDestination = {
  address: string;
  amount: number;
};

interface CompilerState {
  files?: Record<string, string>;
  contracts?: CompilerOutput["contracts"];
  sourceName?: string;
  contractName?: string;
}

export const OPEN_ZEPPELIN_VERSION = "4.3.2";

enum DeploymentStatus {
  "Idle",
  "LoadingCompiler",
  "CompilerReady",
  "ContractReady",
  "GeneratingContractURI",
  "GeneratingMetadata",
  "MetadataReady",
  "Deploying",
  "Deployed",
  "Error",
}

export const translateDeploymentStatus = (status: DeploymentStatus) => {
  switch (status) {
    case DeploymentStatus.Idle:
      return "Idle";
    case DeploymentStatus.LoadingCompiler:
      return "Loading compiler";
    case DeploymentStatus.CompilerReady:
      return "Compiler ready";
    case DeploymentStatus.ContractReady:
      return "Contract ready";
    case DeploymentStatus.GeneratingContractURI:
      return "Generating contract URI";
    case DeploymentStatus.GeneratingMetadata:
      return "Generating metadata";
    case DeploymentStatus.MetadataReady:
      return "Metadata ready";
    case DeploymentStatus.Deploying:
      return "Deploying";
    case DeploymentStatus.Deployed:
      return "Deployed";
    case DeploymentStatus.Error:
      return "Error";
  }
};

export enum CollectionType {
  ImagesProvided,
  AiGenerated,
  MetadataProvided,
  TraitsGenerated,
  BaseURIProvided,
}

export interface IContractReducerState {
  status: DeploymentStatus;
  imagesURI?: string;
  error?: string;
  deploymentAddress?: string;
  contract: IContract;
  compiler: CompilerState;
}

export const initialContractState: IContract = {
  tokenName: "TestToken",
  ticker: "TST",
  royaltyBps: "",
  price: "",
  supply: 100,
  description: "",
  multimint: undefined,
  tokenParameters: [],
  payoutDestinations: [],
  allowlistDestinations: [],
  limitPerWallet: undefined,
  mintSpecifiedIds: false,
  onlyOwnerCanMint: false,
  enumerable: false,
  activateAutomatically: true,
  tokenURI: "",
  usesUriStorage: false,
  externalURL: "",
  contractURI: undefined,
};

export const initialState: IContractReducerState = {
  deploymentAddress: undefined,
  status: DeploymentStatus.Idle,
  contract: {
    tokenName: "TestToken",
    ticker: "TST",
    royaltyBps: "",
    price: "",
    supply: 100,
    description: "",
    multimint: undefined,
    tokenParameters: [],
    payoutDestinations: [],
    allowlistDestinations: [],
    limitPerWallet: undefined,
    mintSpecifiedIds: false,
    onlyOwnerCanMint: false,
    enumerable: false,
    activateAutomatically: true,
    tokenURI: "",
    usesUriStorage: true,
    externalURL: "",
    contractURI: undefined,
  },
  compiler: {
    files: undefined,
  },
};

interface CompilerState {
  files?: Record<string, string>;
  contracts?: CompilerOutput["contracts"];
  sourceName?: string;
  contractName?: string;
}

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    saveContractValues: (state: any, action: any) => {
      state.contract = { ...state.contract, ...action.payload };
    },
    prepareCompiler: (state: any) => {
      state.status = DeploymentStatus.LoadingCompiler;
    },
    startGeneratingContractURI: (state: any) => {
      state.status = DeploymentStatus.GeneratingContractURI;
    },
    setTokenURI: (state: any, action) => {
      console.log("TOKEN URI");
      console.log(state);
      state.contract.tokenURI = action.payload;
      state.status = DeploymentStatus.MetadataReady;
    },
    setContractURI: (state: any, action: any) => {
      state.contract.contractURI = action.payload.contractURI;
      state.status = DeploymentStatus.GeneratingMetadata;
    },
    setCompilerReady: (state, action) => {
      state.status = DeploymentStatus.CompilerReady;
      console.log("FILES", action.payload.files);
      state.compiler.files = action.payload.files;
    },
    completeCompilation: (state, action) => {
      state.status = DeploymentStatus.ContractReady;
      state.compiler.contracts = action.payload.value.contracts;
      state.compiler.sourceName = action.payload.sourceName;
      state.compiler.contractName = action.payload.contractName;
    },
    contractDeployed: (state: any, action) => {
      state.status = DeploymentStatus.Deployed;
      state.deploymentAddress = action.payload.address;
    },
    contractDeploying: (state: any) => {
      state.status = DeploymentStatus.Deploying;
    },
    contractDeployError: (state: any, action) => {
      state.status = DeploymentStatus.Error;
      state.error = action.payload.error;
    },
  },
});

export const prepareContract = async ({
  dispatch,
  compiler,
  getState,
}: {
  dispatch: any;
  compiler: any;
  getState: any;
}) => {
  const state = getState();
  const { contract } = state;
  dispatch(prepareCompiler());
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

const initiateDeploymentTransaction = async ({
  dispatch,
  getState,
  provider,
  signer,
}: any) => {
  const state = getState();

  const { sourceName, contractName, contracts } = state.compiler;
  const mainContract = contracts[sourceName][contractName];
  console.log(createCompilerInput(state.compiler.files));
  const {
    abi,
    evm: { bytecode },
  } = mainContract;

  dispatch(contractDeploying());

  console.log("COMPILER INPUT \n \n \n \n \n");
  console.log(createCompilerInput(state.compiler.files));

  console.log("COMPILER INPUT \n \n \n \n \n");
  console.log(JSON.stringify(createCompilerInput(state.compiler.files)));

  try {
    const factory = new ContractFactory(abi, bytecode, signer);
    const contract = await factory.deploy(state.contract.tokenURI);
    await contract.deployed();
    console.log("contract.address");
    console.log(contract.address);
    dispatch(contractDeployed({ address: contract.address }));
  } catch (e) {
    console.log("deploy failure", e);
    dispatch(contractDeployError({ error: e }));
  }
};

const handleMetadata = async ({ dispatch, getState, collectionType }: any) => {
  const state = getState();
  if (collectionType === CollectionType.MetadataProvided) {
    // TODO: Upload metadata to IPFS
  }
  if (collectionType === CollectionType.BaseURIProvided) {
  }
  if (collectionType == CollectionType.ImagesProvided) {
    await handleCreateAndUploadMetadata({ dispatch, contract: state.contract });
  }
};

export const deployContract = async ({
  dispatch,
  getState,
  provider,
  signer,
  compiler,
  collectionType,
}: any) => {
  console.log("Handling metadata");
  await handleMetadata({ dispatch, getState, collectionType });
  console.log(getState());
  console.log("Preparing contract");
  console.log(getState());
  await prepareContract({ dispatch, compiler, getState });
  console.log("Initiating deployment");
  console.log(getState());
  await initiateDeploymentTransaction({ dispatch, getState, provider, signer });
};
export default contractSlice.reducer;

export const {
  prepareCompiler,
  saveContractValues,
  setCompilerReady,
  completeCompilation,
  setTokenURI,
  setContractURI,
  contractDeployed,
  startGeneratingContractURI,
  contractDeploying,
  contractDeployError,
} = contractSlice.actions;

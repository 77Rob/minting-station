import { Action, createSlice, current } from "@reduxjs/toolkit";
import { CompilerOutput } from "hardhat/types";
import { useAppSelector } from "..";

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
  ownerMintAllowance?: number;
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

export enum DeploymentStatus {
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
  "MintPageReady",
}

export const translateDeploymentStatus = (status: DeploymentStatus) => {
  switch (status) {
    case DeploymentStatus.Idle:
      return "Idle";
    case DeploymentStatus.LoadingCompiler:
      return "Downloading required libraries for compiler";
    case DeploymentStatus.CompilerReady:
      return "Preparing compiler";
    case DeploymentStatus.ContractReady:
      return "Compiling Smart Contract";
    case DeploymentStatus.GeneratingContractURI:
      return "Generating and uploading to IPFS - ContractURI";
    case DeploymentStatus.GeneratingMetadata:
      return "Generating and uploading to IPFS - ContractURI";
    case DeploymentStatus.MetadataReady:
      return "Creating Deployment Transaction";
    case DeploymentStatus.Deploying:
      return "Signing Transaction";
    case DeploymentStatus.Deployed:
      return "Smart Contract Deployed";
    case DeploymentStatus.Error:
      return "Couldn't deploy a contract ERROR";
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
  deploymentActionsCompleted?: any[];
  status: DeploymentStatus;
  imagesURI?: string;
  error?: string;
  deploymentAddress?: string;
  contract: IContract;
  compiler: CompilerState;
}

export const initialContractState: IContract = {
  tokenName: "My Collection Name",
  ticker: "MCN",
  royaltyBps: undefined,
  price: undefined,
  supply: 100,
  description: "Awesome NFT collection",
  multimint: undefined,
  tokenParameters: [],
  payoutDestinations: [],
  allowlistDestinations: [],
  limitPerWallet: undefined,
  ownerMintAllowance: undefined,
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
  deploymentActionsCompleted: [],
  contract: {
    tokenName: "My Collection Name",
    ticker: "MCN",
    royaltyBps: undefined,
    price: undefined,
    supply: 100,
    description: "Awesome NFT collection",
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
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    submitContractValues: (state: any, action: any) => {
      console.log("state.contract");
      console.log(current(state));
      state.contract = action.payload;
      console.log(current(state));
    },
    loadingCompiler: (state: any) => {
      state.status = DeploymentStatus.LoadingCompiler;
    },
    removeCollectionImage: (state: any) => {
      state.contract.image = undefined;
    },

    generatingContractURI: (state: any) => {
      state.status = DeploymentStatus.GeneratingContractURI;
    },
    setTokenURI: (state: any, action) => {
      state.contract.tokenURI = `${action.payload}/{tokenId}`;
      state.deploymentActionsCompleted.push([
        { name: "TokenURI Ready", value: action.payload },
      ]);
      state.status = DeploymentStatus.MetadataReady;
    },
    handleLoadCollection(state: any, action) {
      console.log(action.payload);
      state.contract = { ...action.payload, ...state.contract };
    },
    addImage(state: any, action) {
      state.contract.image = action.payload;
    },
    setContractURI: (state: any, action: any) => {
      console.log(action.payload);
      state.contract.contractURI = action.payload;
      state.status = DeploymentStatus.GeneratingMetadata;
      state.deploymentActionsCompleted.push([
        { name: "ContractURI Ready", value: action.payload },
      ]);
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
    contractSaved: (state: any, action) => {
      state.status = DeploymentStatus.MintPageReady;
    },
  },
});

export default contractSlice.reducer;

export const {
  loadingCompiler,
  submitContractValues,
  setCompilerReady,
  completeCompilation,
  setTokenURI,
  contractSaved,
  handleLoadCollection,
  addImage,
  setContractURI,
  contractDeployed,
  generatingContractURI,
  contractDeploying,
  setStatus,
  removeCollectionImage,
  contractDeployError,
} = contractSlice.actions;

import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { AppDispatch } from ".";
import {
  setTokenURI,
  setContractURI,
  startGeneratingContractURI,
} from "./contractReducer";

export interface IAttribute {
  name: string;
  value: string;
}

export interface IImage {
  fileName: string;
  name: string;
  url: string;
  description?: string;
  attributes?: IAttribute[];
}
export type Image = {
  fileName: string;
  name: string;
  url: string;
  description?: string;
  attributes?: IAttribute[];
};

export interface IImagesReducerInitialState {
  images: IImage[];
  selected: string[];
}

const initialState: IImagesReducerInitialState = {
  images: [],
  selected: [],
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    selectImage(state, action: PayloadAction<string>) {
      state.selected.push(action.payload);
    },
    deselectImage(state, action: PayloadAction<string>) {
      state.selected = state.selected.filter((item) => item !== action.payload);
    },
    deselectAllImages(state) {
      state.selected = [];
    },
    selectAllImages(state) {
      state.selected = state.images.map((image) => image.fileName);
    },
    handleUpdateMetadata(state, action: PayloadAction<IImage>) {
      state.images = state.images.map((image) => {
        if (image.fileName === action.payload.fileName) {
          return action.payload;
        } else {
          return image;
        }
      });
    },
    handleDeleteImages(state, action: PayloadAction<string[]>) {
      state.images = state.images.filter((image) =>
        action.payload.includes(image.fileName)
      );
    },
    handleAddImages(state, action: PayloadAction<IImage[]>) {
      state.images.push(...action.payload);
    },
    handleLoadImages(state, action: PayloadAction<any[]>) {
      state.images = action.payload.map((image) => ({
        url: image.url,
        name: image.name,
        fileName: image.fileName,
        description: image.description || "",
        attributes: image.attributes || [],
      }));
    },
  },
});

export const {
  handleAddImages,
  handleLoadImages,
  handleUpdateMetadata,
  handleDeleteImages,
  selectImage,
  deselectImage,
  deselectAllImages,
  selectAllImages,
} = imagesSlice.actions;

export const loadImages = async ({ dispatch }: { dispatch: AppDispatch }) => {
  const response = await axios.get(`http://localhost:5000/images`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
  });

  dispatch(handleLoadImages(response.data));
};

export const updateMetadata = async ({
  imageData,
  dispatch,
}: {
  imageData: IImage;
  dispatch: AppDispatch;
}) => {
  const response = await axios.post(`http://localhost:5000/images/update`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
    params: {
      imageData,
    },
  });

  dispatch(handleUpdateMetadata(imageData));
};

export const deleteImages = async ({
  fileNames,
  dispatch,
}: {
  fileNames: any;
  dispatch: AppDispatch;
}) => {
  const response = await axios.post("http://localhost:5000/images/delete", {
    headers: {
      userId: localStorage.getItem("userId"),
    },
    params: {
      fileNames,
    },
  });
  dispatch(handleDeleteImages(fileNames));
};

export const uploadImages = async ({
  images,
  dispatch,
}: {
  images: any;
  dispatch: AppDispatch;
}) => {
  const formData = new FormData();
  Object.keys(images).forEach((key) => {
    formData.append("file", images[key]);
  });

  const response = await axios.post(`http://localhost:5000/images`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
      userId: localStorage.getItem("userId"),
    },
  });

  dispatch(handleAddImages(response.data));
};

export const handleCreateAndUploadMetadata = async ({
  dispatch,
  contract,
}: any) => {
  dispatch(startGeneratingContractURI());
  const contractURIRequest = await axios.get(
    `http://localhost:5000/images/contractURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
      params: {
        contract,
      },
    }
  );

  dispatch(setContractURI(contractURIRequest.data));

  const metadataURIRequest = await axios.get(
    `http://localhost:5000/images/metadataURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );
  const baseUri = metadataURIRequest.data as string;
  const tokenUri = `${baseUri}/{tokenId}`;
  dispatch(setTokenURI(tokenUri));
};

export default imagesSlice.reducer;

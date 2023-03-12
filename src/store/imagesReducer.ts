import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface IAttribute {
  name: string;
  value: string;
}

export interface IImage {
  id: string;
  name: string;
  url: string;
  description?: string;
  attributes?: IAttribute[];
}
export type Image = {
  id: string;
  name: string;
  url: string;
  description?: string;
  attributes?: IAttribute[];
};

export interface IImagesReducerInitialState {
  images: IImage[];
  metadata: any[];
}

const initialState: IImagesReducerInitialState = {
  images: [],
  metadata: [],
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    handleAddImages(state, action: PayloadAction<IImage[]>) {
      state.images.push(...action.payload);
    },
    handleLoadImages(state, action: PayloadAction<any[]>) {
      state.images = action.payload.map((image) => ({
        url: image.url,
        name: image.name,
        id: image.fileName,
        description: image.description || "",
        attributes: image.attributes,
      }));
    },
  },
});

export const { handleAddImages, handleLoadImages } = imagesSlice.actions;

export const loadImages = async (dispatch: any) => {
  const response = await axios.get(
    `http://localhost:5000/images/${localStorage.getItem("userId")}`
  );
  console.log(response);
  console.log(response.data[1].fileName);
  dispatch(handleLoadImages(response.data));
};

export const uploadImages = async (images: any, dispatch: any) => {
  console.log("uploading");
  console.log(images);
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

export default imagesSlice.reducer;

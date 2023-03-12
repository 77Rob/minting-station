import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Trait {
  name: string;
  value: string;
}

interface Image {
  id: string;
  name: string;
  url: string;
  traits?: Trait[];
}

interface ImagesReducerInitialState {
  images: Image[];
  metadata: any[];
}

const initialState: ImagesReducerInitialState = {
  images: [],
  metadata: [],
};

const imagesSlice = createSlice({
  name: "images",
  initialState,
  reducers: {
    addImages(state, action: PayloadAction<Image[]>) {
      state.images.push(...action.payload);
    },
    loadImages(state, action: PayloadAction<Image[]>) {
      state.images = action.payload;
    },
  },
});

export const loadImages = async (dispatch: any) => {
  console.log("loading");
  console.log(process.env);
  const response = await fetch(`http://localhost:5000/images`);
  const responseData = await response.json();
  console.log(responseData);
  dispatch(imagesSlice.actions.addImages(responseData));
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
  console.log(response);
};

export const {} = imagesSlice.actions;
export default imagesSlice.reducer;

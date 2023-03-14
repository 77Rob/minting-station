import { PayloadAction, createSlice } from "@reduxjs/toolkit";

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
      state.images = state.images.filter((image) => {
        console.log(image.fileName, action.payload);
        return !action.payload.includes(image.fileName);
      });
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

export default imagesSlice.reducer;

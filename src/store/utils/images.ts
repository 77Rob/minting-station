import axios from "axios";
import { AppDispatch } from "..";
import {
  setTokenURI,
  setContractURI,
  generatingContractURI,
  IContract,
} from "../reducers/contractReducer";
import {
  IImage,
  handleAddImages,
  handleDeleteImages,
  handleLoadImages,
  handleUpdateMetadata,
} from "../reducers/imagesReducer";
import {
  generateContractUriRequest,
  generateImagesAiRequest,
  generateMetadataUriAiGeneratedImagesRequest,
  generateMetadataUriRequest,
  loadAiGeneratedImagesRequest,
  loagImagesRequest,
} from "./requests";

type ThunkActionProps = {
  dispatch: AppDispatch;
  getState?: any;
};

const loadImages = async ({ dispatch, getState }: ThunkActionProps) => {
  const response = await loagImagesRequest();
  dispatch(handleLoadImages(response.data));
};

const loadImagesAi = async ({ dispatch }: ThunkActionProps) => {
  const response = await loadAiGeneratedImagesRequest();

  dispatch(handleLoadImages(response.data));
};

const updateMetadata = async ({
  imageData,
  dispatch,
}: {
  imageData: IImage;
  dispatch: AppDispatch;
}) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/images/update`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
    params: {
      imageData,
    },
  });

  dispatch(handleUpdateMetadata(imageData));
};

const updateMetadataAi = async ({
  imageData,
  dispatch,
}: {
  imageData: IImage;
  dispatch: AppDispatch;
}) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/images/ai/update`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
    params: {
      imageData,
    },
  });

  dispatch(handleUpdateMetadata(imageData));
};

const deleteImages = async ({
  fileNames,
  dispatch,
}: {
  fileNames: any;
  dispatch: AppDispatch;
}) => {
  await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/images/delete`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
    params: {
      fileNames,
    },
  });

  dispatch(handleDeleteImages(fileNames));
};

const uploadImages = async ({
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

  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/images`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: localStorage.getItem("userId"),
      },
    }
  );
  dispatch(handleAddImages(response.data));
};

const generateImagesAi = async ({
  prompt,
  dispatch,
  enqueueSnackbar,
}: {
  prompt: string;
  dispatch: AppDispatch;
  enqueueSnackbar: any;
}) => {
  const response = await generateImagesAiRequest(prompt);

  if (response.data.type == "error") {
    enqueueSnackbar(response.data.message, {
      variant: "error",
    });
    return;
  } else {
    dispatch(handleAddImages([response.data]));
  }
};

const handleCreateAndUploadMetadata = async ({
  dispatch,
  getState,
}: {
  dispatch: AppDispatch;
  getState: any;
}) => {
  const state = getState();
  const { contract, enqueueSnackbar } = state;

  dispatch(generatingContractURI());

  try {
    const contractURIRequest = await generateContractUriRequest({
      name: contract.tokenName,
      description: contract.description,
      image: contract.image,
      external_link: contract.externalURL,
    });

    dispatch(setContractURI(contractURIRequest.data));
  } catch (e) {
    console.log(e);
    enqueueSnackbar("Error creating contract URI", {
      variant: "error",
    });
  }

  try {
    const metadataURIRequest = await generateMetadataUriRequest();
    const baseUri = metadataURIRequest.data as string;
    const tokenUri = `${baseUri}/`;

    dispatch(setTokenURI(tokenUri));
  } catch (e) {
    console.log(e);
    enqueueSnackbar("Error creating token URI", {
      variant: "error",
    });
  }
};

const handleUploadMetadataAi = async ({
  dispatch,
  getState,
}: ThunkActionProps) => {
  dispatch(generatingContractURI());

  const state = getState();
  const { contract, enqueueSnackbar } = state;

  try {
    const contractURIRequest = await generateContractUriRequest({
      name: contract.tokenName,
      description: contract.description,
      image: contract.image,
      external_link: contract.externalURL,
    });

    dispatch(setContractURI(contractURIRequest.data));
  } catch (e) {
    console.log(e);
    enqueueSnackbar("Error creating contract URI", {
      variant: "error",
    });
  }

  try {
    const metadataURIRequest =
      await generateMetadataUriAiGeneratedImagesRequest();

    const baseUri = metadataURIRequest.data as string;
    const tokenUri = `${baseUri}/`;
    dispatch(setTokenURI(tokenUri));
  } catch (e) {
    enqueueSnackbar("Error creating token URI", {
      variant: "error",
    });
  }
};

export {
  loadImages,
  loadImagesAi,
  updateMetadata,
  updateMetadataAi,
  deleteImages,
  uploadImages,
  generateImagesAi,
  handleCreateAndUploadMetadata,
  handleUploadMetadataAi,
};

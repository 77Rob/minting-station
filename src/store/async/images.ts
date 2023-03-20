import axios from "axios";
import { AppDispatch } from "..";
import {
  setTokenURI,
  setContractURI,
  generatingContractURI,
  IContract,
} from "../contractReducer";
import {
  IImage,
  handleAddImages,
  handleDeleteImages,
  handleLoadImages,
  handleUpdateMetadata,
} from "../imagesReducer";

export const loadImages = async ({ dispatch }: { dispatch: AppDispatch }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/images`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );

  dispatch(handleLoadImages(response.data));
};

export const loadImagesAi = async ({ dispatch }: { dispatch: AppDispatch }) => {
  const response = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/images/ai`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );

  dispatch(handleLoadImages(response.data));
};

export const updateMetadata = async ({
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
export const updateMetadataAi = async ({
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

export const deleteImages = async ({
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

export const generateImagesAi = async ({
  prompt,
  dispatch,
  enqueueSnackbar,
}: {
  prompt: string;
  dispatch: AppDispatch;
  enqueueSnackbar: any;
}) => {
  const response = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/images/generateai`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
      params: {
        prompt,
      },
    }
  );
  if (response.data.type == "error") {
    enqueueSnackbar(response.data.message, {
      variant: "error",
    });
    return;
  } else {
    dispatch(handleAddImages([response.data]));
  }
};

export const handleCreateAndUploadMetadata = async ({
  dispatch,
  contract,
}: {
  dispatch: AppDispatch;
  contract: IContract;
}) => {
  dispatch(generatingContractURI());

  const contractURIData = {
    name: contract.tokenName,
    description: contract.description,
    image: contract.image,
    external_link: contract.externalURL,
  };

  const contractURIRequest = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/contractURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
      params: {
        ...contractURIData,
      },
    }
  );

  console.log("contractURIRequest.data");
  console.log(contractURIRequest.data);

  dispatch(setContractURI(contractURIRequest.data));

  const metadataURIRequest = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/images/metadataURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );
  const baseUri = metadataURIRequest.data as string;
  const tokenUri = `${baseUri}/`;
  dispatch(setTokenURI(tokenUri));
};

export const handleUploadMetadataAi = async ({
  dispatch,
  contract,
}: {
  dispatch: AppDispatch;
  contract: IContract;
}) => {
  dispatch(generatingContractURI());

  const contractURIData = {
    name: contract.tokenName,
    description: contract.description,
    image: contract.image,
    external_link: contract.externalURL,
  };

  const contractURIRequest = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/contractURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
      params: {
        ...contractURIData,
      },
    }
  );

  dispatch(setContractURI(contractURIRequest.data));

  const metadataURIRequest = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/images/ai/metadataURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );

  const baseUri = metadataURIRequest.data as string;
  const tokenUri = `${baseUri}/`;
  dispatch(setTokenURI(tokenUri));
};

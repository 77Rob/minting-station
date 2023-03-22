import axios from "axios";

export type GenerateContractURIRequestProps = {
  name: string;
  description?: string;
  image?: string;
  external_link?: string;
};

const loadAiGeneratedImagesRequest = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/images/ai`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
  });
};

const loagImagesRequest = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/images`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
  });
};

const generateImagesAiRequest = async (prompt: string) => {
  return await axios.post(
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
};

const generateMetadataUriRequest = async () => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/images/metadataURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );
};

const uploadImagesRequest = async (formData: FormData) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: localStorage.getItem("userId"),
      },
    }
  );
};

const generateContractUriRequest = async ({
  name,
  description,
  image,
  external_link,
}: GenerateContractURIRequestProps) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/contractURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
      params: {
        name,
        description,
        image,
      },
    }
  );
};

const generateMetadataUriAiGeneratedImagesRequest = async () => {
  return await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/images/ai/metadataURI`,
    {
      headers: {
        userId: localStorage.getItem("userId"),
      },
    }
  );
};

const loadCollectionRequest = async () => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/collection`, {
    headers: {
      userId: localStorage.getItem("userId"),
    },
  });
};

const uploadCollectionImageRequest = async (formData: FormData) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/image`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        userId: localStorage.getItem("userId"),
      },
    }
  );
};

const saveCollectionRequest = async (collectionData: any) => {
  return await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/collection/save`,
    {
      params: collectionData,
    }
  );
};

export {
  loadAiGeneratedImagesRequest,
  loagImagesRequest,
  generateImagesAiRequest,
  uploadCollectionImageRequest,
  generateMetadataUriRequest,
  saveCollectionRequest,
  uploadImagesRequest,
  loadCollectionRequest,
  generateContractUriRequest,
  generateMetadataUriAiGeneratedImagesRequest,
};

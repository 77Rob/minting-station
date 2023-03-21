import { AppDispatch } from "@/store";
import { uploadImage } from "@/store/utils/contracts";
import { CloudIcon } from "@heroicons/react/24/solid";
import FileUpload from "./FileUpload";
import { IContractReducerState } from "../store/reducers/contractReducer";

type UploadCollectionImageProps = {
  dispatch: AppDispatch;
  getState: () => IContractReducerState & {
    enqueueSnackbar: any;
  };
};

const UploadCollectionImage = ({
  dispatch,
  getState,
}: UploadCollectionImageProps) => {
  return (
    <FileUpload
      className="col-span-2 h-56 justify-center border-solid"
      onFiles={(files) => {
        uploadImage({ images: files, dispatch, getState });
      }}
    >
      <span className="flex items-center text-center flex-col justify-center">
        <CloudIcon className="w-12 mb-2" />
        <span className="text-xl font-semibold">Upload Collection Banner</span>
        <span className="text-sm text-gray-300 mb-6">
          This image will be displayed on collection page and NFT marketplaces
        </span>
        <span className="text-xs text-gray-400">
          Accepted formats: PNG, JPG, GIF, WEBP,
        </span>
      </span>
    </FileUpload>
  );
};

export default UploadCollectionImage;

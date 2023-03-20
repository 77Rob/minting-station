import FileUpload from "@/components/FileUpload";
import { ContractSettings } from "../../components/ContractSettings";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  Image,
  deselectAllImages,
  selectAllImages,
} from "@/store/imagesReducer";
import {
  deleteImages,
  generateImagesAi,
  loadImagesAi,
  uploadImages,
} from "@/store/async/images";
import { useEffect, useState } from "react";
import { FieldInputProps, FormikProps } from "formik";
import { RowsIcon, FourColumnsIcon } from "@/assets";
import { TrashIcon } from "@heroicons/react/24/solid";
import Button from "@/components/Button";
import { CollectionType } from "@/store/contractReducer";
import { NFTImage } from "../../components/NFTImage";
import { useSnackbar } from "notistack";
import { NFTImageAi } from "@/components/NFTImageAi";

const Images = () => {
  const dispatch = useAppDispatch();
  const imagesState = useAppSelector((state) => state.images);
  const [prompt, setPrompt] = useState("");
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    loadImagesAi({ dispatch });
  }, []);

  const [columns, setColumns] = useState(5);

  return (
    <div className="grid grid-cols-7 gap-4 px-8 mx-2 my-4">
      <div className="col-span-5 space-y-4">
        <div className="card px-2 py-4 space-x-8 items-center grid grid-cols-5">
          <div className="col-span-2 flex flex-col gap-y-2">
            <input
              type="text"
              placeholder="Enter prompt"
              value={prompt}
              className="input py-2 text-xl"
              onChange={(e) => setPrompt(e.target.value)}
            />
            <button
              className="btn-primary "
              onClick={() => {
                generateImagesAi({ prompt, dispatch, enqueueSnackbar });
                setPrompt("");
              }}
            >
              Generate
            </button>
          </div>
          <div className="col-span-1" />
          <div className="space-y-2 items-end flex flex-col col-span-2">
            <Button
              className="w-[65%] btn-red px-3 flex text-center
             items-center btn-sm"
              onClick={() =>
                deleteImages({
                  fileNames: imagesState.selected,
                  dispatch,
                })
              }
            >
              <p className="flex flex-grow justify-center ml-6">
                DELETE SELECTED
              </p>
              <TrashIcon className="w-6 justify-self-end" />
            </Button>
            <Button
              className="btn-primary w-[65%]  btn-sm "
              onClick={() => dispatch(selectAllImages())}
            >
              SELECT ALL
            </Button>
            <Button
              className="btn-primary btn-sm  w-[65%] "
              onClick={() => dispatch(deselectAllImages())}
            >
              DESELECT ALL
            </Button>
          </div>
        </div>
        <div className="card py-1 w-full overflow-auto h-screen">
          <div className="flex items-center space-x-1 pb-1 justify-start">
            <Button className="btn-primary p-1" onClick={() => setColumns(4)}>
              <FourColumnsIcon />
            </Button>
            <Button className="btn-primary p-1" onClick={() => setColumns(1)}>
              <RowsIcon />
            </Button>
          </div>
          <div
            className={`grid gap-x-2 gap-y-3 ${
              columns == 1 ? "gird-cols-1" : "grid-cols-4"
            } gap-1`}
          >
            {imagesState.images &&
              imagesState.images?.map((image, index) => (
                <NFTImageAi key={image.fileName} {...image} columns={columns} />
              ))}
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <ContractSettings collectionType={CollectionType.AiGenerated} />
      </div>
      <div className="flex items-center justify-center"></div>
    </div>
  );
};

export default Images;

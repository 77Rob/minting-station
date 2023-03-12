import FileUpload from "@/components/FileUpload";
import { ContractSettings } from "../../components/ContractSettings";
import { useAppDispatch, useAppSelector } from "@/store";
import { uploadImages } from "@/store/imagesReducer";

const Images = () => {
  const dispatch = useAppDispatch();

  return (
    <div className="grid grid-cols-7 gap-4 mx-4 my-4">
      <div className="col-span-5 space-y-6">
        <div className="card grid grid-cols-5">
          <FileUpload
            className="col-span-2"
            onFiles={(files) => {
              uploadImages(files, dispatch);
            }}
          />
          <div className="col-span-2" />
          <div className="col-span-1 flex flex-col space-y-4">
            <button className="btn-red">Reset</button>
            <button className="btn-primary"> Load Demo</button>
          </div>
        </div>
        <div className="card w-full overflow-auto h-96"></div>
      </div>

      <div className="col-span-2">
        <ContractSettings baseUri="" />
      </div>
    </div>
  );
};

export const LabelField = ({ label, field, form, ...props }: any) => {
  return (
    <div>
      <label htmlFor={field.name} className="label">
        {label}
      </label>
      <input className="input" {...field} {...props} />
    </div>
  );
};

export default Images;

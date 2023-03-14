import React from "react";
import { CloudIcon } from "@heroicons/react/24/solid";

interface FileUploadProps extends React.HTMLProps<HTMLLabelElement> {
  onFiles: (files: HTMLInputElement["files"]) => void;
}

const FileUpload = ({ onFiles, ...props }: FileUploadProps) => {
  const labelStyle =
    "flex justify-center w-full h-28 px-4 transition backdrop-invert-[5%] hover:backdrop-invert-[.15] border-2  rounded-xl appearance-none cursor-pointer  focus:outline-none";
  return (
    <label
      {...props}
      className={
        props.className ? props.className + " " + labelStyle : labelStyle
      }
    >
      {!props.children ? (
        <span className="flex items-center space-x-2">
          <CloudIcon className="w-8" />
          <span className="font-bold">
            Drop files to Attach, or
            <span className="text-blue-600 underline "> Browse</span>
          </span>
        </span>
      ) : (
        props.children
      )}
      <input
        multiple
        onChange={(e) => {
          console.log(e.target.files);
          onFiles(e.target.files);
        }}
        type="file"
        data-testid="file-input"
        name="file_upload"
        className="hidden"
      />
    </label>
  );
};

export default FileUpload;

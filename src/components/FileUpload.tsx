import React from "react";

interface FileUploadProps extends React.HTMLProps<HTMLDivElement> {
  onFiles: (files: HTMLInputElement["files"]) => void;
}

const FileUpload = ({ onFiles, ...props }: FileUploadProps) => {
  return (
    <div {...props}>
      <label
        className="flex justify-center w-full h-28 px-4 transition backdrop-invert-[5%] hover:backdrop-invert-[.15]
       border-2 border-primary border-dashed rounded-md appearance-none cursor-pointer  focus:outline-none"
      >
        <span className="flex items-center space-x-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
          <span className="font-bold">
            Drop files to Attach, or
            <span className="text-blue-600 underline "> Browse</span>
          </span>
        </span>
        <input
          multiple
          onChange={(e) => onFiles(e.target.files)}
          type="file"
          data-testid="file-input"
          name="file_upload"
          className="hidden"
        />
      </label>
    </div>
  );
};

export default FileUpload;

import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useDropzone } from "react-dropzone";
import { FiUploadCloud } from "react-icons/fi";
import "video-react/dist/video-react.css"; // css of react video
import { Player } from "video-react";

export const Upload = ({
  name,
  register,
  errors,
  editData = null,
  label,
  setValue,
  video = false,
  viewData = null,
}) => {
  //  maintain states for thumbnail input
  const { course } = useSelector((state) => state.course);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewSource, setPreviewSource] = useState(
    viewData ? viewData : editData ? editData : ""
  );

  //  take useRef input
  const inputRef = useRef(null);

  //  register the input when the component mounts
  useEffect(() => {
    register(name, { required: true });
  }, [register]);

  // when setval is updated sync the ui
  useEffect(() => {
    setValue(name, selectedFile);
  }, [selectedFile, name, setValue]);

  //  create a onDrop function to handle file upload
  const onDrop = (acceptedFile) => {
    const file = acceptedFile[0];
    if (file) {
      previewFile(file);
      setPreviewSource(file);
      setSelectedFile(file);
    }
  };

  //  take instance of useDropzone and it takes an object with a function that hadnle file upload
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: !video
      ? { "image/*": [".jpeg", ".jpg", ".png"] }
      : { "video/*": [".mp4"] },
    onDrop,
  });

  //  create a previewFile function to show a preview of the uploaded file to the user
  const previewFile = (file) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setPreviewSource(reader.result);
    };
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} {!viewData && <sup className="text-pink-200">*</sup>}
      </label>
      <div
        className={`${
          isDragActive ? "bg-richblack-600" : "bg-richblack-700"
        } flex min-h-[250px] cursor-pointer items-center justify-center rounded-md border-2 border-dotted border-richblack-500`}
      >
        {previewSource ? (
          <div className="flex w-full flex-col p-6">
            {!video ? (
              <img
                src={previewSource}
                alt="Preview"
                className="h-full w-full rounded-md object-cover"
              />
            ) : (
              <Player aspectRatio="16:9" playsInline src={previewSource} />
            )}
            {!viewData && (
              <button
                type="button"
                onClick={() => {
                  setPreviewSource("");
                  setSelectedFile(null);
                  setValue(name, null);
                }}
                className="mt-3 text-richblack-400 underline"
              >
                Cancel
              </button>
            )}
          </div>
        ) : (
          <div
            className="flex w-full flex-col items-center p-6"
            {...getRootProps()}
          >
            {/*  input filed  */}
            <input {...getInputProps()} ref={inputRef} />
            <div className="grid aspect-square w-14 place-items-center rounded-full bg-pure-greys-800">
              <FiUploadCloud className="text-2xl text-blue-200" />
            </div>

            {/*  instructions for uploading file */}
            <p className="mt-2 max-w-[200px] text-center text-sm text-richblack-200">
              Drag and drop an {!video ? "image" : "video"}, or click to{" "}
              <span className="font-semibold text-blue-100">Browse</span> a file
            </p>

            {/* show a label for size and aspect ratio */}
            <ul className="mt-10 flex list-disc justify-between space-x-12 text-center  text-xs text-richblack-200">
              <li>Aspect ratio 16:9</li>
              <li>Recommended size 1024x576</li>
            </ul>
          </div>
        )}
      </div>
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

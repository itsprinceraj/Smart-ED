import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { IconBtn } from "../../common/IconBtn";
import { FiUpload } from "react-icons/fi";
import toast from "react-hot-toast";
import { updateProfilePic } from "../../../services/operations/settingsApi";

export const ChangeProfielPic = () => {
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [imageFile, setImageFile] = useState(null);
  const [prevSource, setPrevSource] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInput = useRef(null);

  //  handle Select inpu function
  const handleSelectInput = (event) => {
    fileInput.current.click(); // passing the reference from the selectn button to input that , so that when select button is clicked , hidden input will be triggered
  };

  //  handleInput change function
  const handleInputChange = (event) => {
    const file = event.target.files[0]; // it returns a FileList , so we want the file , that's why we are accessing its first index
    // console.log(file);

    if (file) {
      setImageFile(file);
      previewProfilePic(file);
    }
  };

  //  create a file reader function so that we can show a preview of the selected file by the user
  const previewProfilePic = (file) => {
    const reader = new FileReader(); // create a fileRader object
    reader.readAsDataURL(file); // read the input file as data url
    // onloadend event is triggered when data reading is complete
    reader.onloadend = () => {
      setPrevSource(reader.result); // inside this event . in filereaders result the fileurl exists
    };
  };

  // handle upload file function
  const handleUploadFile = () => {
    try {
      setLoading(true); // setloading true
      const inputData = new FormData(); // create a new formData object
      inputData.append("displayPicture", imageFile); // appen file into it
      dispatch(updateProfilePic(token, inputData)).then(() => {
        // dispatch the function that calls api in the backend
        setLoading(false); // setloading false
        setImageFile(null);
      });
    } catch (err) {
      console.log("Error while updating image", err);
    }
  };

  // callled the image file function with useeffect so that whenever the image chages , the ui will rerender the image

  useEffect(() => {
    // if (imageFile) {
    //   previewProfilePic(imageFile);
    // }
  }, [imageFile]);

  return (
    <div className="flex items-center justify-between rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12 text-richblack-5">
      <div className="flex items-center gap-x-4">
        {/* show profile pic */}
        <img
          className="aspect-square w-[78px] rounded-full object-cover"
          src={prevSource || user?.image}
          alt={`profile-${user?.firstName}`}
        />

        {/* file input and heading */}

        <div className="space-y-2">
          <p>Change Profile Picture</p>
          <div className="flex flex-row gap-3">
            {/* select file input  */}
            <input
              type="file"
              ref={fileInput}
              onChange={handleInputChange}
              className="hidden" // input is hiddent cause we want to handle this input with select button
              accept="image/png, image/gif, image/jpeg"
            />

            {/* upload button */}
            <button
              onClick={handleSelectInput}
              className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
              disabled={loading}
            >
              Select
            </button>

            {/* upload button  */}
            <IconBtn
              text={loading ? "Uploading..." : "Upload"}
              onclick={handleUploadFile}
              disabled={!imageFile}
              customClasses={
                !imageFile ? " bg-yellow-400 cursor-default" : "cursor-pointer"
              }
            >
              {!loading && <FiUpload className="text-lg text-richblack-900" />}
            </IconBtn>
          </div>
        </div>
      </div>
    </div>
  );
};

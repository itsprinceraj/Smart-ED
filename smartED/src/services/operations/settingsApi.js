import toast from "react-hot-toast";
import { setUser } from "../../redux/slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { settingEndpoints } from "../apiEndPoints";
import { logoutRequest } from "./authApiHandler";

// fetch endpoints
const {
  UPDATE_DISPLAY_PIC_API,
  UPDATE_PROFILE_API,
  CHANGE_PASSWORD_API,
  DELETE_PROFILE_API,
} = settingEndpoints;

//  update users profile picture
export const updateProfilePic = (token, inputData) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading..."); // create a loading toast
    try {
      //  make an api call
      const response = await apiConnector(
        "PUT",
        UPDATE_DISPLAY_PIC_API,
        inputData,

        {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        }
      );

      //   console.log(response);
      if (response.success) {
        toast.success(response.message);
        dispatch(setUser(response.data));
        localStorage.setItem("user", JSON.stringify(response.data));
      }
    } catch (error) {
      console.log(error);
      toast.error("Unable to update profile pic");
    }
    toast.dismiss(toastId);
  };
};

// update users information
export const updateUserDetails = (token, data) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      const response = await apiConnector("PUT", UPDATE_PROFILE_API, data, {
        Authorization: `Bearer ${token}`, //
      });

      // console.log(response);

      //    if user did not updated their profile pic , then we need to update the dicebar image according to the users new firstname and lastname
      const userImage = (await response.data.image)
        ? response.data.image
        : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.firstName} ${response.data.lastName}`;

      // update redux state of user
      dispatch(setUser({ ...response.data, image: userImage }));
      if (response.success) {
        toast.success(response.message); // show a toast message
        localStorage.setItem("user", JSON.stringify(response.data)); // update localStorage with updated data
      }
    } catch (error) {
      console.log(error.message);
      toast.error("Unable to update user Information");
    }
    toast.dismiss(toastId);
  };
};

// change users password
export const changeAccountPass = async (token, data) => {
  const toastId = toast.loading("Loading...");
  try {
    // make an api call
    // console.log("Making an api call ......");
    const response = await apiConnector("POST", CHANGE_PASSWORD_API, data, {
      Authorization: `Bearer ${token}`,
    });
    // console.log("ending api calllll ......");

    // console.log(response);

    if (response.success) {
      // localStorage.setItem("user", JSON.stringify(response.data));
      toast.success(response.message);
    }
  } catch (error) {
    console.log(error.message);
    toast.error("Unable to Change your Password");
  }
  toast.dismiss(toastId);
};

// delete users Account
export const deleteAccount = (token, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    try {
      // Make an API call
      // console.log("Making API call");
      const response = await apiConnector("POST", DELETE_PROFILE_API, null, {
        Authorization: `Bearer ${token}`,
      });
      // console.log("Ending API call");

      // console.log(response);

      if (response.success) {
        toast.success(response.message);
        dispatch(logoutRequest(navigate));
      } else {
        toast.error(response.message || "Account deletion failed");
      }
    } catch (err) {
      console.log(err);
      toast.error("Account deletion failed");
    }
    toast.dismiss(toastId);
  };
};

import { toast } from "react-hot-toast";
import { setToken, setLoading } from "../../redux/slices/authSlice";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apiEndPoints";
import { json } from "react-router-dom";
import axios from "axios";
import { setUser } from "../../redux/slices/profileSlice";
import { resetCartItems } from "../../redux/slices/cartSlice";

const {
  RESETPASSTOKEN_API,
  LOGIN_API,
  SIGNUP_API,
  RESETPASSWORD_API,
  SENDOTP_API,
} = authEndpoints;

// create a sendOtp handler and make a http request for login
export const sendOtp = (email, navigate) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      // make an api call
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        checkUserPresent: true,
      });

      console.log(response);

      if (!response.success) {
        toast.error(response.message);
      } else {
        // navigate to verify email
        toast.success("Email Sent Successfully");
        navigate("/verify-email");
      }
    } catch (err) {
      console.log(err);
      toast.error("Can't send OTP");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

// create a signup handler and make a http request for login

export const signupRequest = (
  accountType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  otp,
  navigate
) => {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true)); // show loading

    try {
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      console.log(response);

      //handle error
      toast.success("Signed up Succesfully");
      navigate("/login");
    } catch (err) {
      console.log(err);
      toast.error("Signup failed");
      navigate("/signup");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

// create a login handler and make a http request for login;

export const loginRequest = (email, password, navigate) => {
  return async (dispatch) => {
    // create toast for loading
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", LOGIN_API, {
        email,
        password,
      });

      // console.log("login response", response);

      if (!response.success) {
        toast.error(response.message);
      } else {
        dispatch(setToken(response.token));
        // extract userImage
        const userImage = response.user.image
          ? response.user.image
          : `https://api.dicebear.com/5.x/initials/svg?seed=${response.user.firstName} ${response.user.lastName}`;

        // dispatch user
        dispatch(setUser({ ...response.user, image: userImage }));

        localStorage.setItem("token", JSON.stringify(response.token));
        localStorage.setItem("user", JSON.stringify(response.user));

        // show success toast
        toast.success(response.message);

        // navigate to dashboard
        navigate("/dashboard/my-profile");
      }
    } catch (err) {
      console.log(err);
      toast.error("Failed to Login");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

// create a logout handler and make a http request for logoit
export const logoutRequest = (navigate) => {
  return async (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(resetCartItems(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
};

// reset password token api handler
export const resetPasswordToken = (email, setSentEmail) => {
  return async (dispatch) => {
    // mark loading true  , so that spinner can be shown
    dispatch(setLoading(true));

    try {
      // make api call to resetPasswordToken controller in backend
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // console.log("reset pass token :", response);

      // handle error from api data
      if (!response.success) {
        throw new Error(response.message);
      }

      toast.success("Reset Password Email Sent");
      setSentEmail(true); // mark that email is sent
    } catch (err) {
      console.log("Reset password token error: ", err);
      toast.error("Failed to Send Reset Password Email");
    }
    dispatch(setLoading(false));
  };
};

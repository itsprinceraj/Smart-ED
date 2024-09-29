import { toast } from "react-hot-toast";
import { setToken, setLoading } from "../../redux/slices/authSlice";
import { apiConnector } from "../apiConnector";
import { authEndpoints } from "../apiEndPoints";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../redux/slices/profileSlice";
import {
  resetCartItems,
  setCartItems,
  setTotalItems,
} from "../../redux/slices/cartSlice";
import { addIntoCart } from "./userProfileApi";

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

      // console.log(response);

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
      // make a api call
      const response = await apiConnector("POST", SIGNUP_API, {
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
      });

      // console.log(response);

      //handle error
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        navigate("/login");
      }
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
        console.log(response.user);

        //  merge localCartItems and serverCartItems
        let serverCartItems = response?.user?.cart || [];
        let localCartItems = JSON.parse(localStorage.getItem("cart")) || [];

        const mergedItems = [...serverCartItems];

        //  check if the local item that is into the cart, contains in database or not
        for (let localItem of localCartItems) {
          const existInServerCart = serverCartItems.some(
            (item) => item._id == localItem._id
          );

          //  check if the course is already purchased by the user
          const purchasedCourse = response.user.courses.filter(
            (item) => item._id == localItem._id
          );

          if (!existInServerCart && !purchasedCourse) {
            mergedItems.push(localItem);
            await addIntoCart(dispatch, response?.token, localItem._id);
          }
        }

        //  update redux state
        dispatch(setCartItems(mergedItems));
        dispatch(setTotalItems(mergedItems.length));

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
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      // make api call to resetPasswordToken controller in backend
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // console.log("reset pass token :", response);

      // handle error from api data
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        setSentEmail(true); // mark that email is sent
      }
    } catch (err) {
      console.log("Reset password token error: ", err);
      toast.error("Failed to Send Reset Password Email");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

// make a reset password request
export const resetPasswordRequest = (
  password,
  confirmPassword,
  token,
  navigate
) => {
  return async (dispatch) => {
    // const navigate = useNavigate();
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));

    try {
      // password validation
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters long");
        return;
      }
      if (!/[a-z]/.test(password)) {
        toast.error("Password must contain at least one lowercase letter");
        return;
      }
      if (!/[A-Z]/.test(password)) {
        toast.error("Password must contain at least one uppercase letter");
        return;
      }
      if (!/\d/.test(password)) {
        toast.error("Password must contain at least one number");
        return;
      }
      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        toast.error("Password must contain at least one special character");
        return;
      }

      // Confirm password validation
      if (password !== confirmPassword) {
        toast.error("Password do not match");
        return;
      }

      // make an api call
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      // console.log(response);

      // handle response and show toast accordingly
      if (!response.success) {
        toast.error(response.message);
      } else {
        toast.success(response.message);
        navigate("/login");
      }
    } catch (err) {
      console.log(err);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
};

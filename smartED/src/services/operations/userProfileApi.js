import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { userDataEndPoints } from "../apiEndPoints";
import { dashboard } from "../apiEndPoints";
import { courseEndpoints } from "../apiEndPoints";
import { addToCart, removeFromCart } from "../../redux/slices/cartSlice";

const { ENROLLED_COURSE_DATA_API } = userDataEndPoints;

const { INSTRUCTOR_DASHBOARD_API } = dashboard;

const { ADD_TO_CART, REMOVE_FROM_CART } = courseEndpoints;

export const getEnrolledCourseDetail = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", ENROLLED_COURSE_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });

    // console.log(response);

    result = response.data;
    // console.log(result);
  } catch (error) {
    console.log(error.message);
    toast.error("Unable to fetch enrolled courses");
  }
  toast.dismiss(toastId);
  return result;
};

//  unstructor dashboard api
export const fetchDashboardDetails = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    // make an api call
    const response = await apiConnector(
      "POST",
      INSTRUCTOR_DASHBOARD_API,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // console.log(response);
    if (!response?.success) {
      toast.error(response?.message);
    }

    result = response?.data;
    // console.log("printing result of dashboard:", result);
  } catch (error) {
    console.log(error);
    toast.error("cannot get dashboard detail");
  }
  toast.dismiss(toastId);
  return result;
};

export const addIntoCart = async (dispatch, token, courseId) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    //make an api call to add to cart
    const response = await apiConnector(
      "POST",
      ADD_TO_CART,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // console.log(response);

    if (!response?.success) {
      toast.error(response?.message);
    } else {
      dispatch(addToCart(courseId));
    }

    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("unable to add to cart");
  }
  toast.dismiss(toastId);
  return result;
};

export const removeCourseFromCart = async (dispatch, token, courseId) => {
  const toastId = toast.loading("...loading");
  let result;
  try {
    //  make an api call to remove from cart
    const response = await apiConnector(
      "POST",
      REMOVE_FROM_CART,
      { courseId },
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.success) {
      toast.error(response?.message);
    } else {
      dispatch(removeFromCart(courseId));
    }

    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to remove course from cart!");
  }
  toast.dismiss(toastId);
  return result;
};

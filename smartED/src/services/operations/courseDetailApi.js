import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apiEndPoints";
import { categories } from "../apiEndPoints";

const {
  GET_INSTRUCTOR_COURSES,
  DELETE_INSTRUCTOR_COURSE,
  EDIT_COURSE_API,
  CREATE_COURSE_API,
} = courseEndpoints;

const { CATEGORIES_API } = categories;

// get instructor courses
export const fetchInstructorCourses = async (token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_COURSES, null, {
      Authorization: `Bearer ${token}`,
    });

    // console.log("instructor courses", response);

    result = response?.data;
    // console.log(result);
  } catch (err) {
    console.log(err);
    toast.error("Unable to fetch courses");
  }
  toast.dismiss(toastId);
  return result;
};

// delete instructor courses
export const deleteInstructorCourse = async (data, token) => {
  const toastId = toast.loading("Loading...");
  try {
    //  make an api call
    const response = await apiConnector(
      "DELETE",
      DELETE_INSTRUCTOR_COURSE,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    // console.log(response);
    if (response?.success) {
      toast.success(response.message);
    }
  } catch (error) {
    console.log(error);
    toast.error("Unable to delete course");
  }
  toast.dismiss(toastId);
};

//  fetch all categories
export const fetchCategories = async () => {
  let result = [];
  try {
    //  make an api call
    const response = await apiConnector("GET", CATEGORIES_API, null);
    // console.log(response);

    if (!response?.success) {
      throw new Error("Could Not Fetch Course Categories");
    }

    result = response?.data;
  } catch (err) {
    console.log(err);
    toast.error(err.message);
  }
  return result;
};

//  create course api
export const createCourse = async (data, token) => {
  let result = [];
  const toastId = toast.loading("Loading...");

  try {
    //  make an api call to create course
    const response = await apiConnector("POST", CREATE_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    // console.log(response);

    if (response?.success) {
      toast.success(response?.message);
    }

    result = response?.data;
  } catch (err) {
    console.log(err);
    toast.error("Unable to create course");
  }
  toast.dismiss(toastId);
  return result;
};

//  make api call for edit course to backend
export const editCourseDetails = async (data, token) => {
  let result = [];
  const toastId = toast.loading("Loading...");
  try {
    //  make an api call
    const response = await apiConnector("PUT", EDIT_COURSE_API, data, {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    });

    console.log("printing edited data: ", response);

    if (response?.success) {
      toast.success(response?.message);
    }
    result = response?.data;
  } catch (err) {
    console.log(err);
    toast.error(err.message);
  }
  toast.dismiss(toastId);
  return result;
};

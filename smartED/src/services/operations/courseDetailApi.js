import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apiEndPoints";
import { categories } from "../apiEndPoints";

const {
  GET_INSTRUCTOR_COURSES,
  DELETE_INSTRUCTOR_COURSE,
  EDIT_COURSE_API,
  CREATE_COURSE_API,
  CREATE_SECTION_API,
  UPDATE_SECTION_API,
  DELETE_SECTION_API,
  ADD_SUB_SECTION_API,
  DELETE_SUB_SECTION_API,
  UPDATE_SUB_SECTION_API,
  GET_SPECIFIC_COURSE_DETAILS,
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

//  make an api call for create subSection
export const createSection = async (data, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    // make api call
    const response = apiConnector("POST", CREATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log("printing response", response);
    result = response?.updatedCourse
    console.log(result);

    // if response is true, then show toast
    if (response.success) {
      toast.success(response.message);
    }
  } catch (err) {
    console.log(err);
    toast.error("Unable to create Section");
  }
  toast.dismiss(toastId);
  return result;
};

//  make an api call for update Section
export const updateSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");

  try {
    //  make an api calll
    const response = await apiConnector("PUT", UPDATE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    console.log(response);
    if (response?.success) {
      toast.success(response.message);
    }
    result = response?.data;
  } catch (err) {
    console.log(err);
    toast.error("Unable to update Section");
  }
  toast.dismiss(toastId);
  return result;
};

// make an api call for delete section
export const deleteSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    //  make api call for deletion
    const response = await apiConnector("POST", DELETE_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    // console.log(response);
    if (response?.success) {
      toast.success(response?.message);
    }

    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to delete section");
  }
  toast.dismiss(toastId);
  return result;
};

//  make an api call for adding subsection
export const addSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    //  make api call for deletion
    const response = await apiConnector("POST", ADD_SUB_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    // console.log(response);
    if (response?.success) {
      toast.success(response?.message);
    }

    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to add Sub Section");
  }
  toast.dismiss(toastId);
  return result;
};

//  make an api call for updating subsection
export const updateSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    //  make api call for deletion
    const response = await apiConnector("POST", UPDATE_SUB_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    // console.log(response);
    if (response?.success) {
      toast.success(response?.message);
    }

    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to update Sub Section");
  }
  toast.dismiss(toastId);
  return result;
};

//  make an api call for deleting subsection
export const deleteSubSection = async (data, token) => {
  let result = null;
  const toastId = toast.loading("Loading...");
  try {
    //  make api call for deletion
    const response = await apiConnector("POST", DELETE_SUB_SECTION_API, data, {
      Authorization: `Bearer ${token}`,
    });

    // console.log(response);
    if (response?.success) {
      toast.success(response?.message);
    }

    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to delete Sub Section");
  }
  toast.dismiss(toastId);
  return result;
};

//  get details of specific course
export const getSpecificCourseDetail = async (courseId, token) => {
  const toastId = toast.loading("Loading...");
  let result = null;
  try {
    //  make an api call
    const response = await apiConnector(
      "POST",
      GET_SPECIFIC_COURSE_DETAILS,
      {
        courseId,
      },
      { Authorization: `Bearer ${token}` }
    );

    console.log(response);
    if (!response?.success) {
      toast.error(response?.message);
    }
    result = response?.data;
  } catch (error) {
    console.log(error);
    toast.error("Unable to get course detail");
  }
  toast.dismiss(toastId);
  return result;
};

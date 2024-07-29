import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { courseEndpoints } from "../apiEndPoints";

const { GET_INSTRUCTOR_COURSES, DELETE_INSTRUCTOR_COURSE } = courseEndpoints;

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

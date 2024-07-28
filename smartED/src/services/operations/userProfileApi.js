import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { userDataEndPoints } from "../apiEndPoints";

const { ENROLLED_COURSE_DATA_API } = userDataEndPoints;

export const getEnrolledCourseDetail = async (token) => {
  const toastId = toast.loading("Loading...");
  let result = [];
  try {
    const response = await apiConnector("GET", ENROLLED_COURSE_DATA_API, null, {
      Authorization: `Bearer ${token}`,
    });

    console.log(response);

    result = response.data;
    console.log(result);
  } catch (error) {
    console.log(error.message);
    toast.error("Unable to fetch enrolled courses");
  }
  toast.dismiss(toastId);
  return result;
};

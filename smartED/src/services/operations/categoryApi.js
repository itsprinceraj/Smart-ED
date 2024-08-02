import toast from "react-hot-toast";
import { apiConnector } from "../apiConnector";
import { categories } from "../apiEndPoints";

const { CATALOG_PAGE_API } = categories;

export const getCatalogPage = async (categoryId) => {
  let result = [];
  let response;
  const toastId = toast.loading("Loading...");
  try {
    //  make an api call
    response = await apiConnector("POST", CATALOG_PAGE_API, {
      categoryId: categoryId,
    });

    console.log("printing service response:", response);
    if (!response?.success) {
      throw new Error("cant fetch catalog page");
    }

    result = response;
    console.log("printing result in category service:", result);
  } catch (error) {
    console.log(error);
    toast.error(response.message);
  }

  toast.dismiss(toastId);
  return result;
};

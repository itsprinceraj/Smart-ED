// write api connector function witch will interact with backend

import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL;
// take instance of axios create method , so that you can make a call with cetain parameters
const axiosCall = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    // Add any other default headers here
  },
});

export const apiConnector = async (
  method,
  url,
  data = null,
  headers = {},
  params = null
) => {
  try {
    const response = await axiosCall({
      method,
      url,
      data: data || undefined, // Only include data if it's not null
      headers: headers || undefined, // Only include headers if they're not null
      params: params || undefined, // Only include params if they're not null
    });

    // return response
    return response.data;
  } catch (err) {
    console.log("api call error", err.message);
    throw err;
  }
};

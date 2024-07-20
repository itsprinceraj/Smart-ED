// write api connector function witch will interact with backend

import axios from "axios";

// take instance of axios create method , so that you can make a call with cetain parameters
const axiosCall = axios.create({
  baseURL: "http://localhost:4000",
  headers: {
    "Content-Type": "application/json",
    // Add any other default headers here
  },
});

export const apiConnector = async (method, url, data, headers, params) => {
  try {
    const response = await axiosCall({
      method,
      url,
      data: data || null,
      headers: headers || null,
      params: params || null,
    });

    // return response
    return response.data;
  } catch (err) {
    console.log("api call error", err.message);
    throw err;
  }
};

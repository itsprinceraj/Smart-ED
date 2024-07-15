// write api connector function witch will interact with backend

import axios from "axios";

// take instance of axios create method , so that you can make a call with cetain parameters
export const axiosCall = axios.create({});

export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosCall({
    method: `${method}`,
    url: `${url}`,
    bodyData: bodyData ? bodyData : null,
    headers: headers ? headers : null,
    params: params ? params : null,
  });
};

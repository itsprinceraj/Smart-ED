import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";

export const ProtectedRoute = ({ children }) => {
  // const navigate = useNavigate
  const {token} = useSelector((state) => state.auth);
  console.log("printing token: ", token);
  if (token !== null) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
};

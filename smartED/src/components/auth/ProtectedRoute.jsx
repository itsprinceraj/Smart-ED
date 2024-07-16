import React from "react";
import { Navigate } from "react-router-dom";

export const ProtectedRoute = ({ children, isLoggedIn }) => {
  if (isLoggedIn) {
    return children;
  } else {
    return <Navigate to={"/login"} />;
  }
};

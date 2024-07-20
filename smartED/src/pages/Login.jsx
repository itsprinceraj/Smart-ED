import React from "react";
import { Template } from "../components/auth/Template";
import loginImage from "../assets/Images/login_page_img.png";

export const Login = (props) => {
  const templateData = {
    title: "Welcome Back",
    desc1: "Build Skills for Today, Tomorrow. and Beyond.",
    desc2: "Education to future-proof your Career",
    formType: "login",
  };
  return <Template data={templateData} image={loginImage} />;
};

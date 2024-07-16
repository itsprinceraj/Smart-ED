import React from "react";
import { Template } from "../components/auth/Template";
import signupImage from "../assets/Images/signuppageimg.png";
export const Signup = (props) => {
  const setIsLoggedIn = props.setIsLoggedIn;
  const templateData = {
    title: "Join the millions learning to code with Smart-ED for free",
    desc1: "Build Skills for Today, Tomorrow. and Beyond.",
    desc2: "Education to future-proof your Career",
    formType: "signup",
  };
  return (
    <Template
      data={templateData}
      image={signupImage}
      setIsLoggedIn={setIsLoggedIn}
    />
  );
};

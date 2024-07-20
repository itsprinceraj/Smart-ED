import React from "react";
import notfoundImg from "../assets/Images/notFound.svg";
import errorPageBg from "../assets/Images/center.svg";
import { useNavigate } from "react-router-dom";

export const ErrorPage = () => {
  const navigate = useNavigate();
  return (
    <div className=" relative w-full h-full flex flex-col items-center bg-white ">
      <img src={errorPageBg} alt="error-bg" height={350} width={320} />

      <img
        height={300}
        width={300}
        src={notfoundImg}
        alt="notFound-img"
        className="absolute top-[10%] "
      />

      <h2 className=" uppercase text-richblack-900 text-4xl ">
        404 - Page not found!
      </h2>
      <p className=" text-richblack-800 text-lg mt-6 px-10 w-[35%] text-center">
        The Page you are looking for might have been removed had its name
        changed or temporarily unavailable.
      </p>
      <button
        onClick={() => navigate("/")}
        className=" uppercase bg-richblack-700 text-richblack-25 hover:text-white transition-all duration-200 rounded-full px-6 py-3 flex items-center justify-center hover:scale-125 text-sm  shadow-sm shadow-richblack-400 mb-14 mt-10 "
      >
        Go To Homepage
      </button>
    </div>
  );
};

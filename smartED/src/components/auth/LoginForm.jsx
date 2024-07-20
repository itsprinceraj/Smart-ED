import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { loginRequest } from "../../services/operations/authApiHandler";

export const LoginForm = () => {
  //take instance of useDispatch hook
  const dispatch = useDispatch();

  //navigation for login
  const navigate = useNavigate();

  // handling FormData
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // showPassword state

  const [showPassword, setShowPassword] = useState(false);

  const changeHandler = (event) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  // accumulate data
  const { email, password } = formData;

  const submitHandler = (event) => {
    event.preventDefault();
    dispatch(loginRequest(email, password, navigate));
  };
  return (
    <form
      className=" flex flex-col w-full mt-6 gap-y-4 "
      onSubmit={submitHandler}
    >
      <label className="w-full">
        <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
          Email Address <sup className=" text-pink-200 ">*</sup>
        </p>
        <input
          className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
          type="email"
          required
          placeholder="Enter email id"
          value={email}
          name="email"
          onChange={changeHandler}
        />
      </label>

      <label className="w-full relative">
        <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
          Password <sup className=" text-pink-200 ">*</sup>
        </p>
        <input
          className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
          type={showPassword ? "text" : "password"}
          required
          placeholder="Enter Password"
          value={password}
          name="password"
          onChange={changeHandler}
        />

        <span
          className=" absolute top-[38px] right-3 cursor-pointer  "
          onClick={() => setShowPassword((prevState) => !prevState)}
        >
          {showPassword ? (
            <AiFillEye fontSize={24} fill="#AFB2BF" />
          ) : (
            <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
          )}
        </span>
      </label>

      <Link>
        <p className=" text-xs mt-1 text-blue-100 text-end ">
          Forgot Password?
        </p>
      </Link>

      <button
        type="submit"
        className=" bg-yellow-50 rounded-[8px] font-md text-richblack-900 px-[12px]  py-[8px] "
      >
        Sign In
      </button>
    </form>
  );
};

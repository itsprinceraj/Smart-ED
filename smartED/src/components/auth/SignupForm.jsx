import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
export const SignupForm = ({ setIsLoggedIn }) => {
  // handling FormData
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    createPass: "",
    confirmPass: "",
  });

  // for student and instructor tab switching
  const [accountType, setAccountType] = useState("student");

  // navigation for signup form
  const navigate = useNavigate();

  // showPassword state

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  const changeHandler = (event) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const submitHandler = (event) => {
    event.preventDefault();
    if (formData.createPass !== formData.confirmPass) {
      toast.error("Password does not match");
    } else {
      setIsLoggedIn(true);
      toast.success("Account Created Successfully");
      navigate("/login");
      const finalData = {
        ...formData,
        accountType,
      };
      console.log(finalData);
    }
  };
  return (
    <div className=" flex flex-col justify-center  gap-y-2 ">
      {/* student - Instructor Tab */}

      <div className="flex gap-x-1 p-1 bg-richblack-800 text-richblack-5  rounded-full my-6  max-w-max">
        <button
          className={`${
            accountType === "student"
              ? "bg-richblack-900 text-richblack-5"
              : "text-richblack-200"
          } py-2 px-5 rounded-full transition-all duration-200`}
          onClick={() => setAccountType("student")}
        >
          Student
        </button>
        <button
          className={`${
            accountType === "instructor"
              ? "bg-richblack-900 text-richblack-5"
              : "text-richblack-200"
          } py-2 px-5 rounded-full transition-all duration-200`}
          onClick={() => setAccountType("instructor")}
        >
          Instructor
        </button>
      </div>

      {/* signup form */}

      <form onSubmit={submitHandler}>
        {/* FirstName and LastName field */}

        <div className=" flex gap-4 mt-4 ">
          <label>
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              First Name<sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type="text"
              required
              placeholder="Enter first name"
              value={formData.firstName}
              name="firstName"
              onChange={changeHandler}
            />
          </label>

          <label>
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              Last Name <sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type="text"
              required
              placeholder="Enter last name"
              value={formData.lastName}
              name="lastName"
              onChange={changeHandler}
            />
          </label>
        </div>

        <label className="  ">
          <p className=" mt-4 text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
            Email Address <sup className=" text-pink-200 ">*</sup>
          </p>
          <input
            className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
            type="email"
            required
            placeholder="Enter email id"
            value={formData.email}
            name="email"
            onChange={changeHandler}
          />
        </label>

        {/* create and confirm password field */}

        <div className=" flex gap-4 mt-4 relative">
          <label className="relative">
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              Create Password <sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type={showPassword ? "text" : "password"}
              required
              placeholder="Enter Password"
              value={formData.createPass}
              name="createPass"
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

          <label>
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              Confirm Password <sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type={showConfirmPass ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={formData.confirmPass}
              name="confirmPass"
              onChange={changeHandler}
            />

            <span
              className=" absolute top-[38px] right-3 cursor-pointer  "
              onClick={() => setShowConfirmPass((prevState) => !prevState)}
            >
              {showConfirmPass ? (
                <AiFillEye fontSize={24} fill="#AFB2BF" />
              ) : (
                <AiFillEyeInvisible fontSize={24} fill="#AFB2BF" />
              )}
            </span>
          </label>
        </div>

        <button className=" bg-yellow-50 rounded-[8px] font-md text-richblack-900 px-[12px]  py-[8px] w-full mt-10">
          Create Account
        </button>
      </form>
    </div>
  );
};

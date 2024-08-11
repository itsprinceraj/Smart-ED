import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utilities/constants";
import Tab from "../common/Tab";
import { useDispatch } from "react-redux";
import { setSignupData } from "../../redux/slices/authSlice";
import { sendOtp } from "../../services/operations/authApiHandler";
import { LiaTimesCircle } from "react-icons/lia";
import { LuCheckCircle } from "react-icons/lu";
export const SignupForm = () => {
  const dispatch = useDispatch();

  // handling FormData
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  // for student and instructor tab switching
  const [accountType, setAccountType] = useState("Student");

  // navigation for signup form
  const navigate = useNavigate();

  // showPassword state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // accumulate form data
  const { firstName, lastName, email, password, confirmPassword } = formData;

  const changeHandler = (event) => {
    setFormData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  // password validation check
  const validatePassword = (password) => {
    return {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
  };

  const passwordValidations = validatePassword(password);

  const submitHandler = (event) => {
    event.preventDefault();

    // Check if passwords match
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    // Check if password meets all validations
    const isPasswordValid = Object.values(passwordValidations).every(Boolean);
    if (!isPasswordValid) {
      toast.error("Password does not meet all requirements");
      return;
    }

    // accumulate formdata and accountType

    const signupData = {
      ...formData,
      accountType,
    };

    // dispatch signup data
    dispatch(setSignupData(signupData));

    // dispatch email so the email verification can be done
    dispatch(sendOtp(formData.email, navigate));

    // Reset
    // setFormData({
    //   firstName: "",
    //   lastName: "",
    //   email: "",
    //   password: "",
    //   confirmPassword: "",
    // });
    // setAccountType(ACCOUNT_TYPE.STUDENT);
  };

  // data to pass to Tab component
  const tabData = [
    {
      id: 1,
      tabName: "Student",
      type: ACCOUNT_TYPE.STUDENT,
    },
    {
      id: 2,
      tabName: "Instructor",
      type: ACCOUNT_TYPE.INSTRUCTOR,
    },
  ];

  return (
    <div className=" flex flex-col justify-center  gap-y-2  ">
      {/* student - Instructor Tab */}

      <Tab tabData={tabData} field={accountType} setField={setAccountType} />

      {/* signup form */}

      <form onSubmit={submitHandler}>
        {/* FirstName and LastName field */}

        <div className=" flex gap-4 mt-4 w-full ">
          {/* first name */}
          <label className="flex w-full flex-col">
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              First Name<sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type="text"
              required
              placeholder="Enter first name"
              value={firstName}
              name="firstName"
              onChange={changeHandler}
            />
          </label>

          {/*  lastname */}

          <label className="flex w-full flex-col">
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              Last Name <sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type="text"
              required
              placeholder="Enter last name"
              value={lastName}
              name="lastName"
              onChange={changeHandler}
            />
          </label>
        </div>

        {/*  emailadress */}
        <label className="">
          <p className=" mt-4 text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
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

        {/* create and confirm password field */}

        <div className=" flex flex-col gap-4 mt-4 relative">
          <label className="relative flex w-full flex-col">
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              Create Password <sup className=" text-pink-200 ">*</sup>
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

          <label className="flex w-full flex-col">
            <p className=" text-[0.875rem] text-richblack-5 mb-1 leading-[1.375rem] ">
              Confirm Password <sup className=" text-pink-200 ">*</sup>
            </p>
            <input
              className=" bg-richblack-800 rounded-[0.5rem] text-richblack-5 w-full p-[12px] "
              type={showConfirmPass ? "text" : "password"}
              required
              placeholder="Confirm Password"
              value={confirmPassword}
              name="confirmPassword"
              onChange={changeHandler}
            />

            <span
              className=" absolute top-[126px] right-3 cursor-pointer flex flex-col "
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

        {/* password validation label */}

        <ul className="mt-4 flex lg:flex-row md:flex-col  flex-wrap lg:gap-6 gap-2 sm:gap-6 ">
          {/* first div */}
          <div className=" flex flex-col gap-2 ">
            {/* for length of characters */}
            <li className="flex items-center">
              {passwordValidations.minLength ? (
                <LuCheckCircle className="mr-2 text-caribbeangreen-200" />
              ) : (
                <LiaTimesCircle className="text-pink-200 mr-2" fontSize={18} />
              )}
              <p
                className={`text-sm ${
                  passwordValidations.minLength
                    ? "text-caribbeangreen-300"
                    : "text-pink-200"
                }`}
              >
                8 characters minimum
              </p>
            </li>

            {/* for upppercase */}
            <li className="flex items-center">
              {passwordValidations.hasUppercase ? (
                <LuCheckCircle className="mr-2 text-caribbeangreen-200" />
              ) : (
                <LiaTimesCircle className="text-pink-200 mr-2" fontSize={18} />
              )}
              <p
                className={`text-sm ${
                  passwordValidations.hasUppercase
                    ? "text-caribbeangreen-300"
                    : "text-pink-200"
                }`}
              >
                one upppercase character
              </p>
            </li>

            {/* for lowercase */}
            <li className="flex items-center">
              {passwordValidations.hasLowercase ? (
                <LuCheckCircle className="mr-2 text-caribbeangreen-200" />
              ) : (
                <LiaTimesCircle className="text-pink-200 mr-2" fontSize={18} />
              )}
              <p
                className={`text-sm ${
                  passwordValidations.hasLowercase
                    ? "text-caribbeangreen-300"
                    : "text-pink-200"
                }`}
              >
                one lowercase character
              </p>
            </li>
          </div>

          {/* second div */}
          <div className="flex flex-col gap-1">
            {/* for numbers */}
            <li className="flex items-center">
              {passwordValidations.hasNumber ? (
                <LuCheckCircle className="mr-2 text-caribbeangreen-200" />
              ) : (
                <LiaTimesCircle className="text-pink-200 mr-2" fontSize={18} />
              )}
              <p
                className={`text-sm ${
                  passwordValidations.hasNumber
                    ? "text-caribbeangreen-300"
                    : "text-pink-200"
                }`}
              >
                one number
              </p>
            </li>

            {/*  for special symbol */}
            <li className="flex items-center">
              {passwordValidations.hasSpecialChar ? (
                <LuCheckCircle className="mr-2 text-caribbeangreen-200" />
              ) : (
                <LiaTimesCircle className="text-pink-200 mr-2" fontSize={18} />
              )}
              <p
                className={`text-sm ${
                  passwordValidations.hasSpecialChar
                    ? "text-caribbeangreen-300"
                    : "text-pink-200"
                }`}
              >
                one special character
              </p>
            </li>
          </div>
        </ul>

        <button className=" bg-yellow-50 rounded-[8px] font-md text-richblack-900 px-[12px]  py-[8px] w-full mt-10">
          Create Account
        </button>
      </form>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { BiArrowBack, BiRefresh } from "react-icons/bi";
import { resetPasswordRequest } from "../services/operations/authApiHandler";

import { LuCheckCircle } from "react-icons/lu";
import { LiaTimesCircle } from "react-icons/lia";
import toast from "react-hot-toast";
import { RiRefreshFill } from "react-icons/ri";

export const UpdatePassword = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);

  // usedispatch hook
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  // get loader from authSlice
  const { loading } = useSelector((state) => state.auth);

  //   onChange handler
  const onChangeHandler = (event) => {
    setFormData((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };

  // extract data from formdata
  const { password, confirmPassword } = formData;

  // extract Token
  const token = location.pathname.split("/").at(-1);
  // console.log(token);

  //   Submit handler
  const onSubmitHandler = (event) => {
    event.preventDefault();

    dispatch(resetPasswordRequest(password, confirmPassword, token, navigate));
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

  //  maintain a setTimer state for Regenerating token
  const [counter, setCounter] = useState(30);

  //  show counter on furst render
  useEffect(() => {
    const timer = setTimeout(() => setCounter(counter - 1), 1000);

    return () => clearTimeout(timer);
  }, [counter]);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose New Password
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and youre all set.
          </p>

          {/*  update password form */}

          <form onSubmit={onSubmitHandler}>
            {/* new password input  */}

            <label className="relative">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPass ? "text" : "password"}
                placeholder="Enter new password"
                value={password}
                name="password"
                onChange={onChangeHandler}
                className="form-style w-full !pr-10"
              />
              <span
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showPass ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            {/* confirm pass input */}

            <label className="relative mt-3 block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPass ? "text" : "password"}
                placeholder="Enter new password"
                value={confirmPassword}
                name="confirmPassword"
                onChange={onChangeHandler}
                className="form-style w-full !pr-10"
              />
              <span
                onClick={() => setShowConfirmPass(!showConfirmPass)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showConfirmPass ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <ul className="mt-4 flex  flex-wrap gap-14 justify-center items-center ">
              {/* first div */}
              <div className=" flex flex-col gap-1 ">
                {/* for length of characters */}
                <li className="flex items-center">
                  {passwordValidations.minLength ? (
                    <LuCheckCircle className="mr-2 text-caribbeangreen-200" />
                  ) : (
                    <LiaTimesCircle
                      className="text-pink-200 mr-2"
                      fontSize={18}
                    />
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
                    <LiaTimesCircle
                      className="text-pink-200 mr-2"
                      fontSize={18}
                    />
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
                    <LiaTimesCircle
                      className="text-pink-200 mr-2"
                      fontSize={18}
                    />
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
                    <LiaTimesCircle
                      className="text-pink-200 mr-2"
                      fontSize={18}
                    />
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
                    <LiaTimesCircle
                      className="text-pink-200 mr-2"
                      fontSize={18}
                    />
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

            {/* button  */}
            {counter > 0 ? (
              <p className="mt-4 ml-3 text-yellow-200">
                {" "}
                {`You can Regenerate your reset token after ${counter} seconds`}
              </p>
            ) : (
              <button
                type="button"
                className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 flex justify-center items-center gap-2"
                onClick={() => navigate("/reset-password")}
              >
                <BiRefresh size={24} /> Regenerate Reset Token
              </button>
            )}
            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-4 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-100 hover:text-richblack-5 transition-all duration-200">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

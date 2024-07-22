import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { resetPasswordToken } from "../services/operations/authApiHandler";

export const ResetPassword = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
  });
  const [emailSent, setEmailSent] = useState(false);

  const { loading } = useSelector((state) => state.auth);

  const { email } = formData;

  // count down for sending email
  const [countDown, setCountDown] = useState(0);

  const onChangeHandler = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      [event.target.name]: event.target.value,
    }));
  };

  // hadling form action
  const onSubmitHandler = (event) => {
    event.preventDefault();
    dispatch(resetPasswordToken(email, setEmailSent)); // dispatch returns reference of the function from redux store and can be further used;
    setCountDown(60); // start countDown Timer
  };

  // logging form data
  // console.log("print form data: ", formData);

  // countDown Logic
  useEffect(() => {
    const timer = setTimeout(() => setCountDown(countDown - 1), 1000);

    return () => clearTimeout(timer);
  }, [countDown, emailSent]);

  return (
    <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            {!emailSent ? "Reset your password" : "Check email"}
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            {!emailSent
              ? "Have no fear. We'll email you instructions to reset your password. If you dont have access to your email we can try account recovery"
              : `We have sent the reset email to ${email}`}
          </p>
          <form onSubmit={onSubmitHandler}>
            {!emailSent && (
              <label className="w-full">
                <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                  Email Address <sup className="text-pink-200">*</sup>
                </p>
                <input
                  required
                  type="email"
                  name="email"
                  value={email}
                  onChange={onChangeHandler}
                  placeholder="Enter email address"
                  className="form-style w-full"
                />
              </label>
            )}

            {/*  timeout label */}
            {emailSent && countDown > 0 && (
              <p className="font-medium text-richblack-50  ">
                You can resend password reset link after{" "}
                <span className=" text-pink-200 ">{countDown}</span> seconds
              </p>
            )}
            <button
              type="submit"
              disabled={emailSent && countDown > 0}
              className={`mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900 ${
                emailSent && countDown > 0 && " bg-yellow-50 opacity-70 "
              }`}
            >
              {!emailSent ? "Reset Password" : "Resend Email"}
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
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

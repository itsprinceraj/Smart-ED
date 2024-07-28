import React, { useEffect, useState } from "react";
import { RxCountdownTimer } from "react-icons/rx";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp, signupRequest } from "../services/operations/authApiHandler";

export const VerifyEmail = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { signupData, loading } = useSelector((state) => state.auth);
  const [otp, setOtp] = useState("");

  // if signupdata does not contain data , then handle it
  useEffect(() => {
    if (!signupData) {
      navigate("/signup");
    }
  }, []);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    // extract data from signup data
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
    } = signupData;

    // Dispatch funtion
    dispatch(
      signupRequest(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otp,
        navigate
      )
    );
  };

  const onClickHandler = (event) => {
    event.preventDefault();
    dispatch(sendOtp(signupData.email,navigate));
  };
  return (
    <div className="min-h-[calc(100vh-3.5rem)] grid place-items-center">
      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-richblack-5 font-semibold text-[1.875rem] leading-[2.375rem]">
            Verify Email
          </h1>
          <p className="text-[1.125rem] leading-[1.625rem] my-4 text-richblack-100">
            A verification code has been sent to you. Enter the code below
          </p>

          {/* otp input component  */}

          <form onSubmit={onSubmitHandler}>
            <OtpInput
              shouldAutoFocus={true}
              value={otp}
              onChange={setOtp}
              numInputs={6}
              renderInput={(props) => (
                <input
                  {...props}
                  placeholder="-"
                  style={{
                    boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                  }}
                  className="w-[48px] lg:w-[60px] border-0 bg-richblack-800 rounded-[0.5rem] text-richblack-5 aspect-square text-center focus:border-0 focus:outline-2 focus:outline-yellow-50 text-2xl"
                />
              )}
              containerStyle={{
                justifyContent: "space-between",
                gap: "0 6px",
              }}
            />

            {/* verify button  */}

            <button
              type="submit"
              className="w-full bg-yellow-50 py-[12px] px-[12px] rounded-[8px] mt-6 font-medium text-richblack-900"
            >
              Verify Email
            </button>

            <div className=" flex justify-end mt-3 mr-3">
              <button
                className="flex items-center  text-blue-100 gap-x-2"
                onClick={onClickHandler}
              >
                <RxCountdownTimer />
                Resend it
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

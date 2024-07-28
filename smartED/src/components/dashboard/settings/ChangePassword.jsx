import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { IconBtn } from "../../common/IconBtn";
import { useSelector } from "react-redux";
import { changeAccountPass } from "../../../services/operations/settingsApi";
import { LiaTimesCircle } from "react-icons/lia";
import { LuCheckCircle } from "react-icons/lu";

export const ChangePassword = () => {
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  //  maintain a state for password validation
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasLowercase: false,
    hasUppercase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  //  useForm hook for managing form data
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  //  validation password on ui

  const validatePassword = (password) => {
    const validations = {
      minLength: password.length >= 8,
      hasLowercase: /[a-z]/.test(password),
      hasUppercase: /[A-Z]/.test(password),
      hasNumber: /\d/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };
    setPasswordValidations(validations);
    return (
      validations.minLength &&
      validations.hasLowercase &&
      validations.hasUppercase &&
      validations.hasNumber &&
      validations.hasSpecialChar
    );
  };

  //  create a function for form submission
  const handleChangePassForm = async (data) => {
    try {
      console.log(data);
      // call the function with token and data
      await changeAccountPass(token, data);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit(handleChangePassForm)}>
        <div className="my-10 flex flex-col gap-y-6 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-8 px-12">
          <h2 className="text-lg font-semibold text-richblack-5">Password</h2>
          <div className="flex flex-col gap-5 lg:flex-row">
            {/* current password field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="oldPassword" className="lable-style">
                Current Password
              </label>
              <input
                type={showCurrentPass ? "text" : "password"}
                name="oldPassword"
                id="oldPassword"
                placeholder="Enter Current Password"
                className="form-style"
                {...register("oldPassword", { required: true })}
              />
              <span
                onClick={() => setShowCurrentPass((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showCurrentPass ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.oldPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter your Current Password.
                </span>
              )}
            </div>

            {/* new password field */}
            <div className="relative flex flex-col gap-2 lg:w-[48%]">
              <label htmlFor="newPassword" className="lable-style">
                New Password
              </label>
              <input
                type={showNewPass ? "text" : "password"}
                name="newPassword"
                id="newPassword"
                placeholder="Enter New Password"
                className="form-style"
                {...register("newPassword", {
                  required: true,
                  validate: validatePassword,
                })}
                onChange={(e) => validatePassword(e.target.value)}
              />
              <span
                onClick={() => setShowNewPass((prev) => !prev)}
                className="absolute right-3 top-[38px] z-[10] cursor-pointer"
              >
                {showNewPass ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
              {errors.newPassword && (
                <span className="-mt-1 text-[12px] text-yellow-100">
                  Please enter a valid New Password.
                </span>
              )}
            </div>
          </div>

          {/* password validation checks */}
          <ul className="mt-4 flex flex-wrap gap-5  justify-center items-center">
            <div className="flex flex-row gap-5">
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
                  One uppercase character
                </p>
              </li>
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
                  One lowercase character
                </p>
              </li>
            </div>
            <div className="flex flex-row gap-5">
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
                  One number
                </p>
              </li>
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
                  One special character
                </p>
              </li>
            </div>
          </ul>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={() => {
              navigate("/dashboard/my-profile");
            }}
            className="cursor-pointer rounded-md bg-richblack-700 py-2 px-5 font-semibold text-richblack-50"
          >
            Cancel
          </button>
          <IconBtn type="submit" text="Update" />
        </div>
      </form>
    </>
  );
};

import React, { useState } from "react";
import { IconBtn } from "../../common/IconBtn";
import { useSelector, useDispatch } from "react-redux";
import { buyCourse } from "../../../services/operations/paymentApi";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../../utilities/constants";
import { ConfirmationModal } from "../../common/ConfirmationModal";

export const CartCourseTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);
  const [confirmationModal, setConfirmationModal] = useState(null);
  // console.log(user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  //  write a function to hadle buy course button , for payment integration
  const handleBuyCourse = () => {
    if (token) {
      if (user && user?.accountType === ACCOUNT_TYPE?.INSTRUCTOR) {
        toast.error("You are an Instructor. You can't buy a course.");
        return;
      } else {
        const courses = cart.map((course) => course._id);
        buyCourse(token, courses, user, navigate, dispatch);
      }
    } else {
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to Purchase Course",
        btn1: "Login",
        btn2: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
    }
  };
  return (
    <div className="min-w-[280px] rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="mb-1 text-sm font-medium text-richblack-300">Total:</p>
      <p className="mb-6 text-3xl font-medium text-yellow-100">₹ {total}</p>
      <IconBtn
        text="Buy Now"
        onclick={handleBuyCourse}
        customClasses="w-full justify-center"
      />

      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </div>
  );
};

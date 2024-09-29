import React from "react";
import { FaShareSquare } from "react-icons/fa";
import { BsFillCaretRightFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import { ACCOUNT_TYPE } from "../../utilities/constants";

import {
  addIntoCart,
  removeCourseFromCart,
} from "../../services/operations/userProfileApi";
import { addToCart, removeFromCart } from "../../redux/slices/cartSlice";

export const CourseDetailsCard = ({
  course,
  handleBuyCourse,
  setConfirmationModal,
}) => {
  //  destructure data from course
  const { price: CurrentPrice } = course;

  // console.log("printing course", course);

  //  get all mandatory data
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  let cartItems = cart.some((item) => item._id == course._id);

  //  handle share function
  const handleShare = () => {
    // copy current url
    copy(window.location.href);
    toast.success("Link copy to clipboard");
  };

  //  handle add to cart
  const handleAddToCart = async (dispatch, token, course, user, cartItems) => {
    // If user is an instructor, prevent course purchase
    if (user?.accountType === ACCOUNT_TYPE?.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }

    // Function to handle adding course to cart
    const addCourseToCart = async () => {
      if (token) {
        await addIntoCart(dispatch, token, course);
      } else {
        dispatch(addToCart(course));
      }
    };

    const removeCourseFromCartHandler = async () => {
      if (token) {
        await removeCourseFromCart(dispatch, token, course._id);
      } else {
        dispatch(removeFromCart(course._id));
      }
    };

    // If course already exists in the cart, remove it
    if (cartItems) {
      removeCourseFromCartHandler();
    } else {
      addCourseToCart();
    }
  };

  return (
    <>
      <div
        className={`flex flex-col gap-4 rounded-md bg-richblack-700 p-4 text-richblack-5`}
      >
        {/* Course Image */}
        <img
          src={course?.thumbnail}
          alt={course?.courseName}
          className="max-h-[300px] min-h-[180px] w-[400px] overflow-hidden rounded-2xl object-cover md:max-w-full"
          loading="lazy"
        />

        <div className="px-4">
          <div className="space-x-3 pb-4 text-3xl font-semibold">
            Rs. {CurrentPrice}
          </div>
          <div className="flex flex-col gap-4">
            <button
              className="yellowButton"
              onClick={
                user && course?.studentsEnrolled?.includes(user?._id)
                  ? () => navigate("/dashboard/enrolled-courses")
                  : handleBuyCourse
              }
            >
              {user && course?.studentsEnrolled?.includes(user?._id)
                ? "Go To Course"
                : "Buy Now"}
            </button>
            {(!user || !course?.studentsEnrolled?.includes(user?._id)) && (
              <button
                onClick={() =>
                  handleAddToCart(dispatch, token, course, user, cartItems)
                }
                className="blackButton"
              >
                {cartItems ? "Remove From Cart" : "Add to Cart"}
              </button>
            )}
          </div>
          <div>
            <p className="pb-3 pt-6 text-center text-sm text-richblack-25">
              30-Day Money-Back Guarantee
            </p>
          </div>

          <div className={``}>
            <p className={`my-2 text-xl font-semibold `}>
              This Course Includes :
            </p>
            <div className="flex flex-col gap-3 text-sm text-caribbeangreen-100">
              {course?.instructions?.map((item, index) => {
                return (
                  <p className={`flex gap-2`} key={index}>
                    <BsFillCaretRightFill />
                    <span>{item}</span>
                  </p>
                );
              })}
            </div>
          </div>
          <div className="text-center">
            <button
              className="mx-auto flex items-center gap-2 py-6 text-yellow-100 "
              onClick={handleShare}
            >
              <FaShareSquare size={15} /> Share
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

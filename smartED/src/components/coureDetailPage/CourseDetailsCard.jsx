import React from "react";
import { FaShareSquare } from "react-icons/fa";
import { BsFillCaretRightFill } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import copy from "copy-to-clipboard";
import { ACCOUNT_TYPE } from "../../utilities/constants";
import { addToCart } from "../../redux/slices/cartSlice";

export const CourseDetailsCard = ({
  course,
  handleBuyCourse,
  setConfirmationModal,
}) => {
  //  destructure data from course
  const { price: CurrentPrice } = course;

  console.log("printing course", course);

  //  get all mandatory data
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  //  handle share function
  const handleShare = () => {
    // copy current url
    copy(window.location.href);
    toast.success("Link copy to clipboard");
  };

  //  handle add to cart
  const handleAddToCart = () => {
    //  check if user is student or not
    if (user && user?.accountType === ACCOUNT_TYPE?.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.");
      return;
    }

    //  if user is student and user is logged in then add course to cart
    if (token) {
      dispatch(addToCart(course));
      return;
    } else {
      //  if user is not logged in the show them a modal
      setConfirmationModal({
        text1: "You are not logged in!",
        text2: "Please login to add To Cart",
        btn1: "Login",
        btn2: "Cancel",
        btn1Handler: () => navigate("/login"),
        btn2Handler: () => setConfirmationModal(null),
      });
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
              <button onClick={handleAddToCart} className="blackButton">
                Add to Cart
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

import React, { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import ReactStars from "react-rating-stars-component";
import { removeCourseFromCart } from "../../../services/operations/userProfileApi";
import { removeFromCart } from "../../../redux/slices/cartSlice";

export const TotalCartCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  return (
    <div className="flex flex-1 flex-col">
      {cart && cart.length > 0 ? (
        cart.map((course, indx) => (
          <div
            key={course?._id}
            className={`flex w-full flex-wrap items-start justify-between gap-6 ${
              indx !== cart.length - 1 && "border-b border-b-richblack-400 pb-6"
            } ${indx !== 0 && "mt-6"} `}
          >
            <div className="flex flex-1 flex-col gap-4 xl:flex-row">
              {/*  thumnail image */}
              <img
                src={course?.thumbnail}
                alt={course?.courseName}
                className="h-[148px] w-[220px] rounded-lg object-cover"
              />
              {/*  course name  */}
              <div className="flex flex-col space-y-1">
                <p className="text-lg font-medium text-richblack-5">
                  {course?.courseName}
                </p>
                <p className="text-sm text-richblack-300">
                  {course?.category?.name}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-5">
                    {course?.ratingAndReviews?.length}
                  </span>

                  {/*  review stars */}
                  <ReactStars
                    count={5}
                    value={course?.ratingAndReviews?.length}
                    size={20}
                    edit={false}
                    isHalf={true}
                    activeColor="#ffd700"
                    emptyIcon={<FaStar />}
                    fullIcon={<FaStar />}
                  />
                  <span className="text-richblack-400">
                    {course?.ratingAndReviews?.length} Ratings
                  </span>
                </div>
              </div>
            </div>

            {/*  remove from cart button and price tag */}
            <div className="flex flex-col items-end space-y-2">
              <button
                onClick={() => {
                  if (token) {
                    removeCourseFromCart(dispatch, token, course._id);
                  } else {
                    dispatch(removeFromCart(course._id));
                  }
                }}
                className="flex items-center gap-x-1 rounded-md border border-richblack-600 bg-richblack-700 py-3 px-[12px] text-pink-200"
              >
                <RiDeleteBin6Line />
                <span>Remove</span>
              </button>
              <p className="mb-6 text-3xl font-medium text-yellow-100">
                ₹ {course?.price}
              </p>
            </div>
          </div>
        ))
      ) : (
        <p>No Items in Cart</p>
      )}
    </div>
  );
};

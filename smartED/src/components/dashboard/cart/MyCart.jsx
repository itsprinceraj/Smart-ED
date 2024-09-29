import React from "react";
import { useSelector } from "react-redux";
import { TotalCartCourses } from "./TotalCartCourses";
import { CartCourseTotalAmount } from "./CartCourseTotalAmount";

export const MyCart = () => {
  const { total, totalItems } = useSelector((state) => state.cart);

  return (
    <div className=" w-10/12 mx-auto mt-2">
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">Cart</h1>
      <p className="border-b border-b-richblack-400 pb-2 font-semibold text-richblack-400">
        {totalItems} Courses in Cart
      </p>
      {total > 0 ? (
        <div className="mt-8 flex flex-col-reverse items-start gap-x-10 gap-y-6 lg:flex-row">
          <TotalCartCourses />
          <CartCourseTotalAmount />
        </div>
      ) : (
        <p className="mt-14 text-center text-3xl text-richblack-100">
          Your cart is empty
        </p>
      )}
    </div>
  );
};

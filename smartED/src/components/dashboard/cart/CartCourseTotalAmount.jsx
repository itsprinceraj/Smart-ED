import React from "react";
import { IconBtn } from "../../common/IconBtn";
import { useSelector } from "react-redux";

export const CartCourseTotalAmount = () => {
  const { total, cart } = useSelector((state) => state.cart);

  //  write a function to hadle buy course button , for payment integration
  const handleBuyCourse = () => {
    const courseId = cart.map((course) => course._id);
    console.log(courseId);
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
    </div>
  );
};

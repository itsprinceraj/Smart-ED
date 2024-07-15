import React from "react";
import { HiUsers } from "react-icons/hi";
import { ImTree } from "react-icons/im";
export const CourseCard = ({ cardData, currentCard, setCurrentCard }) => {
  // console.log("printing Card Data", cardData);
  return (
    <>
      {/* Ecplore Tab course  Card Container */}
      <div
        className={`w-[360px] lg:w-[30%] ${
          currentCard === cardData?.heading
            ? "bg-white shadow-[12px_12px_0_0] shadow-yellow-50"
            : "bg-richblack-800"
        } text-richblack-25 h-[300px] box-border cursor-pointer`}
        onClick={() => setCurrentCard(cardData?.heading)}
      >
        {/*  course Card */}

        <div className=" border-b-2 border-richblack-400 border-dashed h-[80%] p-6 flex flex-col gap-3">
          {/* Course Card Heading */}

          <div
            className={` ${
              currentCard === cardData?.heading && "text-richblack-800"
            } font-semibold text-[20px]`}
          >
            {cardData?.heading}
          </div>

          {/* course Card Description */}

          <div className="text-richblack-400">{cardData?.description}</div>

          {/* Levels and Lectures */}
        </div>
        <div
          className={`flex justify-between ${
            currentCard === cardData?.heading
              ? "text-blue-300"
              : "text-richblack-300"
          } px-6 py-3 font-medium`}
        >
          <div className="flex items-center gap-2 text-[16px]">
            <HiUsers /> <p>{cardData.level} Level</p>
          </div>
          <div className="flex items-center gap-2 text-[16px]">
            <ImTree /> <p>{cardData.lessionNumber} Lessions</p>
          </div>
        </div>
      </div>
    </>
  );
};

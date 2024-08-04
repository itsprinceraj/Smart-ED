import React from "react";
import Instructor from "../../assets/Images/Instructor.png";
import { HighlightText } from "./HighlightText";
import { CTAButton } from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
export const InstructorSection = () => {
  const { token } = useSelector((state) => state.auth);
  return (
    <>
      <div className="flex flex-col lg:flex-row gap-20 items-center">
        <div>
          <img
            src={Instructor}
            alt=""
            className="shadow-white shadow-[-20px_-20px_0_0]"
          />
        </div>

        <div className="lg:w-[50%] flex gap-10 flex-col">
          <h1 className="lg:w-[50%] text-4xl font-semibold ">
            Become and <HighlightText text={"Instructor"} />
          </h1>

          <p className="font-medium text-[16px] text-justify w-[90%] text-richblack-300">
            Instructors from around the world teach millions of students on
            StudyNotion. We provide the tools and skills to teach what you love.
          </p>

          <div className="w-fit">
            <CTAButton active={true} linkto={"/signup"}>
              <Link to={token ? "/dashboard/my-profile" : "/login"}>
                <div className="flex items-center gap-3">
                  Start Teaching Today
                  <FaArrowRight />
                </div>
              </Link>
            </CTAButton>
          </div>
        </div>
      </div>
    </>
  );
};

import React from "react";
import { FaCheck } from "react-icons/fa";
import { useSelector } from "react-redux";
import { CourseInfoForm } from "../course forms/CourseInfoForm";
import { CourseBuilderForm } from "../course forms/CourseBuilderForm";
import { PublishCourse } from "../course forms/PublishCourse";

export const AddCourseSteps = () => {
  const { step } = useSelector((state) => state.course);

  const steps = [
    {
      id: 1,
      title: "Course Information",
    },
    {
      id: 2,
      title: "Course Builder",
    },
    {
      id: 3,
      title: "Publish",
    },
  ];
  return (
    <>
      <div className="relative mb-2 flex m-auto w-full justify-center gap-x-48">
        {/*  apply map functon on steps array */}
        {steps.map((item) => (
          <div className=" flex flex-col items-center " key={item.id}>
            {/*  return a step tracker , that will track at which step of the course creation you are */}
            <button
              className={`grid cursor-default aspect-square w-[34px] place-items-center rounded-full border-[1px] ${
                step <= item.id
                  ? "border-blue-200 bg-blue-900 text-white"
                  : "border-richblack-700 bg-blue-200 text-white"
              } 
                    // below styling is for setting the background color when 1 step is completed
                     ${step > item.id && "bg-blue-200 text-richblack-900"}`}
            >
              {/*  show a tick icon when step 1 is completed or greated than item.id */}
              {step > item.id ? (
                <FaCheck className="font-bold text-richblack-900" />
              ) : (
                item.id
              )}
            </button>

            {/*  now show dashes between the current step and upcoming step with different styling */}

            {/* **************************** */}

            {/*  jaha tk item.id ,steps ki length se chota rhega, mujhe bas wahi tk dashed border chaiye  ------ iska mtlb mujhe bs 2 border chaiye  */}
            {item.id !== steps.length && (
              <>
                <div
                  className={`h-[calc(34px/2)] w-[33%]  border-dashed border-b-2 absolute translate-x-28  ${
                    step > item.id ? "border-blue-200" : "border-richblack-500"
                  }`}
                ></div>
              </>
            )}
          </div>
        ))}
      </div>

      {/*   */}

      <div className="relative mb-16 flex w-full select-none justify-between">
        {steps.map((item) => (
          <div
            className="flex min-w-[130px] flex-col items-center gap-y-2"
            key={item.id}
          >
            <p
              className={`text-sm ${
                step >= item.id ? "text-richblack-5" : "text-richblack-500"
              }`}
            >
              {item.title}
            </p>
          </div>
        ))}
      </div>

      {/*  render forms acording to the steps */}
      {step === 1 && <CourseInfoForm />}
      {step === 2 && <CourseBuilderForm />}
      {step === 3 && <PublishCourse />}
    </>
  );
};

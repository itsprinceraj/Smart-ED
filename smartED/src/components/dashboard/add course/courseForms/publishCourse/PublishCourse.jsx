import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  resetCourseState,
  setCourse,
  setStep,
} from "../../../../../redux/slices/courseSlice";
import { IconBtn } from "../../../../common/IconBtn";
import { COURSE_STATUS } from "../../../../../utilities/constants";
import { editCourseDetails } from "../../../../../services/operations/courseDetailApi";

export const PublishCourse = () => {
  const { register, setValue, getValues, handleSubmit } = useForm({
    defaultValues: {
      public: false,
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);

  // on first render , if course status is published, then mark the checkbox as checked
  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true);
    }
  }, [setValue, course]);

  //  go to course function
  const goToCourses = () => {
    dispatch(resetCourseState());
    navigate("/dashboard/my-courses");
  };

  //  create a handle publish function to handle publish funcitonality
  const handleCoursePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED &&
        getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      //  there are no changes to the publish form , so no need to make api call
      goToCourses();
      return;
    }

    //  create a new formData and make api call
    const formData = new FormData();
    formData.append("courseId", course._id);

    //  fetch course status
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT;

    //  append status to form data
    formData.append("status", courseStatus);

    //  now make an api call
    setLoading(true);
    const result = await editCourseDetails(formData, token);
    if (result) {
      goToCourses();
    }

    setLoading(false);
  };

  //  create a function to handle course submition
  const onSubmit = (data) => {
    // console.log(data);
    handleCoursePublish();
  };

  //  create a function which will handle go back button
  const goBack = () => {
    dispatch(setStep(2));
  };

  return (
    <div className="rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      <p className="text-2xl font-semibold text-richblack-5">
        Publish Settings
      </p>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Checkbox */}
        <div className="my-6 mb-8">
          <label htmlFor="public" className="inline-flex items-center text-lg">
            <input
              type="checkbox"
              id="public"
              {...register("public")}
              className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
            />
            <span className="ml-2 text-richblack-400">
              Make this course as public
            </span>
          </label>
        </div>

        {/* Next Prev Button */}
        <div className="ml-auto flex max-w-max items-center gap-x-4">
          <button
            disabled={loading}
            type="button"
            onClick={goBack}
            className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900"
          >
            Back
          </button>
          <IconBtn disabled={loading} text="Save Changes" />
        </div>
      </form>
    </div>
  );
};

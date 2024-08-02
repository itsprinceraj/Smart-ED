import React, { useState } from "react";
import { MdNavigateNext } from "react-icons/md";
import { IoAddCircleOutline } from "react-icons/io5";
import { NestedView } from "./NestedView";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { IconBtn } from "../../../../common/IconBtn";
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../redux/slices/courseSlice";
import toast from "react-hot-toast";
import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailApi";

export const CourseBuilderForm = () => {
  //   maintain form state using useForm hook
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  //  import necessary things from redux state
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [editSectionName, setEditSectionName] = useState(false);

  //  create submit handler , which will hadle form state when it will be submitted
  const handleFormSubmit = async (data) => {
    setLoading(true);
    let result; // created a variable, and will store api response and set it to course

    if (editSectionName) {
      //  if user is editing the section name, call the updateSection api
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName, // why this ?
          courseId: course._id,
        },
        token
      );

      console.log("princting result in builder form", result);

      //  else call createSection api
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      );
    }

    //  check if data came or not
    if (result) {
      dispatch(setCourse(result));
      setEditSectionName(false); // iski need hai ? check kro.
      setValue("sectionName", "");
    }

    //  remove loading
    setLoading(false);
  };

  //  handle cancel edit section button
  const cancelEdit = () => {
    setEditSectionName(false);
    setValue("sectionName", "");
  };

  //  handle got to next button
  const goToNext = () => {
    //  if course does not have any subSection , then show an erro toast
    if (course.courseContent.length === 0) {
      toast.error("Please add atleast one Section");
      return;
    }

    //  if course does not have any subSection then show a toast
    if (
      course.courseContent.some((section) => section.subSection.length === 0)
    ) {
      toast.error("Please add atleast one SubSection");
      return;
    }

    //  now dispatch to 3rd step or course Creation
    dispatch(setStep(3));
  };

  //  handle goBack button
  const goBack = () => {
    dispatch(setStep(1));
    dispatch(setEditCourse(true));
  };

  //
  const changeSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit();
      return;
    }
    setEditSectionName(sectionId);
    setValue("sectionName", sectionName);
  };

  return (
    <div className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6">
      {/* heading */}
      <p className="text-2xl font-semibold text-richblack-5">Course Builder</p>

      {/*  create subsection form */}
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        <div className="flex flex-col space-y-2">
          <label className="text-sm text-richblack-5" htmlFor="sectionName">
            Section Name <sup className="text-pink-200">*</sup>
          </label>

          {/*  register input */}
          <input
            id="sectionName"
            disabled={loading}
            placeholder="Add a section to build your course"
            {...register("sectionName", { required: true })}
            className="form-style w-full"
          />

          {/*  handle error */}
          {errors.sectionName && (
            <span className="ml-2 text-xs tracking-wide text-pink-200">
              Section name is required
            </span>
          )}
        </div>

        {/*  display button with some specific conditions */}
        <div className="flex items-end gap-x-4">
          <IconBtn
            type="submit"
            disabled={loading}
            text={editSectionName ? "Edit Section Name" : "Create Section"}
            outline={true}
          >
            <IoAddCircleOutline size={20} className="text-yellow-50" />
          </IconBtn>
          {editSectionName && (
            <button
              type="button"
              onClick={cancelEdit}
              className="text-sm text-richblack-300 underline"
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      {/*  display nested component */}
      {course?.courseContent?.length > 0 && (
        <NestedView changeSectionName={changeSectionName} />
      )}
      {/* Next and back(prev) Button */}
      <div className="flex justify-end gap-x-3">
        <button
          onClick={goBack}
          className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
        >
          Back
        </button>
        <IconBtn disabled={loading} text="Next" onclick={goToNext}>
          <MdNavigateNext />
        </IconBtn>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { IconBtn } from "../../../common/IconBtn";
import { useForm } from "react-hook-form";
import { TagInput } from "../input components/TagInput";
import { MdNavigateNext, MdOutlineCurrencyRupee } from "react-icons/md";
import { Instructions } from "../input components/Instructions";
import { Upload } from "../input components/Upload";
import { useDispatch, useSelector } from "react-redux";
import { setStep, setCourse } from "../../../../redux/slices/courseSlice";
import { COURSE_STATUS } from "../../../../utilities/constants";
import {
  fetchCategories,
  editCourseDetails,
  createCourse,
} from "../../../../services/operations/courseDetailApi";
import toast from "react-hot-toast";

export const CourseInfoForm = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  // Fetch course and editCourse from redux state
  const { course, editCourse } = useSelector((state) => state.course);

  // Fetch categories using API call and set its state to categories array
  const [courseCategories, setCourseCategories] = useState([]);

  // Fetch course category and set it to the state
  const getCourseCategory = async () => {
    setLoading(true);
    const category = await fetchCategories();
    if (category.length > 0) {
      setCourseCategories(category);
    }
    setLoading(false);
  };

  // Set the default value in edit mode and call the getCategory function
  useEffect(() => {
    if (editCourse) {
      setValue("courseTitle", course.courseName);
      setValue("courseShortDesc", course.courseDescription);
      setValue("coursePrice", course.price);
      setValue("courseTags", course.tag);
      setValue("courseBenefits", course.whatYouWillLearn);
      setValue("courseCategory", course.category);
      setValue("courseInstructions", course.instructions);
      setValue("courseImage", course.thumbnail);
    }
    getCourseCategory();
  }, []);

  // Maintain form state using useForm hook
  const {
    register,
    handleSubmit,
    getValues,
    setValue,
    formState: { errors },
  } = useForm();

  // Check if the form is updated
  const formUpdated = () => {
    const currentVal = getValues();
    if (
      currentVal.courseTitle !== course.courseName ||
      currentVal.courseShortDesc !== course.courseDescription ||
      currentVal.coursePrice !== course.price ||
      currentVal.courseTags.toString() !== course.tag.toString() ||
      currentVal.courseBenefits !== course.whatYouWillLearn ||
      currentVal.courseCategory._id !== course.category._id ||
      currentVal.courseInstructions !== course.instructions ||
      currentVal.courseImage !== course.thumbnail
    ) {
      return true;
    } else {
      return false;
    }
  };

  // Form submit handler
  const formSubmitHandler = async (data) => {
    if (editCourse) {
      if (formUpdated()) {
        const currentValues = getValues();
        const formData = new FormData();

        formData.append("courseId", course._id);
        if (currentValues.courseTitle !== course.courseName) {
          formData.append("courseName", data.courseTitle);
        }

        if (currentValues.courseShortDesc !== course.courseDescription) {
          formData.append("courseDescription", data.courseShortDesc);
        }

        if (currentValues.coursePrice !== course.price) {
          formData.append("price", data.coursePrice);
        }

        // Convert the array into string
        if (currentValues.courseTags.toString() !== course.tag.toString()) {
          formData.append("tag", JSON.stringify(data.courseTags));
        }

        if (currentValues.courseBenefits !== course.whatYouWillLearn) {
          formData.append("whatYouWillLearn", data.courseBenefits);
        }
        if (currentValues.courseCategory._id !== course.category._id) {
          formData.append("category", data.courseCategory);
        }

        if (
          currentValues.courseInstructions.toString() !==
          course.instructions.toString()
        ) {
          formData.append(
            "instructions",
            JSON.stringify(data.courseInstructions)
          );
        }

        if (currentValues.courseImage !== course.thumbnail) {
          formData.append("thumbnail", data.courseImage);
        }

        // Make an API call for editCourse
        setLoading(true);
        const result = await editCourseDetails(formData, token);
        setLoading(false);
        if (result) {
          dispatch(setStep(2));
          dispatch(setCourse(result));
        }
      } else {
        toast.error("No changes made to the form");
      }
      return;
    }

    // If user is not editing the course, then create a new FormData and create a course
    const formData = new FormData();
    formData.append("courseName", data.courseTitle);
    formData.append("courseDescription", data.courseShortDesc);
    formData.append("price", data.coursePrice);
    formData.append("tag", JSON.stringify(data.courseTags));
    formData.append("whatYouWillLearn", data.courseBenefits);
    formData.append("category", data.courseCategory);
    formData.append("status", COURSE_STATUS.DRAFT);
    formData.append("instructions", JSON.stringify(data.courseInstructions));
    formData.append("thumbnail", data.courseImage);

    // console.log("Printing data inside submition: ", data);
    // console.log("Printing form-data inside submition: ", formData);

    // Make an API call for course creation
    setLoading(true);
    const result = await createCourse(formData, token);
    // console.log("printing result : ", result);
    if (result) {
      dispatch(setCourse(result));
      dispatch(setStep(2));
    }
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit(formSubmitHandler)}
      className="space-y-8 rounded-md border-[1px] border-richblack-700 bg-richblack-800 p-6"
    >
      {/* Course Title */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseTitle">
          Course Title <sup className="text-pink-200">*</sup>
        </label>
        <input
          id="courseTitle"
          placeholder="Enter Course Title"
          {...register("courseTitle", { required: true })}
          className="form-style w-full"
        />
        {errors.courseTitle && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course title is required
          </span>
        )}
      </div>

      {/* Course Short Description */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseShortDesc">
          Course Short Description <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseShortDesc"
          placeholder="Enter Description"
          {...register("courseShortDesc", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseShortDesc && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Description is required
          </span>
        )}
      </div>

      {/* Course Price */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="coursePrice">
          Course Price <sup className="text-pink-200">*</sup>
        </label>
        <div className="relative">
          <input
            type="number"
            id="coursePrice"
            placeholder="Enter Course Price"
            {...register("coursePrice", {
              required: true,
              valueAsNumber: true,
              pattern: {
                value: /^(0|[1-9]\d*)(\.\d+)?$/,
              },
            })}
            className="form-style w-full !pl-12"
          />
          <MdOutlineCurrencyRupee className="absolute left-3 top-1/2 inline-block -translate-y-1/2 text-2xl text-richblack-400" />
        </div>
        {errors.coursePrice && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Price is required
          </span>
        )}
      </div>

      {/* Course Category */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseCategory">
          Course Category <sup className="text-pink-200">*</sup>
        </label>
        <select
          {...register("courseCategory", { required: true })}
          defaultValue=""
          id="courseCategory"
          className="form-style w-full"
        >
          <option value="" disabled>
            Choose a Category
          </option>
          {!loading &&
            courseCategories?.map((category, indx) => (
              <option key={indx} value={category?._id}>
                {category?.name}
              </option>
            ))}
        </select>
        {errors.courseCategory && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Course Category is required
          </span>
        )}
      </div>

      {/* Course Tags */}
      <TagInput
        label="Tags"
        name="courseTags"
        placeholder="Enter Tags and press Enter"
        register={register}
        errors={errors}
        setValue={setValue}
      />

      {/* Course Thumbnail Image */}
      <Upload
        name="courseImage"
        label="Course Thumbnail"
        register={register}
        setValue={setValue}
        errors={errors}
        editData={editCourse ? course?.thumbnail : null}
      />

      {/* Benefits of the course */}
      <div className="flex flex-col space-y-2">
        <label className="text-sm text-richblack-5" htmlFor="courseBenefits">
          Benefits of the course <sup className="text-pink-200">*</sup>
        </label>
        <textarea
          id="courseBenefits"
          placeholder="Enter benefits of the course"
          {...register("courseBenefits", { required: true })}
          className="form-style resize-x-none min-h-[130px] w-full"
        />
        {errors.courseBenefits && (
          <span className="ml-2 text-xs tracking-wide text-pink-200">
            Benefits of the course is required
          </span>
        )}
      </div>

      {/* Instructions field */}
      <Instructions
        name="courseInstructions"
        label="Instructions"
        register={register}
        setValue={setValue}
        errors={errors}
      />

      {/* Next Button  and continue without saving button */}
      <div className="flex justify-end gap-x-2">
        {editCourse && (
          <button
            onClick={() => dispatch(setStep(2))}
            disabled={loading}
            className={`flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 py-[8px] px-[20px] font-semibold text-richblack-900`}
          >
            Continue Without Saving
          </button>
        )}
        <IconBtn
          disabled={loading}
          text={!editCourse ? "Next" : "Save Changes"}
        >
          <MdNavigateNext />
        </IconBtn>
      </div>
    </form>
  );
};

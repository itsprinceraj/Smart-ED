import React, { useEffect, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import { Upload } from "../courseInfoForm/Upload";
import { IconBtn } from "../../../../common/IconBtn";
import { useForm } from "react-hook-form";
import {
  addSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailApi";
import { setCourse } from "../../../../../redux/slices/courseSlice";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";

export const SubSectionModal = ({
  modalData,
  setModalData,
  add = false, // assume data is not coming from prop
  view = false,
  edit = false,
}) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
    setValue,
  } = useForm();

  useEffect(() => {
    if (view || edit) {
      setValue("lectureTitle", modalData.title);
      setValue("lectureDesc", modalData.description);
      setValue("lectureVideo", modalData.videoUrl);
    }
  }, []);

  const formUpdated = () => {
    const currentVal = getValues();
    if (
      currentVal.lectureTitle !== modalData.title ||
      currentVal.lectureDesc !== modalData.description ||
      currentVal.lectureVideo !== modalData.videoUrl
    ) {
      return true;
    }
    return false;
  };

  const handleEditSubSection = async () => {
    const currentValues = getValues();
    const formData = new FormData();
    formData.append("sectionId", modalData.sectionId);
    formData.append("subSectionId", modalData._id);
    if (currentValues.lectureTitle !== modalData.title) {
      formData.append("title", currentValues.lectureTitle);
    }
    if (currentValues.lectureDesc !== modalData.description) {
      formData.append("description", currentValues.lectureDesc);
    }
    if (currentValues.lectureVideo !== modalData.videoUrl) {
      formData.append("video", currentValues.lectureVideo);
    }

    setLoading(true);
    const result = await updateSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData.sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };

      dispatch(setCourse(updatedCourse));
    }
    setModalData(null);
    setLoading(false);
  };

  //  create on submit function to handle Submit
  const onSubmit = async (data) => {
    // console.log("Form data submitted: ", data);
    if (view) {
      return;
    }

    //  if user is editing the course then check form is updated or not
    if (edit) {
      if (!formUpdated()) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubSection();
      }
      return;
    }

    //  create a new formData
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo); // Ensure the video file is properly appended
    // console.log("FormData contents: ", formData.get("video"));

    setLoading(true);
    const result = await addSubSection(formData, token);
    // console.log("API response: ", result);

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }

    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          {/*  show heading ass per flag */}
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>

          {/*  button to hide modal */}
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/*  file upload componene */}
          <Upload
            name="lectureVideo"
            label="Lecture Video"
            register={register}
            setValue={setValue}
            errors={errors}
            video={true}
            viewData={view ? modalData.videoUrl : null}
            editData={edit ? modalData.videoUrl : null}
          />

          {/*  subsection title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>

            {/*  input for title*/}
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/*  description  */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>

            {/*  input field for description */}
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>

          {/*  show button as per flag */}
          {!view && (
            <div className="flex justify-end">
              <IconBtn
                disabled={loading}
                text={loading ? "Loading.." : edit ? "Save Changes" : "Save"}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

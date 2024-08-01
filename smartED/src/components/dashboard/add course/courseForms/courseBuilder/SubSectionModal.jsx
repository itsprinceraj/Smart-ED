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

export const SubSectionModal = ({
  modalData,
  setModalData,
  add = false, // assume data is not comming from prop
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

  //  if user viewing the subsection , then fill  data in the form on first render
  useEffect(() => {
    if (view || edit) {
      setValue(modalData.lectureTitle);
      setValue(modalData.lectureDesc);
      setValue(modalData.lectureVideo);
    }
  }, []);

  //  create a function to check if form is updated or not
  const formUpdated = () => {
    const currentVal = getValues();
    if (
      currentVal.lectureTitle !== modalData.lectureTitle ||
      currentVal.lectureDesc !== modalData.lectureDesc ||
      currentVal.lectureVideo !== modalData.lectureVideo
    ) {
      return true;
    }
    return false;
  };

  //  create a handle edit Subsection function to handle editing subSection
  const handleEditSubSection = async () => {
    const currentValues = getValues();
    // console.log("changes after editing form values:", currentValues)
    const formData = new FormData();
    // console.log("Values After Editing form values:", currentValues)
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

    //  make api call for updating subSection
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

  //    create a onSubmit handler
  const onSubmit = async () => {
    if (view) {
      return;
    }

    if (edit) {
      if (!formUpdated) {
        toast.error("No changes made to the form");
      } else {
        handleEditSubSection();
      }
      return;
    }

    //  create a formData and append data into it
    const formData = new FormData();
    formData.append("sectionId", modalData);
    formData.append("title", data.lectureTitle);
    formData.append("description", data.lectureDesc);
    formData.append("video", data.lectureVideo);
    //  make an  api call to create subSection

    setLoading(true);
    const result = await addSubSection(formData, token);
    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === modalData ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };
      dispatch(setCourse(updatedCourse));
    }

    //  setModal null
    setModalData(null);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            {view && "Viewing"} {add && "Adding"} {edit && "Editing"} Lecture
          </p>
          <button onClick={() => (!loading ? setModalData(null) : {})}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-8 px-8 py-10"
        >
          {/* Lecture Video Upload */}
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
          {/* Lecture Title */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureTitle">
              Lecture Title {!view && <sup className="text-pink-200">*</sup>}
            </label>

            {/*  title input  */}
            <input
              disabled={view || loading}
              id="lectureTitle"
              placeholder="Enter Lecture Title"
              {...register("lectureTitle", { required: true })}
              className="form-style w-full"
            />

            {/*  handle error input field */}
            {errors.lectureTitle && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture title is required
              </span>
            )}
          </div>

          {/* Lecture Description div */}
          <div className="flex flex-col space-y-2">
            <label className="text-sm text-richblack-5" htmlFor="lectureDesc">
              Lecture Description{" "}
              {!view && <sup className="text-pink-200">*</sup>}
            </label>

            {/*  lecture description field */}
            <textarea
              disabled={view || loading}
              id="lectureDesc"
              placeholder="Enter Lecture Description"
              {...register("lectureDesc", { required: true })}
              className="form-style resize-x-none min-h-[130px] w-full"
            />

            {/*  handle error in lecture description field */}
            {errors.lectureDesc && (
              <span className="ml-2 text-xs tracking-wide text-pink-200">
                Lecture Description is required
              </span>
            )}
          </div>

          {/*  agr course ko edit ya lecture add kar rhe ho toh butto me text ko conditionally show kar do */}
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

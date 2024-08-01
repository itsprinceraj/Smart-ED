import React, { useEffect, useState } from "react";
import { AddCourseSteps } from "../add course/addCourseSteps/AddCourseSteps";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { setCourse, setEditCourse } from "../../../redux/slices/courseSlice";
import { getSpecificCourseDetail } from "../../../services/operations/courseDetailApi";

export const EditCourse = () => {
  const [loading, setLoading] = useState(false);
  const { courseId } = useParams();
//   console.log(courseId);
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  //   i want to fetch specific course details on first render
  useEffect(() => {
    (async () => {
      setLoading(true);
      const result = await getSpecificCourseDetail(courseId, token);
      if (result?.courseDetails) {
        dispatch(setEditCourse(true));
        dispatch(setCourse(result?.courseDetails));
      }
      setLoading(false);
    })();
  }, []);

  //    if loading then show  spinner
  if (loading) {
    return (
      <div className="grid flex-1 place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  return (
    <div>
      <h1 className="mb-14 text-3xl font-medium text-richblack-5">
        Edit Course
      </h1>
      <div className="mx-auto max-w-[600px]">
        {course ? (
          <AddCourseSteps />
        ) : (
          <p className="mt-14 text-center text-3xl font-semibold text-richblack-100">
            Course not found
          </p>
        )}
      </div>
    </div>
  );
};

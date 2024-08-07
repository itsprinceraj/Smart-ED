import React, { useEffect, useState } from "react";
import { LectureSidebar } from "../components/dashboard/studentCourses/LectureSidebar";
import { ReviewModal } from "../components/dashboard/studentCourses/ReviewModal";
import { Outlet, useParams } from "react-router-dom";
import { getFullCourseDetails } from "../services/operations/courseDetailApi";
import { useDispatch, useSelector } from "react-redux";
import {
  setCourseSectionData,
  setCompletedLectures,
  setEntireCourseData,
  setTotalNoOfLectures,
} from "../redux/slices/viewCourseSlice";

export const WatchYourCourse = () => {
  const { courseId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [reviewModal, setReviewModal] = useState(null);

  // const [loading, setLoading] = useState(false);

  //    on first render get data from the api and dispatch all viewcourse slices
  useEffect(() => {
    const fetchCourseData = async () => {
      // setLoading(true);
      try {
        // make an api call
        const courseData = await getFullCourseDetails(courseId, token);
        // console.log("Printing watch course data: ", courseData);

        if (courseData) {
          // console.log("Completed videos: ", courseData?.completedVideos);
          // console.log("Course details: ", courseData?.courseDetails);
          // console.log(
          //   "Course content: ",
          //   courseData?.courseDetails?.courseContent
          // );

          // Dispatching data and setRedux State
          dispatch(setCompletedLectures(courseData?.completedVideos || []));
          dispatch(setEntireCourseData(courseData?.courseDetails || {}));
          dispatch(
            setCourseSectionData(courseData?.courseDetails?.courseContent || [])
          );

          // Calculate total number of lectures
          let totalLectures = 0;
          courseData?.courseDetails?.courseContent?.forEach((section) => {
            totalLectures += section.subSection?.length || 0;
          });
          dispatch(setTotalNoOfLectures(totalLectures));
        }
      } catch (error) {
        console.error("Error fetching course data: ", error);
      }
      // setLoading(false);
    };

    fetchCourseData();
  }, [courseId, token, dispatch]);

  return (
    <>
      <div className="relative flex min-h-[calc(100vh-3.5rem)]">
        <LectureSidebar setReviewModal={setReviewModal} />
        <div className="h-[calc(100vh-3.5rem)] flex-1 overflow-auto">
          <div className="mx-6">
            <Outlet />
          </div>
        </div>
      </div>
      {reviewModal && <ReviewModal setReviewModal={setReviewModal} />}
    </>
  );
};

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProgressBar from "@ramonak/react-progress-bar";
import { useSelector } from "react-redux";
import { getEnrolledCourseDetail } from "../../services/operations/userProfileApi";

export const EnrolledCourse = () => {
  const { token } = useSelector((state) => state.auth);
  const [enrolledCourses, setEnrolledCourses] = useState(null);
  const navigate = useNavigate();

  //    fetch enrolled course data by making backend call
  const getenrolledcourses = async () => {
    try {
      const response = await getEnrolledCourseDetail(token);
      // console.log(response);

      setEnrolledCourses(response);
    } catch (error) {
      console.log(error.message);
    }
  };

  //    always make api call inside useEffect Function
  useEffect(() => {
    getenrolledcourses();
    // below is a special coment which disable react-hooks dependancy
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // console.log("printing enrolled courses: ", enrolledCourses);

  return (
    <>
      <div className="text-3xl text-richblack-50">Enrolled Courses</div>
      {!enrolledCourses ? (
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : !enrolledCourses.length ? (
        <p className="grid h-[10vh] w-full place-content-center text-richblack-5">
          You have not enrolled in any course yet.
        </p>
      ) : (
        <div className="my-8 text-richblack-5">
          {/* Headings */}
          <div className="flex rounded-t-lg bg-richblack-500 ">
            <p className="w-[45%] px-5 py-3">Course Name</p>
            <p className="w-1/4 px-2 py-3">Duration</p>
            <p className="flex-1 px-2 py-3">Progress</p>
          </div>

          {/* Course Names */}
          {enrolledCourses.map((course, index, arr) => (
            <div
              className={`flex items-center border border-richblack-700 text-lg ${
                index === arr.length - 1 ? "rounded-b-lg" : "rounded-none"
              }`}
              key={index}
            >
              <div
                className="flex w-[45%] cursor-pointer items-center gap-4 px-6 py-3"
                onClick={() => {
                  navigate(
                    `/view-course/${course?._id}/section/${course.courseContent?.[0]?._id}/sub-section/${course.courseContent?.[0]?.subSection?.[0]?._id}`
                  );
                }}
              >
                {/* thumbnail image */}
                <img
                  src={course.thumbnail}
                  alt="course_img"
                  className="h-16 w-16 rounded-lg object-cover"
                />

                {/*  course name and descriptions */}
                <div className="flex max-w-xs flex-col gap-2">
                  <p className="font-semibold">{course.courseName}</p>
                  <p className="text-sm text-richblack-300">
                    {course.courseDescription.length > 50
                      ? `${course.courseDescription.slice(0, 50)}...`
                      : course.courseDescription}
                  </p>
                </div>
              </div>

              {/*  Total Duration of course */}
              <div className="w-1/4 px-2 py-3">{course?.totalDuration}</div>
              <div className="flex w-1/5 flex-col gap-2 px-2 py-3">
                {/*  create a progress bar using ramonak library */}
                <p>Progress: {course.progressPercentage || 0}%</p>
                <ProgressBar
                  completed={course.progressPercentage || 0}
                  height="8px"
                  isLabelVisible={false}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

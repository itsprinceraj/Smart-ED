import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { StatisticChart } from "./StatisticChart";
import { useSelector } from "react-redux";
import { fetchDashboardDetails } from "../../../services/operations/userProfileApi";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailApi";
import { IoReturnUpForward } from "react-icons/io5";
import { LiaRupeeSignSolid } from "react-icons/lia";

export const Instructor = () => {
  //  import all data that is required
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState(null);
  const [instructorData, setInstructorData] = useState(null);
  const { token } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.profile);

  //    make a api call on first render
  useEffect(() => {
    (async () => {
      setLoading(true);
      const instructorApiData = await fetchDashboardDetails(token);
      const response = await fetchInstructorCourses(token);
      //   console.log("dashboard reponse:", instructorApiData);
      //   console.log("instructor course reponse:", response);

      //validate data
      if (instructorApiData?.length) setInstructorData(instructorApiData);

      if (response) setCourses(response);

      setLoading(false);
    })();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  //    get total amount and total students
  const totalAmount = instructorData?.reduce(
    (acc, curr) => acc + curr?.totalAmountGenerated,
    0
  );

  const totalStudents = courses?.reduce((acc, curr) => {
    const students = curr?.studentsEnrolled?.length || 0;
    // console.log("Current course students:", students);
    return acc + students;
  }, 0);

  // logging
  //   console.log(totalStudents);
  //   console.log(totalAmount);

  return (
    <div>
      {/*  add name of instructor */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold text-richblack-5">
          Hi {user?.firstName} 👋
        </h1>

        {/*   start new */}
        <p className="font-medium text-richblack-200">
          Let's start something new
        </p>
      </div>

      {/*  if laoding false then show the content */}
      {loading ? (
        <div className=" h-[50vh] w-full flex justify-center items-center">
          <div className="spinner"></div>
        </div>
      ) : courses?.length > 0 ? (
        <div>
          <div className="my-4 flex h-[450px] space-x-4">
            {/* Render chart / graph */}
            {totalAmount > 0 || totalStudents > 0 ? (
              <StatisticChart courses={instructorData} />
            ) : (
              <div className="flex-1 rounded-md bg-richblack-800 p-6">
                <p className="text-lg font-bold text-richblack-5">Visualize</p>
                <p className="mt-4 text-xl font-medium text-richblack-50">
                  Not Enough Data To Visualize
                </p>
              </div>
            )}

            {/* Total Statistics */}
            <div className="flex min-w-[220px] flex-col rounded-md bg-richblack-800 p-6 justify-center">
              <p className="text-2xl font-bold text-richblack-5">Statistics</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-lg text-richblack-200">Total Courses</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {courses?.length}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">Total Students</p>
                  <p className="text-3xl font-semibold text-richblack-50">
                    {totalStudents}
                  </p>
                </div>
                <div>
                  <p className="text-lg text-richblack-200">
                    Total Income<sup className="text-pink-200">*</sup>
                  </p>
                  <p className="text-3xl flex items-center font-semibold text-[#00FF00]">
                    <LiaRupeeSignSolid size={40} />
                    {totalAmount}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/*  render courses at the end of page */}
          <div className="rounded-md bg-richblack-800 p-6">
            {/* Render 3 courses */}
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-richblack-5">
                Your Courses
              </p>
              <Link to="/dashboard/my-courses">
                <p className="text-lg font-semibold text-blue-100">View All</p>
              </Link>
            </div>
            <div className="my-4 flex items-start space-x-6">
              {courses?.slice(0, 3)?.map((course) => (
                <div key={course?._id} className="w-1/3">
                  <img
                    src={course?.thumbnail}
                    alt={course?.courseName}
                    className="h-[201px] w-full rounded-md object-cover"
                  />
                  <div className="mt-3 w-full">
                    <p className="text-md font-medium text-richblack-50">
                      {course?.courseName}
                    </p>
                    <div className="mt-1 flex items-center space-x-2">
                      <p className="text-md font-medium text-richblack-300">
                        {course?.studentsEnrolled?.length} students
                      </p>
                      <p className="text-md font-medium text-richblack-300">
                        |
                      </p>
                      <p className="text-md font-medium text-pink-200">
                        Rs. {course?.price}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-20 rounded-md bg-richblack-800 p-6 py-20">
          <p className="text-center text-2xl font-bold text-richblack-5">
            You have not created any courses yet
          </p>
          <Link to="/dashboard/add-course">
            <p className="mt-1 text-center text-lg font-semibold text-yellow-50">
              Create a course
            </p>
          </Link>
        </div>
      )}
    </div>
  );
};

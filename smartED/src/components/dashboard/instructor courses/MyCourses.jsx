import { useEffect, useState } from "react";
import { VscAdd } from "react-icons/vsc";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { IconBtn } from "../../common/IconBtn";
import { CourseTable } from "./CourseTable";
import { fetchInstructorCourses } from "../../../services/operations/courseDetailApi";

export const MyCourses = () => {
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);

  //    call insturctor courses
  useEffect(() => {
    const fetchCourses = async () => {
      const response = await fetchInstructorCourses(token);
      //   console.log(response);

      if (response) {
        setCourses(response);
      }
    };
    fetchCourses();
  }, []);

  return (
    <div>
      <div className="mb-14 flex items-center justify-between">
        <h1 className="text-3xl font-medium text-richblack-5">My Courses</h1>
        <IconBtn
          text="Add Course"
          onclick={() => navigate("/dashboard/add-course")}
        >
          <VscAdd />
        </IconBtn>
      </div>
      {courses && <CourseTable courses={courses} setCourses={setCourses} />}
    </div>
  );
};

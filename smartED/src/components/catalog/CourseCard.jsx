import React, { useEffect, useState } from "react";
import { GetAvgRating } from "../../utilities/avgRating";
import { RatingStars } from "../../components/common/RatingStars";
import { Link } from "react-router-dom";

export const CourseCard = ({ course, Height }) => {
  const [avgReviewCount, setAvgReviewCount] = useState(0);

  //  fetch and show ratings on first render of this component
  useEffect(() => {
    const count = GetAvgRating(course?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [course]);

  return (
    <>
      {/*  create the course as link so that when user clicks on it , then we can show the course detail */}
      <Link to={`/courses/${course._id}`}>
        <div className="">
          <div className="rounded-lg flex items-center m-auto">
            {/*  course thumbnail */}
            <img
              src={course?.thumbnail}
              alt="course thumnail"
              className={`${Height} w-[370px] rounded-xl object-fit  `}
            />
          </div>

          {/*  course name */}
          <div className="flex flex-col gap-2 px-1 py-3">
            <p className="text-xl text-richblack-5">{course?.courseName}</p>

            {/*  course ratings and price */}
            <div className="flex items-center gap-2 mt-1">
              <span className="text-yellow-5">{avgReviewCount || 0}</span>
              <RatingStars Review_Count={avgReviewCount} Star_Size={30} />
              <span className="text-richblack-400">
                {course?.ratingAndReviews?.length} Ratings
              </span>
            </div>
            <p className="text-xl text-richblack-5">Rs. {course?.price}</p>
          </div>
        </div>
      </Link>
    </>
  );
};

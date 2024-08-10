import React, { useEffect, useState } from "react";
import ReactStars from "react-stars";
// Import Swiper React components
import { FaStarHalfStroke } from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "../../App.css";
// Icons
import { FaStar } from "react-icons/fa";

import { apiConnector } from "../../services/apiConnector";
import { ratingsEndpoints } from "../../services/apiEndPoints";

export const ReviewSlider = () => {
  const [reviews, setReviews] = useState([]);
  const truncateWords = 15;

  useEffect(() => {
    (async () => {
      try {
        const response = await apiConnector(
          "GET",
          ratingsEndpoints.REVIEWS_DETAILS_API
        );

        // console.log("Print rating data: ", response);
        if (response?.success) {
          setReviews(response?.data);
        }
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    })();
  }, []);

  return (
    <div className="w-11/12 mx-auto flex gap-3">
      <div className=" mb-[100px] h-[185px] w-full p-2  flex justify-center items-center ">
        <Swiper
          slidesPerView={4}
          spaceBetween={25}
          loop={true}
          freeMode={true}
          autoplay={{
            delay: 2000,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Pagination, Autoplay]}
          className="w-full "
        >
          {reviews.map((review, i) => {
            return (
              <SwiperSlide key={i}>
                <div className="flex flex-col gap-3 bg-richblack-800 p-3 text-[14px] text-richblack-25 hover:bg-richblack-700 rounded-md">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        review?.user?.image
                          ? review?.user?.image
                          : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName} ${review?.user?.lastName}`
                      }
                      alt=""
                      className="h-20 w-20 rounded-full object-cover"
                    />
                    <div className="flex flex-col">
                      <h1 className="font-semibold text-richblack-5 text-xl">{`${review?.user?.firstName} ${review?.user?.lastName}`}</h1>
                      <h2 className="text-md font-medium text-richblack-300 mt-1">
                        {review?.course?.courseName}
                      </h2>
                    </div>
                  </div>
                  <p className="font-medium text-xl text-richblack-25 px-1">
                    {review?.review.split(" ").length > truncateWords
                      ? `${review?.review
                          .split(" ")
                          .slice(0, truncateWords)
                          .join(" ")} ...`
                      : `${review?.review}`}
                  </p>
                  <div className="flex items-center gap-2 px-1  ">
                    <h3 className="font-semibold text-xl text-yellow-100">
                      {review?.rating}
                    </h3>
                    <ReactStars
                      count={5}
                      value={review?.rating}
                      // half={true}
                      edit={false}
                      size={27}
                      // char={}
                    />
                  </div>
                </div>
              </SwiperSlide>
            );
          })}
          {/* <SwiperSlide>Slide 1</SwiperSlide> */}
        </Swiper>
      </div>
    </div>
  );
};

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Footer } from "../components/common/Footer";
import { ConfirmationModal } from "../components/common/ConfirmationModal";
import { RatingStars } from "../components/common/RatingStars";
// import { ReactMarkdown } from "react-markdown/lib/react-markdown";
import { GetAvgRating } from "../utilities/avgRating";
import { ErrorPage } from "./ErrorPage";
import toast from "react-hot-toast";
import { getCourseDetail } from "../services/operations/courseDetailApi";
import { BiInfoCircle } from "react-icons/bi";
import { HiOutlineGlobeAlt } from "react-icons/hi";
import { formatDate } from "../services/formatDate";
import { CourseAccordionBar } from "../components/coureDetailPage/CourseAccordionBar";
import { CourseDetailsCard } from "../components/coureDetailPage/CourseDetailsCard";
import { buyCourse } from "../services/operations/paymentApi";

export const CourseDetails = () => {
  //  fetch user and token as  they are much needed thing for this section
  const { user } = useSelector((state) => state.profile);
  const { token } = useSelector((state) => state.auth);
  const { loading } = useSelector((state) => state.profile);
  const { paymentLoading } = useSelector((state) => state.course);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { courseId } = useParams();

  //  fetch course data

  const [response, setResponse] = useState(null);
  const [avgReviewCount, setAvgReviewCount] = useState(0);
  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0);
  const [confirmationModal, setConfirmationModal] = useState(null);
  const [isActive, setIsActive] = useState(Array(0));

  //  create a state variable for order_id
  // const [orderId, setOrderId] = useState("");

  //  get course data on first render of this component
  useEffect(() => {
    (async () => {
      try {
        // get data by api call
        const result = await getCourseDetail(courseId);
        // console.log("printing courseData: in ui details: ", result);
        setResponse(result);
      } catch (err) {
        console.log(err);
        toast.error("Unabel to get courseData");
      }
    })();

    //  call the async function
  }, [courseId]);

  //  get average ratings
  useEffect(() => {
    const count = GetAvgRating(response?.data?.courseDetails?.ratingAndReviews);
    setAvgReviewCount(count);
  }, [response]);

  //  get total number of lectures
  useEffect(() => {
    let totalLecture = 0;
    response?.data?.courseDetails?.courseContent?.forEach((section) => {
      totalLecture += section.subSection.length || 0;
    });

    setTotalNoOfLectures(totalLecture);
  }, [response]);

  //if response is not came yet then show spinner
  // NOTE: useState shchedule and execute states in patch , so that their might be a chance of delay in comming of response , untill then show a spinner
  if (loading || !response) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!response.success) {
    return <ErrorPage />;
  }

  //  get data by destructuring response
  // console.log("print state of response: ", response);
  const {
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data.courseDetails;

  //  handle active and inactive state
  const handleActive = (id) => {
    //  agar id nai ha isActive wale array me , toh usse include krdo
    setIsActive(
      !isActive.includes(id)
        ? isActive.concat([id])
        : isActive.filter((e) => e != id)
    );
  };

  //  handle purchasing of course

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch);
      return;
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1: "Login",
      btn2: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    });
  };

  //  if payment loading show a loader
  if (paymentLoading) {
    // console.log("payment loading")
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <>
      <div className={`relative w-full bg-richblack-800`}>
        {/* Hero Section */}
        <div className="mx-auto box-content px-4 lg:w-[1260px] 2xl:relative ">
          <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">
            {/*  show coursecard when screen size is reduced */}
            <div className="relative block max-h-[30rem] lg:hidden">
              <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
              <img
                src={thumbnail}
                alt="course thumbnail"
                className="aspect-auto w-full"
              />
            </div>
            <div
              className={`z-30 my-5 flex flex-col justify-center gap-4 py-5 text-lg text-richblack-5`}
            >
              {/*  course name */}
              <div>
                <p className="text-4xl font-bold text-richblack-5 sm:text-[42px]">
                  {courseName}
                </p>
              </div>

              {/* reviews */}
              <p className={`text-richblack-200`}>{courseDescription}</p>
              <div className="text-md flex flex-wrap items-center gap-2">
                <span className="text-yellow-25">{avgReviewCount}</span>
                <RatingStars Review_Count={avgReviewCount} Star_Size={24} />
                <p>{`(${ratingAndReviews.length} reviews)`}</p>
                <p>{`${studentsEnrolled.length} students enrolled`}</p>
              </div>

              {/*  instructor data */}
              <div>
                <p className="">
                  Created By {`${instructor.firstName} ${instructor.lastName}`}
                </p>
              </div>
              <div className="flex flex-wrap gap-5 text-lg">
                <p className="flex items-center gap-2">
                  {" "}
                  <BiInfoCircle /> Created at {formatDate(createdAt)}
                </p>
                <p className="flex items-center gap-2">
                  {" "}
                  <HiOutlineGlobeAlt /> English
                </p>
              </div>
            </div>

            {/*  price of the course */}
            <div className="flex w-full flex-col gap-4 border-y border-y-richblack-500 py-4 lg:hidden">
              <p className="space-x-3 pb-4 text-3xl font-semibold text-richblack-5">
                Rs. {price}
              </p>
              <button className="yellowButton" onClick={handleBuyCourse}>
                Buy Now
              </button>
              <button className="blackButton">Add to Cart</button>
            </div>
          </div>

          {/* Courses Card */}
          <div className="right-[1rem] top-[60px] mx-auto hidden min-h-[600px] w-1/3 max-w-[410px] translate-y-24 md:translate-y-0 lg:absolute  lg:block">
            <CourseDetailsCard
              course={response?.data?.courseDetails}
              setConfirmationModal={setConfirmationModal}
              handleBuyCourse={handleBuyCourse}
            />
          </div>
        </div>
      </div>

      {/*  description section */}
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
          <div className="my-8 border border-richblack-600 p-8">
            <p className="text-3xl font-semibold">What you'll learn</p>
            <div className="mt-5">
              <p>{whatYouWillLearn}</p>
            </div>
          </div>

          {/* Course Content Section */}
          <div className="max-w-[830px] ">
            <div className="flex flex-col gap-3">
              <p className="text-[28px] font-semibold">Course Content</p>
              <div className="flex flex-wrap justify-between gap-2">
                <div className="flex gap-2">
                  <span>
                    {courseContent.length} {`section(s)`}
                  </span>
                  <span>
                    {totalNoOfLectures} {`lecture(s)`}
                  </span>
                  <span>{response.data?.totalDuration} total length</span>
                </div>
                <div>
                  <button
                    className="text-yellow-25"
                    onClick={() => setIsActive([])}
                  >
                    Collapse all sections
                  </button>
                </div>
              </div>
            </div>

            {/* Course Details Accordion */}
            <div className="py-4">
              {courseContent?.map((course, index) => (
                <CourseAccordionBar
                  course={course}
                  key={index}
                  isActive={isActive}
                  handleActive={handleActive}
                />
              ))}
            </div>

            {/* Author Details */}
            <div className="mb-12 py-4">
              <p className="text-[28px] font-semibold">Author</p>
              <div className="flex items-center gap-4 py-4">
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt="Author"
                  className="h-14 w-14 rounded-full object-cover"
                />
                <p className="text-lg">{`${instructor.firstName} ${instructor.lastName}`}</p>
              </div>
              <p className="text-richblack-50">
                {instructor?.additionalDetails?.about}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/*  show footer in end of the page */}
      <Footer />

      {/*  confirmation modal with its own styling */}
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  );
};

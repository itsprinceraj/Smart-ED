import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { IconBtn } from "../../common/IconBtn";
import { BsChevronDown, BsChevronRight } from "react-icons/bs";
import { IoIosArrowBack } from "react-icons/io";
import {
  IoCheckmarkDoneCircleOutline,
  IoCheckmarkDoneCircleSharp,
} from "react-icons/io5";
import toast from "react-hot-toast";

export const LectureSidebar = ({ setReviewModal }) => {
  const [activeStatus, setActiveStatus] = useState(null);
  const [videoBarActive, setVideoBarActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { sectionId, subSectionId } = useParams();

  // Fetch redux states for viewCourse
  const {
    courseSectionData,
    courseEntireData,
    totalNoOfLectures,
    completedLectures,
  } = useSelector((state) => state.viewCourse);

  // Handle keydown to prevent video control when modal is open
  const handleKeyDown = (event) => {
    const focusedElement = document.activeElement;
    const isTextInputFocused =
      focusedElement.tagName === "TEXTAREA" ||
      (focusedElement.tagName === "INPUT" && focusedElement.type === "text");

    if (!isTextInputFocused) {
      if (event.key === " " || event.key.toLowerCase() === "f") {
        event.preventDefault();
      }
    }
  };

  //  on first render , of the review modal, disabled control keys for video
  useEffect(() => {
    const addReviewListener = (isOpen) => {
      if (isOpen) {
        window.addEventListener("keydown", handleKeyDown);
      } else {
        window.removeEventListener("keydown", handleKeyDown);
      }
    };

    // Call the function initially to add the event listener if the modal is open
    addReviewListener(setReviewModal);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [setReviewModal]);

  // On first render, set all the user course data
  useEffect(() => {
    (() => {
      if (!courseSectionData.length) return;

      // Find current Section Index
      const currentSectionIndx = courseSectionData.findIndex((data) => {
        return data?._id === sectionId;
      });

      // Find current SubSection Index
      const currentSubSectionIndx = courseSectionData?.[
        currentSectionIndx
      ]?.subSection.findIndex((data) => {
        return data?._id === subSectionId;
      });

      // Find active subSection id
      const activeSubSectionId =
        courseSectionData?.[currentSectionIndx]?.subSection?.[
          currentSubSectionIndx
        ]?._id;

      // Set data to show active Section and active lecture video
      setActiveStatus(courseSectionData?.[currentSectionIndx]?._id);
      setVideoBarActive(activeSubSectionId);
    })();

    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseSectionData, courseEntireData, location.pathname]);

  if (loading) {
    return;
  }

  //  check if user completed the lecture or not
  const hasCompletedCourse = completedLectures?.length === totalNoOfLectures;

  return (
    <div className="flex h-[calc(100vh-3.5rem)] w-[320px] max-w-[350px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800">
      <div className="mx-5 flex flex-col items-start justify-between gap-2 gap-y-4 border-b border-richblack-600 py-5 text-lg font-bold text-richblack-25">
        <div className="flex w-full items-center justify-between">
          <div
            onClick={() => {
              navigate(`/dashboard/enrolled-courses`);
            }}
            className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 cursor-pointer text-richblack-700 hover:scale-90"
            title="back"
          >
            <IoIosArrowBack size={30} />
          </div>
          <IconBtn
            text="Add Review"
            customClasses="ml-auto"
            onclick={() => {
              if (hasCompletedCourse) {
                setReviewModal(true);
              } else {
                toast.error(
                  "You can't write a review untill you complete the course !"
                );
              }
            }}
          />
        </div>
        <div className="flex flex-col">
          <p>{courseEntireData?.courseName}</p>
          <p className="text-md font-semibold mt-2  text-richblack-500">
            {completedLectures?.length} / {totalNoOfLectures}
          </p>
        </div>
      </div>

      <div className="h-[calc(100vh - 5rem)] overflow-y-auto">
        {courseSectionData.map((section, index) => (
          <div
            className="mt-2 cursor-pointer text-sm text-richblack-5"
            onClick={() =>
              setActiveStatus((prev) =>
                prev === section._id ? "" : section._id
              )
            }
            key={index}
          >
            <div className="flex text-xl flex-row justify-between bg-richblack-700 px-5 py-4">
              <div className="w-[70%] font-semibold">
                {section?.sectionName}
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`${
                    activeStatus === section?._id ? "rotate-90" : "rotate-0"
                  } transition-all duration-200`}
                >
                  <BsChevronRight />
                </span>
              </div>
            </div>
            {activeStatus === section?._id && (
              <div className="transition-[height] duration-300 ease-in-out">
                {section.subSection.map((topic, index) => (
                  <div
                    className={`flex gap-3 pl-8 py-2 text-lg items-center ${
                      videoBarActive === topic._id
                        ? "bg-blue-100 font-semibold text-richblack-900"
                        : "hover:bg-richblack-900"
                    } `}
                    key={index}
                    onClick={(event) => {
                      event.stopPropagation();
                      navigate(
                        `/view-course/${courseEntireData?._id}/section/${section?._id}/sub-section/${topic?._id}`
                      );
                      setVideoBarActive(topic._id);
                    }}
                  >
                    {/* Add tick icon on video completion */}
                    {completedLectures?.includes(topic?._id) && (
                      <IoCheckmarkDoneCircleOutline color="" size={22} />
                    )}
                    {topic.title}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

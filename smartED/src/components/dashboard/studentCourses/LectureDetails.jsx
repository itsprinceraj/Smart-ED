import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { BigPlayButton, Player } from "video-react";
import { IconBtn } from "../../common/IconBtn";
import { markLectureAsComplete } from "../../../services/operations/courseDetailApi";
import { updateCompletedLectures } from "../../../redux/slices/viewCourseSlice";

export const LectureDetails = () => {
  const { courseId, sectionId, subSectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const playerRef = useRef(null);
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse);

  const [loading, setLoading] = useState(false);
  const [videoData, setVideoData] = useState(null);
  const [previewSource, setPreviewSource] = useState("");
  const [videoEnded, setVideoEnded] = useState(false);

  // fetch video data on first render of this component
  useEffect(() => {
    (async () => {
      //  if there is no section data , then do nothing
      if (!courseSectionData?.length) {
        return;
      }

      //    check for params
      if (!courseId && !sectionId && !subSectionId) {
        navigate("/dashboard/enrolled-courses");
      } else {
        //  now filter data from the section and subSection
        const filteredData = courseSectionData?.filter(
          (section) => section?._id === sectionId
        );

        //  now subSection data
        const filteredLecture = filteredData?.[0]?.subSection?.filter(
          (subSection) => subSection?._id === subSectionId
        );

        //  set all the states
        setVideoData(filteredLecture?.[0]);
        setPreviewSource(courseEntireData?.thumbnail);
        setVideoEnded(false);
      }
    })();
  }, [courseEntireData, location.pathname, courseSectionData]);

  // now check that video is first video or not
  const isFirstVideo = () => {
    //  first video must be present at first sections first index and subsetion first index
    const currentSectionIdx = courseSectionData?.findIndex(
      (data) => data?._id === sectionId
    );

    //  get current subSection index
    const currentSubSecIdx = courseSectionData?.[
      currentSectionIdx
    ]?.subSection?.findIndex((data) => data?._id === subSectionId);

    //  match that the both index are [0] or not
    return currentSectionIdx === 0 && currentSubSecIdx === 0;
  };

  // check that the video is last or not
  const isLastVideo = () => {
    // get current sectionIndex
    const currentSectionIdx = courseSectionData?.findIndex(
      (data) => data?._id === sectionId
    );

    // get current subSection index
    const currentSubSecIdx = courseSectionData?.[
      currentSectionIdx
    ]?.subSection?.findIndex((data) => data?._id === subSectionId);

    // find SubSection length
    const subSectionLength =
      courseSectionData?.[currentSectionIdx]?.subSection?.length;

    // check if the video is last or not
    return (
      currentSectionIdx === courseSectionData?.length - 1 &&
      currentSubSecIdx === subSectionLength - 1
    );
  };

  const handleLectureCompletion = async () => {
    setLoading(true);

    // make an api call for mark lecture completed
    const response = await markLectureAsComplete(
      { courseId: courseId, subsectionId: subSectionId },
      token
    );

    // console.log(response);

    // check response and update lecture
    if (response) {
      dispatch(updateCompletedLectures(subSectionId));
    }
    setLoading(false);
  };

  // handle go to next button
  const goToNextVideo = () => {
    // get current sectionIndex
    const currentSectionIdx = courseSectionData?.findIndex(
      (data) => data?._id === sectionId
    );

    // get current subSection index
    const currentSubSecIdx = courseSectionData?.[
      currentSectionIdx
    ]?.subSection?.findIndex((data) => data?._id === subSectionId);

    // find SubSection length
    const subSectionLength =
      courseSectionData?.[currentSectionIdx]?.subSection?.length;

    // check that if it is the last subSection
    if (currentSubSecIdx !== subSectionLength - 1) {
      // then find nextSubSection index
      const nxtSubSecIdx =
        courseSectionData[currentSectionIdx]?.subSection[currentSubSecIdx + 1]
          ?._id;

      // now navigate to next video of the next subSection of the same Section
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${nxtSubSecIdx}`
      );
    }
  };

  // handle go to previous lecture button
  const goToPrevVideo = () => {
    // get current sectionIndex
    const currentSectionIdx = courseSectionData?.findIndex(
      (data) => data?._id === sectionId
    );

    // get current subSection index
    const currentSubSecIdx = courseSectionData?.[
      currentSectionIdx
    ]?.subSection?.findIndex((data) => data?._id === subSectionId);

    // check if the index of subSection is 0 or not, if not then get previous subSection id and navigate to it, else get previous section id and navigate to it
    if (currentSubSecIdx !== 0) {
      const prevSubSecId =
        courseSectionData?.[currentSectionIdx]?.subSection[currentSubSecIdx - 1]
          ?._id;

      // navigate to previous subSection
      navigate(
        `/view-course/${courseId}/section/${sectionId}/sub-section/${prevSubSecId}`
      );
    } else {
      const prevSectionId =
        courseEntireData?.courseContent?.[currentSectionIdx - 1]?._id;
      //   console.log(courseEntireData);

      // find length of previous subSection
      const prevSubSectionLength =
        courseSectionData?.[currentSectionIdx - 1]?.subSection?.length;

      // get id of that previous subSection
      const prevSubSecId =
        courseSectionData?.[currentSectionIdx - 1]?.subSection[
          prevSubSectionLength - 1
        ]?._id;

      // navigate to previous section and previous subSection
      navigate(
        `/view-course/${courseId}/section/${prevSectionId}/sub-section/${prevSubSecId}`
      );
    }
  };

  return (
    <div className="flex flex-col gap-5 text-white">
      {!videoData ? (
        <img
          src={previewSource}
          alt="Preview"
          className="h-full w-full rounded-md object-cover"
        />
      ) : (
        <Player
          ref={playerRef}
          aspectratio="16:9"
          playsInline
          fluid={true}
          onEnded={() => setVideoEnded(true)}
          src={videoData?.videoUrl}
        >
          <BigPlayButton position="center" />
          {/* Render When Video Ends */}
          {videoEnded && (
            <div
              style={{
                backgroundImage:
                  "linear-gradient(to top, rgb(0, 0, 0), rgba(0,0,0,0.7), rgba(0,0,0,0.5), rgba(0,0,0,0.1)",
              }}
              className="full absolute inset-0 z-[100] grid h-full place-content-center gap-6 font-inter"
            >
              {!completedLectures?.includes(subSectionId) && (
                <IconBtn
                  disabled={loading}
                  onclick={() => handleLectureCompletion()}
                  text={!loading ? "Mark As Completed" : "Loading..."}
                  customClasses="text-xl max-w-max px-4 mx-auto"
                />
              )}
              <IconBtn
                disabled={loading}
                onclick={() => {
                  if (playerRef?.current) {
                    // set the current time of the video to 0
                    playerRef?.current?.seek(0);
                    // start playing the video immediately after rewatch is clicked
                    playerRef?.current.play();
                    setVideoEnded(false);
                  }
                }}
                text="Rewatch"
                customClasses="text-xl max-w-max px-4 mx-auto mt-2"
              />
              <div className="mt-4 flex min-w-[250px] justify-center gap-x-4 text-xl">
                {!isFirstVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToPrevVideo}
                    className="backButton"
                  >
                    Prev
                  </button>
                )}
                {!isLastVideo() && (
                  <button
                    disabled={loading}
                    onClick={goToNextVideo}
                    className="blackButton"
                  >
                    Next
                  </button>
                )}
              </div>
            </div>
          )}
        </Player>
      )}

      {/*  lecture description and title */}

      <h1 className="mt-4 text-3xl font-semibold">{videoData?.title}</h1>
      <p className="pt-2 pb-8 text-lg">{videoData?.description}</p>
    </div>
  );
};

import React, { useState } from "react";
import { HomePageExplore } from "../../data/homepage-explore";
import { HighlightText } from "./HighlightText";
import { CourseCard } from "./CourseCard";

export const ExploreTabs = () => {
  const Tags = [
    "Free",
    "New to coding",
    "Most popular",
    "Skills path",
    "Career path",
  ];

  // fetch tabs
  const [tab, setTab] = useState(HomePageExplore[0].tag);
  //   console.log(tab);

  // fetch courses for each tab
  const [course, setCourse] = useState(HomePageExplore[0].courses);
  // console.log(course);

  // fetch current card to be highlighted;
  const [currentCard, setCurrentCard] = useState(
    HomePageExplore[0].courses[0].heading
  );

  // create a function by which we can swith tab with desired values
  const setCards = (value) => {
    setTab(value);
    const result = HomePageExplore.filter((course) => course.tag === value);
    setCourse(result[0].courses);
    setCurrentCard(result[0].courses[0].heading);
  };

  return (
    <>
      <div>
        {/* Explore more section Heading  */}

        <div className="text-4xl font-semibold text-center mt-10">
          Unlock the <HighlightText text={"Powern of Code"} />
        </div>
        <p className="text-center text-richblack-300 text-lg font-semibold mt-2 mb-12 ">
          Learn to Build Anything You Can Imagine
        </p>

        {/* Tab switch Buttons */}

        <div className="hidden lg:flex gap-5 mx-auto w-max bg-richblack-700 text-richblack-200 p-1 rounded-full font-medium drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] -mb-10">
          {Tags.map((element, index) => {
            return (
              <div
                key={index}
                className={`  text-[16px] flex flex-row items-center gap-2 ${
                  tab === element
                    ? "bg-richblack-900 text-richblack-5 font-medium"
                    : "text-richblack-200"
                } px-7 py-[7px] rounded-full transition-all duration-100 cursor-pointer hover:text-richblack-5`}
                onClick={() => setCards(element)}
              >
                {element}
              </div>
            );
          })}
        </div>

        {/* <div className="lg:h-[px]"></div> */}

        {/* Cards Section */}

        <div className="lg:relative lg:bottom-[0] lg:left-[50%] lg:translate-x-[-50%] lg:translate-y-[50%] gap-10 justify-center lg:gap-0 flex lg:justify-between flex-wrap w-[80%]  text-black lg:mb-1 mb-7 lg:px-0 px-3">
          {course.map((data, index) => {
            return (
              <CourseCard
                key={index}
                cardData={data}
                setCurrentCard={setCurrentCard}
                currentCard={currentCard}
              />
            );
          })}
        </div>
      </div>
    </>
  );
};

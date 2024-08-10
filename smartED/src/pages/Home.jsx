import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { HighlightText } from "../components/homepage/HighlightText";
import { CTAButton } from "../components/homepage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import { AnimateCode } from "../components/homepage/AnimateCode";
import { CodeBlock } from "../components/homepage/CodeBlock";
import { TimeLineSection } from "../components/homepage/TimeLineSection";
import { LearningLang } from "../components/homepage/LearningLang";
import { Footer } from "../components/common/Footer";
import { InstructorSection } from "../components/homepage/InstructorSection";
import { ReviewSlider } from "../components/common/ReviewSlider";
import { ExploreTabs } from "../components/homepage/ExploreTabs";
export const Home = () => {
  return (
    <>
      {/* Section 1 */}

      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 text-white">
        {/* Become an Instructor Button */}
        <Link to={"/signup"}>
          <div className="group mx-auto mt-16 w-fit rounded-full bg-richblack-800 p-1 font-bold text-richblack-200 drop-shadow-[0_1.5px_rgba(255,255,255,0.25)] transition-all duration-200 hover:scale-95 hover:drop-shadow-none">
            <div className="flex flex-row items-center gap-2 rounded-full px-10 py-[5px] transition-all duration-200 group-hover:bg-richblack-900">
              <p>Become an Instructor</p>
              <FaArrowRight />
            </div>
          </div>
        </Link>

        {/* Heading  */}

        <div className="text-center text-4xl font-semibold">
          Empower Your Future with
          <HighlightText text={"coding skills"} />
        </div>

        {/* Sub Heading  */}

        <div className="-mt-3 w-[90%] text-center text-lg font-bold text-richblack-300">
          With our online coding courses, you can learn at your own pace, from
          anywhere in the world, and get access to a wealth of resources,
          including hands-on projects, quizzes, and personalized feedback from
          instructors.
        </div>

        {/* Controll to Action Button  */}

        <div className="mt-8 flex flex-row gap-7">
          <CTAButton active={true} linkTo={"/signup"}>
            Learn More
          </CTAButton>
          <CTAButton active={false} linkTo={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
      </div>

      {/* video */}

      <div className="mx-auto my-20 shadow-[10px_-5px_50px_-5px] shadow-blue-200 w-[80%] flex justify-center ">
        <video
          className="shadow-[20px_20px_rgba(255,255,255)]"
          muted
          autoPlay
          loop
          controls
          
        >
          <source src={Banner} type="video/mp4" />
        </video>
      </div>

      {/* code Blocks Section 1 */}

      <div className="flex lg:flex-row flex-col w-[80%] mx-auto ">
        <CodeBlock
          heading={
            <div className="text-4xl font-semibold">
              Unlock your <HighlightText text={"coding potential"} /> with our
              online courses.
            </div>
          }
          subheading={
            "Our courses are designed and taught by industry experts who have years of experience in coding and are passionate about sharing theirknowledge with you."
          }
          position={"lg:flex-row"}
          ctaBtn1={{
            text: "Try it Yourself",
            active: true,
            link: "/signup",
          }}
          ctaBtn2={{
            text: "Learn More",
            active: false,
            link: "/login",
          }}
        />
        <AnimateCode
          position={"lg:flex-row"}
          backgroundGradient={<div className="codeblock1 absolute"></div>}
          codeColor={"text-yellow-25"}
          codes={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is Home Page</title>\n</head>\n<body>\n<h1>Header</h1>\n<nav><a href="/one">One</a>\n<a href="/two">Two</a>\n<a href="/three">Three</a></nav>\n</body>`}
        />
      </div>

      {/* code Blocks Section 2 */}

      <div className=" flex lg:flex-row-reverse flex-col w-[80%] mx-auto gap-48 ">
        <CodeBlock
          heading={
            <div className="text-4xl font-semibold">
              Start <HighlightText text={"coding in seconds"} />
            </div>
          }
          subheading={
            "Go ahead, give it a try. Our hands-on learning environment means you'll be writing real code from your very first lesson."
          }
          position={"lg:flex-row"}
          ctaBtn1={{
            text: "Continue Lesson",
            active: true,
            link: "/signup",
          }}
          ctaBtn2={{
            text: "Learn More",
            active: false,
            link: "/login",
          }}
        />
        <AnimateCode
          position={"lg:flex-row"}
          backgroundGradient={<div className="codeblock2 absolute"></div>}
          codeColor={" text-purple-400 "}
          codes={`import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import Banner from "../assets/Images/banner.mp4";
import { AnimateCode } from "../components/homepage/AnimateCode";
export const Home = () => {
  return (
      {/* Section 1 */}
      <div className="relative mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8"> {/* Become an Instructor Button */}`}
        />
      </div>

      {/* Explore more Tabs and Cards */}

      <ExploreTabs />

      {/* Section 2 */}

      <div className="bg-pure-greys-5 text-richblack-700">
        <div className=" homepage_bg h-[320px]">
          <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8">
            {/* Explore full catalog Section */}

            <div className=" lg:h-[150px] "></div>

            {/* Controll To Action Button */}

            <div className="flex flex-row gap-7 text-white lg:mt-8">
              <CTAButton active={true} linkTo={"/signup"}>
                <div className="flex items-center gap-2">
                  {" "}
                  Explore Full Catalog
                  <FaArrowRight />
                </div>
              </CTAButton>

              <CTAButton active={false} linkto={"/login"}>
                Learn More
              </CTAButton>
            </div>
          </div>
        </div>

        <div className="mx-auto flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 ">
          {/* job Demant Section - 1 */}

          <div className="mb-10 mt-[-100px] flex flex-col justify-between gap-7 lg:mt-20 lg:flex-row lg:gap-0">
            <div className="text-4xl font-semibold lg:w-[45%] ">
              Get the skills you need for a{" "}
              <HighlightText text={"job that is in demand."} />
            </div>
            <div className="flex flex-col items-start gap-10 lg:w-[40%]">
              <div className="text-[16px]">
                The modern StudyNotion is the dictates its own terms. Today, to
                be a competitive specialist requires more than professional
                skills.
              </div>
              <CTAButton active={true} linkTo={"/signup"}>
                Learn More
              </CTAButton>
            </div>
          </div>

          {/* TimeLine Section  */}

          <TimeLineSection />

          {/* Learning Language Section */}

          <LearningLang />
        </div>

        <div className="w-fit mx-auto lg:mb-20 mb-8 mt-5">
          <CTAButton active={true} linkTo={"/login"}>
            Learn More
          </CTAButton>
        </div>
      </div>

      {/* Section 3 */}

      {/* Instructor Section */}

      <div className="relative mx-auto my-20 flex w-11/12 max-w-maxContent flex-col items-center justify-between gap-8 bg-richblack-900 text-white">
        <InstructorSection />

        {/* Reviws from Other Learner */}
        <h1 className="text-center text-4xl font-semibold mt-8">
          Reviews from other learners
        </h1>
      </div>

      <ReviewSlider />

      <Footer />
    </>
  );
};

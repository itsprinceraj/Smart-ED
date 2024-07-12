import { Link } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { HighlightText } from "../components/homepage/HighlightText";
import { CTAButton } from "../components/homepage/CTAButton";
import Banner from "../assets/Images/banner.mp4";
import { AnimateCode } from "../components/homepage/AnimateCode";
import { CodeBlock } from "../components/homepage/CodeBlock";
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
            Learn more
          </CTAButton>
          <CTAButton active={false} linkTo={"/login"}>
            Book a Demo
          </CTAButton>
        </div>
      </div>

      {/* video */}

      <div className="mx-auto my-20 shadow-[10px_-5px_50px_-5px] shadow-blue-200 w-[80%] ">
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

      <div className=" flex w-[80%] mx-auto ">
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
          codes={`<!DOCTYPE html>\n <html lang="en">\n<head>\n<title>This is myPage</title>\n</head>\n<body>\n<h1><a href="/">Header</a></h1>\n<nav> <a href="/one">One</a> <a href="/two">Two</a> <a href="/three">Three</a>\n</nav>\n</body>`}
        />
      </div>

      {/* code Blocks Section 2 */}

      <div className=" flex flex-row-reverse w-[80%] mx-auto gap-48 ">
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
          backgroundGradient={<div className="codeblock2 absolute"></div>}
          codeColor={"text-white"}
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

      {/* Section 2 */}

      {/* Section 3 */}
    </>
  );
};

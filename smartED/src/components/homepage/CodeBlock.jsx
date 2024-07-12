import React from "react";
import { CTAButton } from "./CTAButton";
import { FaArrowRight } from "react-icons/fa";
import { HighlightText } from "./HighlightText";

export const CodeBlock = ({
  heading,
  subheading,
  position,
  ctaBtn1,
  ctaBtn2,
}) => {
  return (
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}
    >
      <div className="w-[100%] lg:w-[82%] flex flex-col gap-8">
        {heading}
        <div className="text-richblack-300 text-base font-bold w-[85%] -mt-3">
          {subheading}
        </div>

        <div className="flex gap-7 mt-7">
          {/* Button 1 */}

          <CTAButton active={ctaBtn1.active} linkTo={ctaBtn1.link}>
            <div className="flex  items-center gap-2">
              <div className="flex items-center gap-2">{ctaBtn1.text}</div>
              <FaArrowRight />
            </div>
          </CTAButton>

          {/* button 2 */}

          <CTAButton active={ctaBtn2.active} linkTo={ctaBtn2.link}>
            {ctaBtn2.text}
          </CTAButton>
        </div>
      </div>
    </div>
  );
};

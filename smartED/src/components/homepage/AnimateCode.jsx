import React from "react";
import { TypeAnimation } from "react-type-animation";

export const AnimateCode = ({
  position,
  backgroundGradient,
  codeColor,
  codes,
}) => {
  return (
    // Numbering of coding animation lines
    <div
      className={`flex ${position} my-20 justify-between flex-col lg:gap-10 gap-10`}
    >
      <div className="h-fit code-border flex flex-row py-3 text-[10px] sm:text-sm leading-[18px] sm:leading-6 relative w-[100%] lg:w-[470px]">
        {backgroundGradient}

        {/* Numbering or indexing of Codes */}

        <div className="text-center flex flex-col   w-[10%] select-none text-richblack-400 font-inter font-bold ">
          <p>1</p>
          <p>2</p>
          <p>3</p>
          <p>4</p>
          <p>5</p>
          <p>6</p>
          <p>7</p>
          <p>8</p>
          <p>9</p>
          <p>10</p>
          <p>11</p>
        </div>

        {/* Code Template */}

        <div
          className={`w-[90%] flex flex-col gap-2 font-bold font-mono ${codeColor} pr-1`}
        >
          <TypeAnimation
            sequence={[codes, 5000, ""]}
            repeat={Infinity}
            cursor={true}
            omitDeletionAnimation={true}
            style={{
              display: "block",
              whiteSpace: "pre-line",
            }}
          />
        </div>
      </div>
    </div>
  );
};

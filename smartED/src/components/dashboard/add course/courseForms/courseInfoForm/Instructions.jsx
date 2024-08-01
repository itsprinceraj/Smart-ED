import React, { useEffect, useState } from "react";
import { MdOutlineClear } from "react-icons/md";
import { useSelector } from "react-redux";

export const Instructions = ({ label, name, register, setValue, errors }) => {
  const [instructions, setInstructions] = useState("");
  // console.log(instructions);
  const [instructionList, setInstructionList] = useState([]);
  // console.log(instructionList);
  const { course, editCourse } = useSelector((state) => state.course);

  //  call course editing criteria under useEffect
  useEffect(() => {
    if (editCourse) {
      //  if user editing the course , then set the previous course data to the ui
      setInstructionList(course?.instructions);
    }

    // register the form the compoments mounts
    register(name, { required: true, validation: (value) => value.length > 0 });
  }, []);

  //  now call course creation and handling under useEffect
  useEffect(() => {
    setValue(name, instructionList);
  }, [instructionList]);

  //  create a function for handling addition of instructions
  const handleAddInstruction = () => {
    if (instructions) {
      setInstructionList([...instructionList, instructions]);
      setInstructions("");
    }
  };

  //  create a function for handling removal of instructions
  const handleRemoveInstruction = (index) => {
    //  dont change the actual array , create a copy of it
    const newInstuctionList = [...instructionList];

    //  remove 1 element from that particular index that matches the argument of the function call
    newInstuctionList.splice(index, 1);
    setInstructionList(newInstuctionList);
  };

  return (
    <div className="flex flex-col space-y-2">
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>
      <div className="flex flex-col items-start space-y-2">
        <input
          type="text"
          id={name}
          placeholder="Enter Instructions for the course"
          value={instructions}
          onChange={(e) => setInstructions(e.target.value)}
          className="form-style w-full"
        />
        <button
          type="button"
          onClick={handleAddInstruction}
          className="font-semibold text-blue-100 text-xl mt-2"
        >
          Add
        </button>
      </div>
      {instructionList.length > 0 && (
        <ul className="mt-2 list-inside list-disc">
          {instructionList.map((instructions, index) => (
            <li
              key={index}
              className="flex items-center justify-between w-[50%] text-richblack-5 gap-x-3"
            >
              <span className="text-lg">{instructions}</span>
              <button
                type="button"
                className="ml-2 text-md text-pure-greys-300 transition-all duration-200 hover:text-pink-200 hover:scale-110 "
                onClick={() => handleRemoveInstruction(index)}
              >
                <MdOutlineClear size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

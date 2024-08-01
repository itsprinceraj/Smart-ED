import React, { useEffect, useState } from "react";
import { MdClose } from "react-icons/md";
import { useSelector } from "react-redux";

export const TagInput = ({
  label,
  setValue,
  placeholder,
  name,
  errors,
  register,
}) => {
  const { course, editCourse } = useSelector((state) => state.course);
  // console.log(course);
  //  maintain a state of tags
  const [tags, setTags] = useState([]);
  // console.log(tags);

  //
  useEffect(() => {
    //  registering forms inside useEffect is a common approach when handlin dependancy with props
    register(name, {
      required: true,
      validate: (value) => value.length > 0,
    });

    if (editCourse) {
      // when editCourse is true , then the previous tags value must be present on the ui , cause you are editing the previously created course. so , setTags to the course.tag value
      setTags(course?.tag);
    }

    //  on first render , if user is editing the course , then setTags to its previous value , and register the input field
  }, []);

  //  set the value of the tag , using useEffect so that the form data must be synced and sent correctly ,
  useEffect(() => {
    setValue(name, tags);
  }, [tags, setValue, name]);

  //  create a handleKeydown method so that,  after pressing enter or comma , the tag must be set to setTags array
  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === ",") {
      //  prevent default functinality
      event.preventDefault();

      //  check if tags value is comming or not
      const tagVal = event.target.value;

      //  check if tag value came in tags or not , if  not the set it to the array
      if (tagVal && !tags.includes(tagVal)) {
        //  create a new array and put previous and new value in it and setTags to new one
        const newTag = [...tags, tagVal];
        setTags(newTag);
        event.target.value = "";
      }
    }
  };

  //  create a handleDeleteTag function to add delete tag functionality
  const handleDeleteTag = (tagIndex) => {
    //  jis tag ko delete karna chahte hai , uski index , current tag ki index se match honi chaiye . or jiski match na kre use array me rehn do
    const newTags = tags.filter((tag, index) => index !== tagIndex); // jo is filter criteria ko pass karega wohi tags array me rahega , baki drop ho jayege
    setTags(newTags);
  };
  return (
    <div className="flex flex-col space-y-2">
      {/* Render the label for the input */}
      <label className="text-sm text-richblack-5" htmlFor={name}>
        {label} <sup className="text-pink-200">*</sup>
      </label>

      {/* Render the tags and input */}
      <div className="flex w-full flex-wrap gap-y-2">
        {/* Map over the chips array and render each chip */}
        {tags.map((tag, index) => (
          <div
            key={index}
            className="m-1 flex items-center rounded-full bg-blue-100 px-1 py-1 pl-3  text-sm text-richblack-900"
          >
            {/* Render the tag value */}
            {tag}

            {/* Render the button to delete the tag */}
            <button
              type="button"
              className="ml-2 px-1 focus:outline-none"
              onClick={() => handleDeleteTag(index)}
            >
              <MdClose className="text-sm" />
            </button>
          </div>
        ))}

        {/* Render the input for adding new tags */}
        <input
          id={name}
          name={name}
          type="text"
          placeholder={placeholder}
          onKeyDown={handleKeyDown}
          className="form-style w-full"
        />
      </div>

      {/* Render an error message if the input is required and not filled */}
      {errors[name] && (
        <span className="ml-2 text-xs tracking-wide text-pink-200">
          {label} is required
        </span>
      )}
    </div>
  );
};

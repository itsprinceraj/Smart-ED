import React, { useState } from "react";
import { MdEdit } from "react-icons/md";
import { RxDropdownMenu } from "react-icons/rx";
import { RiDeleteBin6Line } from "react-icons/ri";
import { AiFillCaretDown } from "react-icons/ai";
import { FaPlus } from "react-icons/fa";
import { ConfirmationModal } from "../../../../common/ConfirmationModal";
import { useDispatch, useSelector } from "react-redux";
import { SubSectionModal } from "./SubSectionModal";
import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailApi";
import { setCourse } from "../../../../../redux/slices/courseSlice";

export const NestedView = ({ changeSectionName }) => {
  const { course } = useSelector((state) => state.course);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [confirmationModal, setConfirmationModal] = useState(null);
  const [viewSubSection, setViewSubSection] = useState(null);
  const [editSubSection, setEditSubSection] = useState(null);
  const [addSubSection, setAddSubsection] = useState(null);
  // const []

  //  create a function for handle delete section
  const handleDeleleSection = async (sectionId) => {
    // make api call
    const result = await deleteSection(
      {
        sectionId,
        courseId: course._id,
      },
      token
    );

    // if section is deleted from a particular course, then update the course state
    if (result) {
      dispatch(setCourse(result));
    }
    setConfirmationModal(null);
  };

  //  create a function for handling delete subSection
  const handleDeleteSubSection = async (sectionId, subSectionId) => {
    const result = await deleteSubSection({ sectionId, subSectionId, token });
    if (result) {
      //  update course or delete subsection from that particular course
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      );
      const updatedCourse = { ...course, courseContent: updatedCourseContent };

      //  update state with updated course
      dispatch(setCourse(updatedCourse));
    }
    setConfirmationModal(null);
  };

  return (
    <>
      <div
        className="rounded-lg bg-richblack-700 p-6 px-8"
        id="nestedViewContainer"
      >
        {/*  apply map function section  */}
        {course?.courseContent?.map((section) => (
          // Section Dropdown
          <details key={section._id} open>
            {/* Section Dropdown Content */}
            <summary className="flex cursor-pointer items-center justify-between border-b-2 border-b-richblack-600 py-2">
              <div className="flex items-center gap-x-3">
                <RxDropdownMenu className="text-2xl text-richblack-50" />
                <p className="font-semibold text-richblack-50">
                  {section.sectionName}
                </p>
              </div>
              <div className="flex items-center gap-x-3">
                <button
                  onClick={() =>
                    changeSectionName(section._id, section.sectionName)
                  }
                >
                  <MdEdit className="text-xl text-richblack-300" />
                </button>
                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2: "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () => handleDeleleSection(section._id),
                      btn2Handler: () => setConfirmationModal(null),
                    })
                  }
                >
                  <RiDeleteBin6Line className="text-xl text-richblack-300" />
                </button>
                <span className="font-medium text-richblack-300">|</span>
                <AiFillCaretDown className={`text-xl text-richblack-300`} />
              </div>
            </summary>

            {/* Render All Sub Sections Within a Section */}
            <div className="px-6 pb-4">
              {/*  apply map on subsection  */}
              {section.subSection.map((data) => (
                <div
                  key={data?._id}
                  // we have applied onclick on this div . edit subsection and delete subsection also includes under this div, so we need to stop progation to its nested elements
                  onClick={() => setViewSubSection(data)}
                  className="flex cursor-pointer items-center justify-between gap-x-3 border-b-2 border-b-richblack-600 py-2"
                >
                  <div className="flex items-center gap-x-3 py-2 ">
                    <RxDropdownMenu className="text-2xl text-richblack-50" />
                    <p className="font-semibold text-richblack-50">
                      {data.title}
                    </p>
                  </div>
                  <div
                    //  stop propagation to this div's nested elements
                    onClick={(e) => e.stopPropagation()}
                    className="flex items-center gap-x-3"
                  >
                    {/*  edit subsection button  */}
                    <button
                      onClick={() =>
                        //  kis section ki subSection ko edit kar rhe ho uski id or subSection ka data bhej do
                        setEditSubSection({ ...data, sectionId: section._id })
                      }
                    >
                      <MdEdit className="text-xl text-richblack-300" />
                    </button>

                    {/*  delete subsection button  */}
                    <button
                      onClick={() =>
                        setConfirmationModal({
                          text1: "Delete this Sub-Section?",
                          text2: "This lecture will be deleted",
                          btn1Text: "Delete",
                          btn2Text: "Cancel",
                          btn1Handler: () =>
                            //  kis section me se kis subSection ko delete kar rhe ho
                            handleDeleteSubSection(data._id, section._id),
                          btn2Handler: () => setConfirmationModal(null),
                        })
                      }
                    >
                      <RiDeleteBin6Line className="text-xl text-richblack-300" />
                    </button>
                  </div>
                </div>
              ))}
              {/* Add New Lecture button */}
              <button
                //  kis Section me subSection add karna hai uski id bhej do
                onClick={() => setAddSubsection(section._id)}
                className="mt-3 flex items-center gap-x-1 text-yellow-50"
              >
                <FaPlus className="text-lg" />
                <p>Add Lecture</p>
              </button>
            </div>
          </details>
        ))}
      </div>
      {/* ************ Modal Display ************** */}

      {/*  if addSubSection is true , show subsectionmodal with addSubSection data */}
      {addSubSection ? (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add={true}
        />
      ) : // if viewSubSection is true , show subsectionmodal with viewSubSection data
      viewSubSection ? (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view={true}
        />
      ) : // if editSubSection is true , show subsectionmodal with editSubSection data
      editSubSection ? (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit={true}
        />
      ) : (
        <></>
      )}
      {/* Confirmation Modal for delete subsection and section  */}
      {confirmationModal ? (
        <ConfirmationModal modalData={confirmationModal} />
      ) : (
        <></>
      )}
    </>
  );
};

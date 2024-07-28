import React, { useState } from "react";
import { FiTrash2 } from "react-icons/fi";
import { deleteAccount } from "../../../services/operations/settingsApi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../../common/ConfirmationModal";

export const DeleteAccount = () => {
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // maintain a state for modal
  const [modal, setModal] = useState(null);

  //  create a handle delete function
  const handleDeleteAccount = () => {
    setModal({
      text1: "Are you sure?",
      text2: "Your Account will be permanently deleted !",
      btn1: "Delete",
      btn2: "Cancel",
      btn1Handler: () => dispatch(deleteAccount(token, navigate)),
      btn2Handler: () => setModal(null),
    });
  };
  return (
    <>
      <div className="my-10 flex flex-row gap-x-5 rounded-md border-[1px] border-pink-700 bg-pink-900 p-8 px-12">
        <div className="flex h-16 w-16 p-5 items-center justify-center rounded-full bg-pink-700">
          <FiTrash2 className="text-3xl text-pink-200" size={25} />
        </div>
        <div className="flex flex-col space-y-2">
          <h2 className="text-lg font-semibold text-richblack-5">
            Delete Account
          </h2>
          <div className="w-3/5 text-pink-25">
            <p>Would you like to delete account?</p>
            <p>
              This account may contain Paid Courses. Deleting your account is
              permanent and will remove all the contain associated with it.
            </p>
          </div>
          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300"
            onClick={handleDeleteAccount}
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {modal && <ConfirmationModal modalData={modal} />}
    </>
  );
};

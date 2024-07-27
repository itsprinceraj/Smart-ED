import React, { useState } from "react";

import { sidebarLinks } from "../../data/dashboard-links";
import { useDispatch, useSelector } from "react-redux";
import { SidebarLink } from "./SidebarLink";
import { VscSignOut } from "react-icons/vsc";
import { logoutRequest } from "../../services/operations/authApiHandler";
import { useNavigate } from "react-router-dom";
import { ConfirmationModal } from "../common/ConfirmationModal";

export const Sidebar = () => {
  //  modal state
  const [modal, setModal] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // extract user form profile slice
  const { user, loading: profileLoading } = useSelector(
    (state) => state.profile
  );
  const { loading: authLoading } = useSelector((state) => state.auth);

  // show loading screen
  if (profileLoading || authLoading) {
    return (
      <div className="grid h-[calc(100vh-3.5rem)] min-w-[220px] items-center border-r-[1px] border-r-richblack-700 bg-richblack-800">
        <div className="spinner"></div>;
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
      <div className="flex flex-col">
        {sidebarLinks.map((link) => {
          if (link.type && user.accountType !== link.type) {
            // console.log(link);
            return null;
          }

          // else return sidebar links

          return <SidebarLink key={link.id} link={link} iconName={link.icon} />;
        })}
      </div>

      <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
      {/* Setting and logout button */}
      <div className="flex flex-col">
        <SidebarLink
          link={{ name: "Settings", path: "/dashboard/settings" }}
          iconName="VscSettingsGear"
        />

        {/* logout button */}

        <button
          className="px-8 py-2 text-sm font-medium text-richblack-300"
          onClick={() =>
            setModal({
              text1: "Are you sure?",
              text2: "You will be logged out of your Account.",
              btn1: "Log out",
              btn2: "Cancel",
              btn1Handler: () => dispatch(logoutRequest(navigate)),
              btn2Handler: () => setModal(null),
            })
          }
        >
          <div className="flex items-center gap-x-2">
            <VscSignOut className="text-lg" />
            <span>Logout</span>
          </div>
        </button>
      </div>

      {/* confirmation modal */}
      {modal && <ConfirmationModal modalData={modal} />}
    </div>
  );
};

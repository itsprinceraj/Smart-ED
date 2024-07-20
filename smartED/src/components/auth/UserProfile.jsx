import React, { useState, useRef, useEffect } from "react";
import { AiOutlineCaretDown } from "react-icons/ai";
import { VscDashboard, VscSignOut } from "react-icons/vsc";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutRequest } from "../../services/operations/authApiHandler";

export const UserProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.profile);
  const ref = useRef(); // ref gives reference of a value which is not needed for rendering

  //  if a user clicks outside of that profile then the div must be hidden

  // Add event listener for document clicks
  useEffect(() => {
    const handleDocumentClick = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        // it represents the curretn dropdown component
        return;
      }
      setOpen(false);
    };

    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("touchstart", handleDocumentClick);

    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("touchstart", handleDocumentClick);
    };
  }, []);

  if (!user) return null;

  return (
    <>
      {/* here we are referring this dropdown element or div by using ref attribute  */}
      <button ref={ref} className="relative " onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-x-1">
          <img
            className="aspect-square w-[30px] rounded-full object-cover"
            src={user?.image}
            alt={`profile- ${user?.firstName}`}
          />

          <AiOutlineCaretDown
            className={`text-sm text-richblack-100 transition-all duration-200 ${
              open ? " rotate-180 " : ""
            }  `}
          />
        </div>

        {/*  dropdown options */}

        {open && (
          <div
            onClick={(event) => event.stopPropagation()} // <--- Prevent click inside dropdown from propagating
            className="absolute top-[118%] right-0 z-[1000] divide-y-[1px] divide-richblack-700 overflow-hidden rounded-md border-[1px] border-richblack-700 bg-richblack-800"
          >
            {/* Dashboard button */}

            <Link to={"/dashboard/my-profile"}>
              <div className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25">
                <VscDashboard className="text-lg" />
                Dashboard
              </div>
            </Link>

            {/*  LOgout Button  */}

            <div
              onClick={() => {
                dispatch(logoutRequest(navigate));
                setOpen(false);
              }}
              className="flex w-full items-center gap-x-1 py-[10px] px-[12px] text-sm text-richblack-100 hover:bg-richblack-700 hover:text-richblack-25"
            >
              <VscSignOut className="text-lg" />
              Log Out
            </div>
          </div>
        )}
      </button>
    </>
  );
};

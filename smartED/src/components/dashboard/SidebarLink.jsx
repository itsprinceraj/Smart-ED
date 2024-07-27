import React from "react";
import { matchPath, NavLink, useLocation } from "react-router-dom";
import * as Icons from "react-icons/vsc";

export const SidebarLink = ({ link, iconName }) => {
  const Icon = Icons[iconName]; // get icons

  // // Debugging: Check if the iconName and Icon are valid
  // console.log("iconName:", iconName);
  // console.log("Icon:", Icon);

  const location = useLocation();

  // create a function by which you'll match routes and render stylings accordingly

  const matchRoute = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  //  returning jsx

  return (
    <>
      <NavLink
        to={link.path}
        className={`relative px-8 py-2 text-sm font-medium ${
          matchRoute(link.path)
            ? "bg-yellow-800 text-yellow-50"
            : "bg-opacity-0 text-richblack-300"
        } transition-all duration-200`}
      >
        {/*  sideBarLink highlight span */}
        <span
          className={`absolute left-0 top-0 h-full w-[0.15rem] bg-yellow-50 ${
            matchRoute(link.path) ? "opacity-100" : "opacity-0"
          }`}
        ></span>

        {/*  link names */}
        <div className="flex items-center gap-x-2">
          <Icon className="text-lg" />
          <span>{link.name}</span>
        </div>
      </NavLink>
    </>
  );
};

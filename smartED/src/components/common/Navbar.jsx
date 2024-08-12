import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo/logo.webp";
import Logo2 from "../../assets/Logo/terminal.png";
import { Link, NavLink, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utilities/constants";
import { AiOutlineShoppingCart } from "react-icons/ai";
import { Divide as Hamburger } from "hamburger-react";
import { RiArrowDropDownLine } from "react-icons/ri";
import { UserProfile } from "../auth/UserProfile";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apiEndPoints";

export const Navbar = () => {
  //  fetch token and user from redux state
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.profile.user);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const location = useLocation();

  //  create a matchRoute functin , so that highlight them when path matches
  const matchRoutePath = (route) => {
    return matchPath({ path: route }, location.pathname);
  };

  //  maintain states for loading and sublink
  const [loading, setLoading] = useState(false);
  const { CATEGORIES_API } = categories;
  const [sublink, setSublink] = useState([]);
  const [open, setOpen] = useState(false);

  //  call the get category api on first render and when pathname changes
  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        let { data } = await apiConnector("GET", CATEGORIES_API);
        const categoryLink = data;
        setSublink(categoryLink);
      } catch (err) {
        console.log(err.message);
        toast.error("Unable to fetch categories");
      }
      setLoading(false);
    })();
  }, [CATEGORIES_API, location.pathname]);

  //  handle resize of screen
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  //  handle hamburger icon
  const handleHamburgerButton = () => {
    setOpen(!open);
  };

  return (
    <div
      className={`flex h-20 items-center justify-center border-b-[1px] border-b-richblack-700  transition-all duration-200 text-lg`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between gap-16">
        <Link to={"/"}>
          <div className="flex relative ml-4 mt-2">
            <img src={Logo} alt="logo" height={32} width={160} loading="lazy" />
            <img
              src={Logo2}
              alt="logo"
              style={{ height: 25, width: 30 }}
              loading="lazy"
              className="rotate-12 absolute -left-6 -top-3"
            />
          </div>
        </Link>

        {/*  Navigation Links */}
        <nav
          className={`${
            open
              ? "block  pt-4  absolute lg:static top-20 left-0 w-full lg:w-auto  "
              : ""
          } ${
            !open &&
            " max-lg:hidden flex items-center lg:text-richblack-25 bg-richblack-800 bg-transparent"
          } `}
        >
          <ul
            className={`${
              open
                ? " gap-x-8 px-12 flex-wrap justify-center"
                : " justify-between"
            } flex lg:flex-row gap-y-4 lg:gap-x-8`}
          >
            {NavbarLinks?.map((navLink, index) => (
              <li key={index} className="">
                {navLink?.title === "Catalog" ? (
                  <div
                    className={`group relative flex cursor-pointer items-center gap-1 ${
                      matchRoutePath("/catalog/:catalogName")
                        ? "text-yellow-25"
                        : "text-richblack-25"
                    }`}
                  >
                    <p>{navLink?.title}</p>
                    <RiArrowDropDownLine
                      style={{ height: 32, width: 32 }}
                      className="absolute -right-6 pr-1 pl-[2px]"
                    />

                    {/* dropdown */}
                    <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                      <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>

                      {loading ? (
                        <p className="text-center">Loading...</p>
                      ) : sublink && sublink.length ? (
                        <>
                          {sublink
                            .filter((link) => link?.courses?.length > 0)
                            .map((elements, index) => (
                              <Link
                                to={`/catalog/${elements.name
                                  .split(" ")
                                  .join("-")
                                  .toLowerCase()}`}
                                key={index}
                                className="rounded-lg bg-transparent py-4 pl-4 hover:bg-richblack-50"
                              >
                                {elements.name}
                              </Link>
                            ))}
                        </>
                      ) : (
                        <p className="text-center text-richblack-200">
                          No Courses Found
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <Link to={navLink?.path}>
                    <p
                      className={`transition-all duration-75 ${
                        matchRoutePath(navLink?.path)
                          ? " text-yellow-25 "
                          : "text-richblack-25"
                      }`}
                    >
                      {navLink?.title}
                    </p>
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Login and signup button , Dashboard */}
          <div
            className={`flex ${
              open && "justify-center mt-2"
            } lg:ml-20 gap-8 gap-y-4 lg:gap-x-10`}
          >
            {token === null && (
              <>
                <NavLink to={"/login"}>
                  <p
                    className={`${
                      open
                        ? "text-richblack-25 hover:text-white transition-all duration-200"
                        : "rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:text-white transition-all duration-200"
                    } `}
                  >
                    Login
                  </p>
                </NavLink>

                <NavLink to={"/signup"}>
                  <p
                    className={`${
                      open
                        ? "text-richblack-25 hover:text-white transition-all duration-200"
                        : "rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:text-white transition-all duration-200"
                    } `}
                  >
                    Sign Up
                  </p>
                </NavLink>
              </>
            )}

            {user && user?.accountType !== ACCOUNT_TYPE?.INSTRUCTOR && (
              <Link to={"/dashboard/cart"}>
                <AiOutlineShoppingCart className="text-3xl text-richblack-100 hover:text-white transition-all duration-200" />

                {totalItems > 0 && (
                  <span className="absolute -top-[0.3rem] right-[4.5rem] grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                    {totalItems}
                  </span>
                )}
              </Link>
            )}

            {token !== null && <UserProfile />}
          </div>
        </nav>

        {/*  hamburger icon */}
        <div className="lg:hidden">
          <button className="mr-4 lg:hidden ">
            <Hamburger
              toggled={open}
              toggle={setOpen}
              color="#AFB2BF"
              size={24}
              duration={0.4}
              onToggle={handleHamburgerButton}
            />
          </button>
        </div>
      </div>
    </div>
  );
};

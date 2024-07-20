import React, { useEffect, useState } from "react";
import Logo from "../../assets/Logo/logo.webp";
import { Link, matchPath, useLocation } from "react-router-dom";
import { NavbarLinks } from "../../data/navbar-links";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { ACCOUNT_TYPE } from "../../utilities/constants";
import { AiOutlineMenu, AiOutlineShoppingCart } from "react-icons/ai";
import { RiArrowDropDownLine } from "react-icons/ri";
import { UserProfile } from "../auth/UserProfile";
import { apiConnector } from "../../services/apiConnector";
import { categories } from "../../services/apiEndPoints";

export const Navbar = () => {
  // get token from authslice
  const token = useSelector((state) => state.auth.token); // useSelector is used to fetch the slices of the redux store

  // get user fro profile slice
  const user = useSelector((state) => state.profile.user);

  // get totalItems from cartSlice
  const totalItems = useSelector((state) => state.cart.totalItems);

  // take instance of useLocation hook
  const location = useLocation();
  const matchRoutePath = (route) => {
    // console.log("printing path", location.pathname);

    //matchPath method from react-router-dom is used to perform searching between the routes or url path
    return matchPath({ path: route }, location.pathname); // location.pathname depicts the current path , at where you are on the URL;
  };

  //   catalog sublinks with Static DATA
  // const ssublink = [
  //   {
  //     title: "Python",
  //     path: "/catalog/python",
  //   },
  //   {
  //     title: "Web Dev",
  //     path: "/catalog/web-dev",
  //   },
  // ];

  const { CATEGORIES_API } = categories;

  // sublink states
  const [sublink, setSublink] = useState([]);

  // make an Api call
  const fetchCategories = async () => {
    setLoading(true);
    try {
      let { data } = await apiConnector("GET", CATEGORIES_API);
      const categoryLink = data;
      // console.log(data);
      setSublink(categoryLink);
      // toast.success("Categories fetched Successfully");
    } catch (err) {
      console.log(err);
      //   toast.error("Unable to fetch categories");
    }
    setLoading(false);
  };

  // always make api calls inside useEffect Hook
  useEffect(() => {
    fetchCategories();
  }, []);

  // loading state
  const [loading, setLoading] = useState(false);
  return (
    <div
      className={`flex h-14 items-center justify-center border-b-[1px] border-b-richblack-700 transition-all duration-200`}
    >
      <div className="flex w-11/12 max-w-maxContent items-center justify-between">
        {/* Logo */}

        <Link to={"/"}>
          <img src={Logo} alt="logo" height={32} width={160} loading="lazy" />
        </Link>

        {/*  Navigation Links */}

        <nav className="hidden md:block">
          <ul className="flex gap-x-6 text-richblack-25">
            {NavbarLinks.map((navLink, index) => {
              return (
                <li key={index} className="">
                  {navLink?.title === "Catalog" ? (
                    <>
                      <div
                        className={`group relative flex cursor-pointer items-center gap-1 ${
                          matchRoutePath("/catalog/:catalogName")
                            ? "text-yellow-25"
                            : "text-richblack-25"
                        }`}
                      >
                        <p>{navLink.title}</p>
                        <RiArrowDropDownLine
                          style={{ height: 32, width: 32 }}
                          className=" absolute -right-6  pr-1 pl-[2px]"
                        />

                        {/* dropdown  */}

                        <div className="invisible absolute left-[50%] top-[50%] z-[1000] flex w-[200px] translate-x-[-50%] translate-y-[3em] flex-col rounded-lg bg-richblack-5 p-4 text-richblack-900 opacity-0 transition-all duration-150 group-hover:visible group-hover:translate-y-[1.65em] group-hover:opacity-100 lg:w-[300px]">
                          <div className="absolute left-[50%] top-0 -z-10 h-6 w-6 translate-x-[80%] translate-y-[-40%] rotate-45 select-none rounded bg-richblack-5"></div>

                          {loading ? (
                            <p className="text-center">Loading...</p>
                          ) : sublink && sublink.length ? (
                            <>
                              {sublink
                                .filter((link) => link?.courses?.length > 0)
                                .map((elements, index) => {
                                  return (
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
                                  );
                                })}
                            </>
                          ) : (
                            <p className="text-center text-richblack-200">
                              No Courses Found
                            </p>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <Link to={navLink?.path}>
                      <p
                        className={`${
                          matchRoutePath(navLink?.path)
                            ? " text-yellow-25 "
                            : "text-richblack-25"
                        }`}
                      >
                        {navLink.title}
                      </p>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>

        {/*  Login and signup button , Dashboard  */}

        <div className="hidden items-center gap-x-4 md:flex relative">
          {/* Login button */}
          {token === null && (
            <Link to={"/login"}>
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:text-white transition-all duration-200">
                Log In
              </button>
            </Link>
          )}

          {/* signup button */}

          {token === null && (
            <Link to={"/signup"}>
              <button className="rounded-[8px] border border-richblack-700 bg-richblack-800 px-[12px] py-[8px] text-richblack-100 hover:text-white transition-all duration-200">
                Sign Up
              </button>
            </Link>
          )}

          {/* If user is logged in then show dashboard , cart and search icon */}

          {user && user?.accountType !== ACCOUNT_TYPE.INSTRUCTOR && (
            <Link to={"/dashboard/cart"}>
              <AiOutlineShoppingCart className="text-2xl text-richblack-100 hover:text-white transition-all duration-200" />

              {/* overlap number of items in the cart */}

              {totalItems > 0 && (
                <span className="absolute -bottom-2 -right-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full bg-richblack-600 text-center text-xs font-bold text-yellow-100">
                  {totalItems}
                </span>
              )}
            </Link>
          )}

          {/* now show dashboard if user is logged in */}

          {token !== null && <UserProfile />}
        </div>
        <button className="mr-4 md:hidden">
          <AiOutlineMenu fontSize={24} fill="#AFB2BF" />
        </button>
      </div>
    </div>
  );
};

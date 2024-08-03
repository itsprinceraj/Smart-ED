import React, { useEffect, useState } from "react";
import { CourseSlider } from "../components/catalog/CourseSlider";
import { Course_Slider } from "../components/catalog/Course_Slider";
import { CourseCard } from "../components/catalog/CourseCard";
import { ErrorPage } from "./ErrorPage";
import { Footer } from "../components/common/Footer";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getCatalogPage } from "../services/operations/categoryApi";
import { categories } from "../services/apiEndPoints";
import { apiConnector } from "../services/apiConnector";
const { CATEGORIES_API } = categories;

export const Catalog = () => {
  const { catalogName } = useParams(); // extract catalogName from pathurl
  const [catalogPageData, setCatalogPageData] = useState(null);
  const [active, setActive] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const { loading } = useSelector((state) => state.profile);

  //extract category id in first render of the catalog component,i.e: when user enter a catalog
  useEffect(() => {
    const getCategory = async () => {
      //   make an api call to fetch categories
      const res = await apiConnector("GET", CATEGORIES_API);
      //   console.log(res.data);

      //    fetch category id and also split and join it with required notations
      const category_Id = res?.data?.filter(
        (category) =>
          category.name.split(" ").join("-").toLowerCase() === catalogName
      )[0]._id;

      //   console.log(category_Id);
      setCategoryId(category_Id);
    };

    //  call getCategory function
    getCategory();
  }, [catalogName]);

  //    now at first render of the catalog page, fetch the catalog page
  useEffect(() => {
    const getCatalogData = async () => {
      try {
        const res = await getCatalogPage(categoryId);
        // console.log(res);
        setCatalogPageData(res);
      } catch (err) {
        // console.log(err);
      }
    };

    //  check if category id came or not . if exist then fetch catalog page
    if (categoryId) {
      getCatalogData();
    }
  }, [categoryId]);

  //    show spinner when loading
  if (loading || !catalogPageData?.success) {
    return (
      <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
        <div className="spinner"></div>
      </div>
    );
  }
  if (!loading && !catalogPageData) {
    return <ErrorPage />;
  }

  return (
    <>
      {/* Hero Section */}
      <div className=" box-content bg-richblack-800 px-4">
        <div className="mx-auto flex min-h-[260px] max-w-maxContentTab flex-col justify-center gap-4 lg:max-w-maxContent ">
          <p className="text-sm text-richblack-300">
            {`Home / Catalog / `}
            <span className="text-yellow-25">
              {catalogPageData?.data?.selectedCategory?.name}
            </span>
          </p>
          <p className="text-3xl text-richblack-5">
            {catalogPageData?.data?.selectedCategory?.name}
          </p>
          <p className="max-w-[870px] text-richblack-200">
            {catalogPageData?.data?.selectedCategory?.description}
          </p>
        </div>
      </div>

      {/* Section 1 -- get started with the course */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">Courses to get you started</div>
        <div className="my-4 flex border-b border-b-richblack-600 text-sm">
          {/*  show a labe, by which user can see popular and new courses  */}
          <p
            className={`px-4 py-2 ${
              active === 1
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(1)}
          >
            Most Populer
          </p>
          <p
            className={`px-4 py-2 ${
              active === 2
                ? "border-b border-b-yellow-25 text-yellow-25"
                : "text-richblack-50"
            } cursor-pointer`}
            onClick={() => setActive(2)}
          >
            New
          </p>
        </div>
        <div>
          {/*  show a course slider */}
          <CourseSlider
            Courses={catalogPageData?.data?.selectedCategory?.courses}
          />
        </div>
      </div>

      {/* Section 2 -- top courses */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-4 py-12 lg:max-w-maxContent">
        <div className="section_heading">
          Top courses in {catalogPageData?.data?.differentCategory?.name}
        </div>
        <div className="py-8">
          {/*  course slider component */}
          <Course_Slider
            Courses={catalogPageData?.data?.differentCategory?.courses}
          />
        </div>
      </div>

      {/* Section 3 */}
      <div className=" mx-auto box-content w-full max-w-maxContentTab px-2 py-12 lg:max-w-maxContent">
        <div className="section_heading">Frequently Bought</div>
        <div className="py-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {catalogPageData?.data?.mostSellingCourses
              ?.slice(0, 4)
              .map((course, index) => (
                //  render a course card so that we can show a course details
                <CourseCard
                  course={course}
                  key={index}
                  Height={"h-[250px]"}
                  // Width={"w-[370px]"}
                />
              ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

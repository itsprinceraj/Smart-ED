const Tag = require("../models/category");
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

// create Category

exports.createCategory = async (req, res) => {
  try {
    // fetch data from req body

    const { name, description } = req.body;

    // check if data entered or not
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "Please enter Details",
      });
    }

    // if a category exist with same name , then refuse to create a new category
    const category = await Tag.findOne({ name });
    // console.log("printing category ", category);

    if (category) {
      res.status(500).json({
        status: false,
        message: `Only Unique category can be created ,${name} already exists`,
      });
    }
    // details are filled , now create entry in Db
    const CategoryDetails = await Tag.create({
      name: name,
      description: description,
    });
    // console.log(CategoryDetails);

    // send REsponse
    res.status(200).json({
      success: true,
      message: "Category Created Successfully",
      data: CategoryDetails,
    });
  } catch (err) {
    console.log("error while creating Category: ", err);
    res.status(501).json({
      success: false,
      message: "Unable to create Category",
    });
  }
};

//get all Categories

exports.showAllCategories = async (req, res) => {
  try {
    // create a db call to find all Categories
    // make sure that the data contain name and description

    const allCategories = await Tag.find({});

    //Send response
    res.status(200).json({
      success: true,
      message: "All Categories fetched Successfully",
      data: allCategories,
    });
  } catch (err) {
    console.log("error while fetching Category: ", err);
    res.status(501).json({
      success: false,
      message: "Unable to fetch Categories",
    });
  }
};

//category page details

exports.categoryPageDetails = async (req, res) => {
  try {
    const { categoryId } = req.body;
    // console.log("PRINTING CATEGORY ID: ", categoryId);
    // Get courses for the specified category
    const selectedCategory = await Tag.findById(categoryId)
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: "ratingAndReviews",
      })
      .exec();

    //console.log("SELECTED COURSE", selectedCategory)
    // Handle the case when the category is not found
    if (!selectedCategory) {
      console.log("Category not found.");
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }
    // Handle the case when there are no courses
    if (selectedCategory.courses.length === 0) {
      console.log("No courses found for the selected category.");
      return res.status(200).json({
        success: false,
        message: "No courses found for the selected category.",
      });
    }

    // Get courses for other categories
    const categoriesExceptSelected = await Tag.find({
      _id: { $ne: categoryId },
    });
    let differentCategory = await Tag.findOne(
      categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
        ._id
    )
      .populate({
        path: "courses",
        match: { status: "Published" },
      })
      .exec();
    //console.log("Different COURSE", differentCategory)
    // Get top-selling courses across all categories
    const allCategories = await Tag.find()
      .populate({
        path: "courses",
        match: { status: "Published" },
        populate: {
          path: "instructor",
        },
      })
      .exec();
    const allCourses = allCategories.flatMap((category) => category.courses);
    const mostSellingCourses = allCourses
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 10);
    // console.log("mostSellingCourses COURSE", mostSellingCourses)
    res.status(200).json({
      success: true,
      message: "Catalog fetched successfully",
      data: {
        selectedCategory,
        differentCategory,
        mostSellingCourses,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

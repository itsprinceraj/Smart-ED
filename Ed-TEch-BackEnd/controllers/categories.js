const Category = require("../models/category");

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

    // details are filled , now create entry in Db
    const CategoryDetails = await Category.create({
      name: name,
      description: description,
    });
    console.log(CategoryDetails);

    // send REsponse
    res.status(200).json({
      success: true,
      message: "Category Created Successfully",
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

    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );

    //Send response
    res.status(200).json({
      success: true,
      message: "All Categories fetched Successfully",
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
    // get category id
    const { categoryId } = req.body;

    // get courses for specified category
    const selectedCategory = await Category.findById(categoryId)
      .populate("courses")
      .exec();

    // check if no seleted categories found
    if (!selectedCategory) {
      return res.status(409).json({
        success: false,
        message: "no categories found",
      });
    }

    // get courses for different categories
    const differentCategories = await Category.findById({
      _id: { $ne: categoryId },
    })
      .populate("courses")
      .exec();

    res.status(200).json({
      success: true,
      message: "categoris fetched",
      data: {
        selectedCategory,
        differentCategories,
      },
    });

    // TODO : get Top selling Courses
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "something went wrong while fetching category page Details",
    });
  }
};

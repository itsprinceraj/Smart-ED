const User = require("../models/user");

//  addCourseToCart function
exports.addCourseToCart = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;

    // get courseId
    const { courseId } = req.body;

    // get user
    const user = await User.findById(userId);
    // console.log("userData", user);

    const itemExistInCart = user.cart.includes(courseId);
    console.log("item in cart:", itemExistInCart);

    //  check if course already into the cart
    if (itemExistInCart) {
      return res.status().json({
        success: false,
        message: "Course already exist in your Cart!",
      });
    }

    //  push the courseId into the cart
    const updatedData = await User.findOneAndUpdate(
      { _id: userId },
      { $push: { cart: courseId } },
      { new: true }
    )
      .populate("cart")
      .exec();

    console.log("added to cart", updatedData);

    //  send success flag true in response
    res.status(200).json({
      success: true,
      message: "Course added to Cart!",
      data: updatedData,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

//  remove course from cart
exports.removeCourseFromCart = async (req, res) => {
  try {
    // get user id
    const userId = req.user.id;

    //  get courseid
    const { courseId } = req.body;

    //  get user
    const user = await User.findById(userId);

    // remove the course from the cart
    const updatedData = await User.findOneAndUpdate(
      { _id: userId },
      { $pull: { cart: courseId } },
      { new: true }
    );

    //  return success flag response
    res.status(200).json({
      success: true,
      message: "Course removed from cart",
      data: updatedData,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

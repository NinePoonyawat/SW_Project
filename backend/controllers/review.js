const Review = require("../models/Review");
const Rental = require("../models/Rental");

//@desc     Get all reviews
//@route    GET /api/v1/reviews
//@access   Public
exports.getReviews = async (req, res, next) => {
  let query;

  //General users can see only their rentals!
  if (req.user.role !== "admin") {
    query = Review.find({ user: req.user.id }).populate({
      path: "rental",
      select: "rentalCar createdAt",
    });
  } else {
    //If you are an admin, you can see all!
    if (req.params.rentalId) {
      query = Rental.find(req.params.rentalId).populate({
        path: "rental",
        select: "rentalCar createdAt",
      });
    } else {
      query = Rental.find().populate({
        path: "rentalCar",
        select: "carBrand model color licensePlate",
      });
    }
  }

  try {
    const reviews = await query;

    res.status(200).json({
      success: true,
      count: review.length,
      data: reviews,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot find Review" });
  }
};

//@desc     Get single review
//@route    GET /api/v1/recview/:id
//@access   Public
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id).populate({
      path: "rentalCar",
      select: "carBrand model color licensePlate",
    });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No rental with the id of ${req.params.id}`,
      });
    }

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "cannot find Review" });
  }
};

//@desc     Add review
//@route    POST /api/v1/rentalCars/:reviewId/review
//@access   Private
exports.addReview = async (req, res, next) => {
  try {
    req.body.rental = req.params.rentalId;

    const rental = await Rental.findById(req.params.rentalId);

    if (!rental) {
      return res.status(404).json({
        success: false,
        message: `No rental with the id of ${req.params.rentalId}`,
      });
    }

    //add user Id to req.body
    req.body.user = req.user.id;

    //Check for existed rental
    const existedReview = await Reciew.find({ user: req.user.id });

    //If the user is not an admin, they can only one rental
    if (existedReview.length >= 1 && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `The user with id ${req.user.id} has already made rental`,
      });
    }

    const review = await Review.create(req.body);

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot create Review" });
  }
};

//@desc     Update review
//@route    PUT /api/v1/reviews/:id
//@access   Private
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Reciew.findById(req.params.id);
    console.log(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the review owner
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update this review`,
      });
    }

    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot update Review" });
  }
};

//@desc     Delete review
//@roue     DELETE /api/v1/reviews/:id
//@access   Private
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: `No review with the id of ${req.params.id}`,
      });
    }

    //Make sure user is the review owner
    if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(404).json({
        success: false,
        message: `User ${req.params.reviewId} is not authorized to delete this bootcamp`,
      });
    }
    await review.deleteOne();

    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Cannot delete Review" });
  }
};

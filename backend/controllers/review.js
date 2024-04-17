const Review = require("../models/Review");
const Rental = require("../models/Rental");
const RentalCar = require("../models/RentalCar");

// @desc    Get all reviews
// @route   GET /reviews
// @access  Protected
exports.getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find();
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Get single review
// @route   GET /reviews/:id
// @access  Protected
exports.getReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: "No review found" });
    }
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Add a review
// @route   POST /reviews
// @access  Protected, Authorized (admin, user)
exports.addReview = async (req, res, next) => {
  const { rentalCar, reviewText, score } = req.body;
  const userId = req.user.id; // Assuming req.user is populated from the authentication middleware

  try {
    // Check if user has rented this car
    const rental = await Rental.findOne({
      user: userId,
      rentalCar: rentalCar,
    });

    if (!rental) {
      return res.status(403).json({
        success: false,
        error: "User has not rented this car, cannot add review.",
      });
    }

    // Check if a review already exists for this rental
    const existingReview = await Review.findOne({
      rental: rental._id, // assuming you link the review to the rental entry
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        error: "Review already exists for this rental.",
      });
    }

    // Create the review
    const review = await Review.create({
      rentalCar,
      user: userId,
      reviewText,
      score,
      rental: rental._id, // linking the review directly to the rental
    });

    res.status(201).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message,
    });
  }
};

// @desc    Update review
// @route   PUT /reviews/:id
// @access  Protected, Authorized (admin, user)
exports.updateReview = async (req, res, next) => {
  try {
    let review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: "No review found" });
    }
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({
      success: true,
      data: review,
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// @desc    Delete review
// @route   DELETE /reviews/:id
// @access  Protected, Authorized (admin, user)
exports.deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, error: "No review found" });
    }
    await review.deleteOne({ _id: req.params.id });
    res.status(200).json({
      success: true,
      data: {},
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

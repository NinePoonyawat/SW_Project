const Review = require("../models/Review");
const Rental = require("../models/Rental");
const RentalCar = require("../models/RentalCar");
//@desc     Get all reviews
//@route    GET /api/v1/reviews
//@access   Public
// exports.getReviews = async (req, res, next) => {
//   let query;

//   //General users can see only their rentals!
//   if (req.user.role !== "admin") {
//     query = Review.find({ user: req.user.id }).populate({
//       path: "rental",
//       select: "rentalCar createdAt",
//     });
//   } else {
//     //If you are an admin, you can see all!
//     if (req.params.rentalId) {
//       query = Rental.find(req.params.rentalId).populate({
//         path: "rental",
//         select: "rentalCar createdAt",
//       });
//     } else {
//       query = Rental.find().populate({
//         path: "rentalCar",
//         select: "carBrand model color licensePlate",
//       });
//     }
//   }

//   try {
//     const reviews = await query;

//     res.status(200).json({
//       success: true,
//       count: review.length,
//       data: reviews,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Cannot find Review" });
//   }
// };

// //@desc     Get single review
// //@route    GET /api/v1/recview/:id
// //@access   Public
// exports.getReview = async (req, res, next) => {
//   try {
//     const review = await Review.findById(req.params.id).populate({
//       path: "rentalCar",
//       select: "carBrand model color licensePlate",
//     });

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: `No rental with the id of ${req.params.id}`,
//       });
//     }

//     res.status(200).json({
//       success: true,
//       data: review,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "cannot find Review" });
//   }
// };

// //@desc     Add review
// //@route    POST /api/v1/rentalCars/:reviewId/review
// //@access   Private
// exports.addReview = async (req, res, next) => {
//   try {
//     req.body.rental = req.params.rentalId;

//     const rental = await Rental.findById(req.params.rentalId);

//     if (!rental) {
//       return res.status(404).json({
//         success: false,
//         message: `No rental with the id of ${req.params.rentalId}`,
//       });
//     }

//     //add user Id to req.body
//     req.body.user = req.user.id;

//     //Check for existed rental
//     const existedReview = await Reciew.find({ user: req.user.id });

//     //If the user is not an admin, they can only one rental
//     if (existedReview.length >= 1 && req.user.role !== "admin") {
//       return res.status(404).json({
//         success: false,
//         message: `The user with id ${req.user.id} has already made rental`,
//       });
//     }

//     const review = await Review.create(req.body);

//     res.status(200).json({
//       success: true,
//       data: review,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Cannot create Review" });
//   }
// };

// //@desc     Update review
// //@route    PUT /api/v1/reviews/:id
// //@access   Private
// exports.updateReview = async (req, res, next) => {
//   try {
//     let review = await Reciew.findById(req.params.id);
//     console.log(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: `No review with the id of ${req.params.id}`,
//       });
//     }

//     //Make sure user is the review owner
//     if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
//       return res.status(401).json({
//         success: false,
//         message: `User ${req.user.id} is not authorized to update this review`,
//       });
//     }

//     review = await Review.findByIdAndUpdate(req.params.id, req.body, {
//       new: true,
//       runValidators: true,
//     });

//     res.status(200).json({
//       success: true,
//       data: review,
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Cannot update Review" });
//   }
// };

// //@desc     Delete review
// //@roue     DELETE /api/v1/reviews/:id
// //@access   Private
// exports.deleteReview = async (req, res, next) => {
//   try {
//     const review = await Review.findById(req.params.id);

//     if (!review) {
//       return res.status(404).json({
//         success: false,
//         message: `No review with the id of ${req.params.id}`,
//       });
//     }

//     //Make sure user is the review owner
//     if (review.user.toString() !== req.user.id && req.user.role !== "admin") {
//       return res.status(404).json({
//         success: false,
//         message: `User ${req.params.reviewId} is not authorized to delete this bootcamp`,
//       });
//     }
//     await review.deleteOne();

//     res.status(200).json({
//       success: true,
//       data: {},
//     });
//   } catch (error) {
//     console.log(error);
//     return res
//       .status(500)
//       .json({ success: false, message: "Cannot delete Review" });
//   }
// };

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

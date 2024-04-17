const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  rentalCar: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "RentalCar",
    required: true,
  },
  reviewText: {
    type: String,
    required: [true, "Please provide a review text."],
  },
  score: {
    type: Number,
    min: 0,
    max: 5,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);

const mongoose = require("mongoose");

const ReviewSchema = new mongoose.Schema({
  appointment: {
    type: mongoose.Schema.ObjectId,
    ref: "Appointment",
    required: true,
  },
  reviewText: {
    type: String,
    required: true,
  },
  score: {
    type: Number,
    Range: [0, 5],
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Review", ReviewSchema);

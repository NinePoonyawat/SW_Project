const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema({
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  rentalCar: {
    type: mongoose.Schema.ObjectId,
    ref: "RentalCar",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Rental", RentalSchema);

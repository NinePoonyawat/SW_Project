const mongoose = require("mongoose");

const RentalSchema = new mongoose.Schema(
  {
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
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//Reserve populate with virtuals
RentalSchema.virtual("review", {
  ref: "review",
  localField: "_id",
  foreignField: "appointment",
  justOne: true,
});

//Cascade delete rentals when a rental is deleted
RentalSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`review being removed from rental ${this._id}`);
    await this.model("Review").deleteMany({ appointment: this._id });
    next();
  }
);

module.exports = mongoose.model("Rental", RentalSchema);

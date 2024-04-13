const mongoose = require("mongoose");

const AppointmentSchema = new mongoose.Schema(
  {
    apptDate: {
      type: Date,
      required: true,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    hospital: {
      type: mongoose.Schema.ObjectId,
      ref: "Hospital",
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
AppointmentSchema.virtual("review", {
  ref: "review",
  localField: "_id",
  foreignField: "appointment",
  justOne: true,
});

//Cascade delete rentals when a hospital is deleted
AppointmentSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`review being removed from appointment ${this._id}`);
    await this.model("Review").deleteMany({ appointment: this._id });
    next();
  }
);

module.exports = mongoose.model("Appointment", AppointmentSchema);

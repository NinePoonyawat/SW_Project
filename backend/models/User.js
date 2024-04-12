const mongoose = require("mongoose");
const bcryst = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    require: [true, "Please add a name"],
  },
  telephone_number: {
    type: String,
    require: [true, "Please add telephone number"],
    match: [/^\d{10}$/, /^\+\d{1,3}\s\d{3}\s\d{3}\s\d{4}$/],
  },
  email: {
    type: String,
    require: [true, "Please add an email"],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please add a valid email",
    ],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  password: {
    type: String,
    require: [true, "Please add a password"],
    minlength: 6,
    select: false,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

//Encrypt password using bcrypt
UserSchema.pre("save", async function (next) {
  const salt = await bcryst.genSalt(10);
  this.password = await bcryst.hash(this.password, salt);
});

//Sign JWT and return
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });
};

//Match user entered password to hashed password in database
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcryst.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);

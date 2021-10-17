const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: function (v) {
        return validator.isEmail(v);
      },
      message: "Please enter a valid email address",
    },
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    validate: {
      validator: function (v) {
        return v.length >= 8;
      },
      message: "Password must be longer than 8 characters",
    },
  },
  addressFirst: {
    type: String,
    // required: [true, "Street address is required"],
  },
  addressSecond: String,
  city: {
    type: String,
    // required: [true, "City is required"],
  },
  region: {
    type: String,
    // required: [true, "Region is required"],
  },
  country: {
    type: String,
    // required: [true, "Country is required"],
  },
  postcode: String,
  phone: String,
  userType: String,
  bio: String,
  ratings: [Number],
  imageId: String,
});

module.exports = mongoose.model("User", userSchema);

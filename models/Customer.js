const mongoose = require("mongoose");
const validator = require("validator");

// Note - requirements have been temporarily disabled for this stage of development
const customerSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  firstName: {
    type: String,
    // required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    // required: [true, "Last name is required"],
  },
  email: {
    type: String,
    // required: [true, "Email is required"],
    // validate: {
    //   validator: function (v) {
    //     return validator.isEmail(v);
    //   },
    //   message: "Please enter a valid email address",
    // },
  },
  password: {
    type: String,
    // required: [true, "Password is required"],
    // validate: {
    //   validator: function (v) {
    //     return v.length >= 8;
    //   },
    //   message: "Password must be longer than 8 characters",
    // },
  },
  confirmPassword: {
    type: String,
    // required: [true, "Please confirm your password"],
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
  postcode: String,
  phone: String,
});
customerSchema.virtual("id").get(function () {
  return this._id.toString();
});

module.exports = mongoose.model("Customer", customerSchema);

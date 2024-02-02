const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fname: {
    type: String,
    required: [true, "Please enter the first name"],
  },
  lname: {
    type: String,
    required: [true, "Please enter the last name"],
  },
  userName: {
    type: String,
    required: [true, "Please enter the username"],
    unique: true,
  },
  email: {
    type: String,
    required: [true, "Please enter the email"],
  },
  phoneNum: {
    type: String,
    required: [true, "Please enter the phone number"],
  },
  password: {
    type: String,
    required: [true, "Please enter the password"],
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  accountLocked: {
    type: Boolean,
    default: false,
  },
  lastFailedLoginAttempt: {
    type: Date,
    default: null,
  },
  resetPasswordToken: {
    type: String,
    default: null,
  },
  resetPasswordExpires: {
    type: Date,
    default: null,
  },
  passwordHistory: [
    {
      type: String,
      required: true,
    },
  ],
});

module.exports = mongoose.model("User", userSchema);

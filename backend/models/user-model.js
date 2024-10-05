const mongoose = require("mongoose");

// USER SCHEMA
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "User should always has a user name."],
  },
  email: {
    type: String,
    required: [True, "Email is needed for the user."],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [True, "Password is mandatory"],
  },
  confirmPassword: {
    type: String,
    required: [True, "Confirm Password"],
  },
});

const userModel = mongoose.model("User", UserSchema);

module.exports = userModel;

const mongoose = require("./main");

const userSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Password: String,
  DOB: String,
  streak: Number,
  lastLogin: String
});

module.exports = mongoose.model("User", userSchema);
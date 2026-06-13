const mongoose = require("./main1");

const contactSchema = new mongoose.Schema({
  Name: String,
  Email: String,
  Username: String,
  Comment: String
});

module.exports = mongoose.model("Contact", contactSchema);
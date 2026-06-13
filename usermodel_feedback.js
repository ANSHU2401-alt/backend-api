const mongoose = require("./main2");

const contactSchema = new mongoose.Schema({
  Feedback: String
});

module.exports = mongoose.model("Feedback", contactSchema);
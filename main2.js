const mongoose = require("mongoose");

const contactMongoose = new mongoose.Mongoose();

contactMongoose.connect(
  "mongodb+srv://anshucengage020306:Anshu123456@cluster0.quugfej.mongodb.net/Feedback"
)
.then(() => console.log("Feedback DB Connected"))
.catch(err => console.log(err));

module.exports = contactMongoose;
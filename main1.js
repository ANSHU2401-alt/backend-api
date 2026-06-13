const mongoose = require("mongoose");

const contactMongoose = new mongoose.Mongoose();

contactMongoose.connect(
  "mongodb+srv://anshucengage020306:Anshu123456@cluster0.quugfej.mongodb.net/Queries"
)
.then(() => console.log("Queries DB Connected"))
.catch(err => console.log(err));

module.exports = contactMongoose;
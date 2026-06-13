const mongoose = require("mongoose");

const userMongoose = new mongoose.Mongoose();

userMongoose.connect(
  "mongodb+srv://anshucengage020306:Anshu123456@cluster0.quugfej.mongodb.net/Users"
)
.then(() => console.log("Users DB Connected"))
.catch(err => console.log(err));

module.exports = userMongoose;
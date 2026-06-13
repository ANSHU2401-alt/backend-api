const express = require('express');
const app = express();

const cors = require("cors");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");

const userModel = require('./userModel.js');
const userModel_contact = require('./usermodel_contact.js');
const userModel_feedback = require('./usermodel_feedback.js');

const saltRounds = 10;
const PORT = process.env.PORT || 3000;
app.use(cors({
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    res.send('Hello World!')
  } else {
    try {
      const data = jwt.verify(token, "secretkey123");
      return res.redirect(`/${data.name}`);
    } catch (err) {
      return res.send("Session expired, login again");
    }
  }
});

app.post("/Contact", async (req, res) => {

  const user = await userModel.findOne({
    Name: req.body.Username,
    Email: req.body.Email
  });

  if (!user) {
    return res.render("notcontactuser.ejs");
  }

  await userModel_contact.create({
    Name: req.body.Name,
    Email: req.body.Email,
    Username: req.body.Username,
    Comment: req.body.Comment
  });

  res.render("query_donw.ejs");
});

app.post("/create", async (req, res) => {

  const [year] = req.body.DOB.split("-").map(Number);

  if (year < 1900 || year > new Date().getFullYear()) {
    return res.render("dobwrong.ejs");
  }

  if (req.body.Password != req.body.ConfirmPassword) {
    return res.send(`Write again`);
  }

  const salt = await bcrypt.genSalt(saltRounds);
  const hash = await bcrypt.hash(req.body.Password, salt);

  let user_Email = await userModel.findOne({ Email: req.body.Email });

  if (user_Email) {
    return res.send("Person already exists");
  }

  await userModel.create({
    Name: req.body.Name,
    Email: req.body.Email,
    Password: hash,
    DOB: req.body.DOB
  });

  res.render('signed_successfull.ejs');
});

app.post("/payment-log", (req, res) => {
  console.log("Payment initiated:", req.body);
  res.send("ok");
});

app.post("/login", async (req, res) => {

  let user = await userModel.findOne({ Name: req.body.Name });

  if (!user) {
    return res.json({ success: false });
  }

  let isMatch = await bcrypt.compare(req.body.Password, user.Password);

  if (!isMatch) {
    return res.json({ success: false });
  }

  const token = jwt.sign(
    { id: user._id, name: user.Name },
    "secretkey123",
    { expiresIn: "1d" }
  );

  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000,
    path: "/"
  });

  return res.json({
    success: true,
    username: user.Name
  });
});

app.get("/checklogin", (req, res) => {

  const token = req.cookies.token;

  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {
    const data = jwt.verify(token, "secretkey123");

    return res.json({
      loggedIn: true,
      username: data.name,
      id: data.id
    });

  } catch (err) {
    return res.json({ loggedIn: false });
  }
});

app.post("/feedback", async (req, res) => {

  await userModel.create({
    Feedback: req.body.Feedback
  });

  res.render('feedback.ejs');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
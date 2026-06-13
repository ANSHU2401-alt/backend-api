const express=require('express');
const app=express();
const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://iitiansbro-seven.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server running on port", port)
})
app.use(express.static("public"));
const userModel=require('./userModel.js')
const userModel_contact=require('./usermodel_contact.js')
const userModel_feedback=require('./usermodel_feedback.js')
const jwt = require("jsonwebtoken");
var validateDate = require("validate-date");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  const token = req.cookies.token;

  if(!token){
    res.send('Hello World!')
  }
  else{
    try {
    const data = jwt.verify(token, "secretkey123");
    return res.redirect(`/${data.name}`);
  } catch (err) {
    return res.send("Session expired, login again");
  }
  }
})
app.post("/Contact", async (req, res) => {

  const user = await userModel.findOne({
    Name: req.body.Username,
    Email: req.body.Email
  });

  if (!user) {
    return res.render(
      "notcontactuser"
    );
  }

  await userModel_contact.create({
  Name: req.body.Name,
  Email: req.body.Email,
  Username: req.body.Username,
  Comment: req.body.comment || req.body.Comment
});

  res.render("query_donw")
});

app.post("/create",async (req,res)=>{
const [year, month, day] = req.body.DOB.split("-").map(Number);

if (
    year < 1900 ||
    year > new Date().getFullYear()
) {
    return res.render("dobwrong");
}
    else{
        if(req.body.Password!=req.body.ConfirmPassword){
        res.send(`Write again`)
    }
    else{
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.Password, salt);
    let user_Email = await userModel.findOne(
        { Email: req.body.Email },
    );
    let user_name = await userModel.findOne(
        { Name: req.body.Name },
    );
    if (user_Email) {
        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-black text-white flex items-center justify-center h-screen space-x-2">
      <h1 class="text-4xl md:text-3xl font-bold">Person already exists </h1>
      <div class="bg-emerald-400 hover:bg-emerald-500 px-2 py-2 rounded-md"><a href="https://backend-api-p3b2.onrender.com/login" class="text-3xl md:text-xl">Go back</a></div>
    </body>
    </html>
  `);
}
    else if (user_name) {
        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-black text-white flex items-center justify-center h-screen space-x-2">
      <h1 class="text-4xl md:text-3xl font-bold">Person already exists </h1>
      <div class="bg-emerald-400 hover:bg-emerald-500 px-2 py-2 rounded-md"><a href="https://backend-api-p3b2.onrender.com/login" class="text-3xl md:text-xl">Go back</a></div>
    </body>
    </html>
  `);
}
    else{
    let v=await userModel.create({
    Name:req.body.Name,
    Email:req.body.Email,
    Password: hash,
    DOB:req.body.DOB
    })
        res.render('signed_successfull')
    }
}
    }
})

app.post("/payment-log", (req, res) => {
  console.log("Payment initiated:", req.body);
  res.send("ok");
});

app.post("/login", async (req, res) => {
  console.log("LOGIN REQUEST BODY:", req.body);

  let name = req.body.Name;
  let password = req.body.Password;

  let user = await userModel.findOne({ Name: name });

  if (!user) {
    return res.json({ success: false });
  }

  let isMatch = await bcrypt.compare(password, user.Password);

  if (!isMatch) {
    return res.json({ success: false });
  }

  const today = new Date().toDateString();

  if (!user.streak) user.streak = 0;

  if (user.lastLogin !== today) {
    user.streak += 1;
    user.lastLogin = today;
  }

  await user.save(); 

  const token = jwt.sign(
    {
      id: user._id,
      name: user.Name
    },
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
    username: user.Name,
    streak: user.streak   
  });
});
const express=require('express');
const app=express();
const cors = require("cors");
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://iitiansbro-seven.vercel.app"
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type"]
}));
const bcrypt = require('bcrypt');
const saltRounds = 10;
const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log("Server running on port", port)
})
app.use(express.static("public"));
const userModel=require('./userModel.js')
const userModel_contact=require('./usermodel_contact.js')
const userModel_feedback=require('./usermodel_feedback.js')
const jwt = require("jsonwebtoken");
var validateDate = require("validate-date");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set("view engine", "ejs");

app.get('/', (req, res) => {
  const token = req.cookies.token;

  if(!token){
    res.send('Hello World!')
  }
  else{
    try {
    const data = jwt.verify(token, "secretkey123");
    return res.redirect(`/${data.name}`);
  } catch (err) {
    return res.send("Session expired, login again");
  }
  }
})
app.post("/Contact", async (req, res) => {

  const user = await userModel.findOne({
    Name: req.body.Username,
    Email: req.body.Email
  });

  if (!user) {
    return res.render(
      "notcontactuser"
    );
  }

  await userModel_contact.create({
  Name: req.body.Name,
  Email: req.body.Email,
  Username: req.body.Username,
  Comment: req.body.comment || req.body.Comment
});

  res.render("query_donw")
});

app.post("/create",async (req,res)=>{
const [year, month, day] = req.body.DOB.split("-").map(Number);

if (
    year < 1900 ||
    year > new Date().getFullYear()
) {
    return res.render("dobwrong");
}
    else{
        if(req.body.Password!=req.body.ConfirmPassword){
        res.send(`Write again`)
    }
    else{
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(req.body.Password, salt);
    let user_Email = await userModel.findOne(
        { Email: req.body.Email },
    );
    let user_name = await userModel.findOne(
        { Name: req.body.Name },
    );
    if (user_Email) {
        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-black text-white flex items-center justify-center h-screen space-x-2">
      <h1 class="text-4xl md:text-3xl font-bold">Person already exists </h1>
      <div class="bg-emerald-400 hover:bg-emerald-500 px-2 py-2 rounded-md"><a href="https://backend-api-p3b2.onrender.com/login" class="text-3xl md:text-xl">Go back</a></div>
    </body>
    </html>
  `);
}
    else if (user_name) {
        res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.tailwindcss.com"></script>
    </head>
    <body class="bg-black text-white flex items-center justify-center h-screen space-x-2">
      <h1 class="text-4xl md:text-3xl font-bold">Person already exists </h1>
      <div class="bg-emerald-400 hover:bg-emerald-500 px-2 py-2 rounded-md"><a href="https://backend-api-p3b2.onrender.com/login" class="text-3xl md:text-xl">Go back</a></div>
    </body>
    </html>
  `);
}
    else{
    let v=await userModel.create({
    Name:req.body.Name,
    Email:req.body.Email,
    Password: hash,
    DOB:req.body.DOB
    })
        res.render('signed_successfull')
    }
}
    }
})

app.post("/payment-log", (req, res) => {
  console.log("Payment initiated:", req.body);
  res.send("ok");
});

app.post("/login", async (req, res) => {
  console.log("LOGIN REQUEST BODY:", req.body);

  let name = req.body.Name;
  let password = req.body.Password;

  let user = await userModel.findOne({ Name: name });

  if (!user) {
    return res.json({ success: false });
  }

  let isMatch = await bcrypt.compare(password, user.Password);

  if (!isMatch) {
    return res.json({ success: false });
  }

  const today = new Date().toDateString();

  if (!user.streak) user.streak = 0;

  if (user.lastLogin !== today) {
    user.streak += 1;
    user.lastLogin = today;
  }

  await user.save(); 

  const token = jwt.sign(
    {
      id: user._id,
      name: user.Name
    },
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
    username: user.Name,
    streak: user.streak   
  });
});
app.get("/checklogin", (req, res) => {

  console.log("CHECKLOGIN HIT");

  const token = req.cookies.token;

  console.log("TOKEN:", token);

  if (!token) {
    return res.json({ loggedIn: false });
  }

  try {

    const data = jwt.verify(token, "secretkey123");

    console.log("DECODED:", data);

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
  await userModel_feedback.create({
    Feedback: req.body.Feedback
  });

  res.render('feedback')
});

app.post("/feedback", async (req, res) => {
  await userModel_feedback.create({
    Feedback: req.body.Feedback
  });

  res.render('feedback')
});

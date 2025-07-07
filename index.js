const express = require("express");
const jwt = require("jsonwebtoken");
const { userRouter } = require("./routes/user");
const { courseRouter } = require("./routes/course");
const { adminRouter } = require("./routes/admin");
const mongoose = require("mongoose");

const app = express();
const port = 3000;

// allows Express app to read and understand JSON data sent in the body of HTTP requests.
app.use(express.json());
// allows Express app to read data sent from HTML form ie(application/x-www-form-urlencoded)
app.use(express.urlencoded({ extended: true }));

// auth middleware
const auth = (req, res, next) => {};

app.use("/user",userRouter);
app.use("/admin",adminRouter);
app.use("/course",courseRouter);

const start = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://pradipcohort:mD0Fwov7Mc8tcJ3b@cluster0.kyuou9t.mongodb.net/course-selling-app"
    );
    console.log("Connected to MongoDB");
    app.listen(port, () =>
      console.log(`Server is listening to the port ${port}`)
    );
  } catch (err) {
    console.log("Error connecting to MongoDB : ", err);
  }
};

start();

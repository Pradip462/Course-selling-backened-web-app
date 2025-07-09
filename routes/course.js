const { Router } = require("express");
const mongoose = require("mongoose");
const courseRouter = Router();
const { UserModel , CourseModel, PurchaseModel } = require("../db");
const { authUserMiddleware } = require("../Middlewares/authUser");

// when purchasing the inputs
courseRouter.post("/purchase", authUserMiddleware, async (req, res) => {
  const userId = req.userId;
  const courseId = req.body.courseId;

  // Should Check that the user actually paid the price or not then allow 

  try {
    const sameUser = await UserModel.findOne({
      userId,
    });

    if (sameUser) {
      res.status(403).json({
        msg: "You have already bought this course",
      });
    }

    await PurchaseModel.create({
      userId,
      courseId,
    });

    res.status(200).json({
      msg: "You have successfully bought the course",
    });
  } catch (err) {
    console.log(`Error during buying Course in /course route : ${err}`);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// all the available courses
courseRouter.get("/preview", async (req, res) => {
  // no need of authentication any one can see all the courses
  try {
    const course = await CourseModel.find({});
    return res.status(200).json({
      msg: "These are all courses",
      course,
    });
  } catch (err) {
    console.log(`Error during getting all the  Course Details : ${err}`);
    return res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = {
  courseRouter,
};

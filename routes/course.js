const { Router } = require("express");
const mongoose = require("mongoose");
const courseRouter = Router();
const { CourseModel } = require("../db");


// when purchasing the inputs
courseRouter.post("/purchase",async (req,res) => {});

// all the available courses
courseRouter.get("/preview", async (req, res) => {});

module.exports = {
    courseRouter
}
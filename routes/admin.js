const { Router } = require("express");
const adminRouter = Router();
const { AdminModel } = require("../db");
const mongoose = require("mongoose")

adminRouter.post("/signup",(req,res) => {

})

adminRouter.post("/signin",(req,res) => {

})

// admin can create a course
adminRouter.post("/course",(req,res) => {

})

// change the course features like name,pricing
adminRouter.put("/course",(req,res) => {

})

// get all the course
adminRouter.put("/course/all",(req,res) => {

})


module.exports = {
    adminRouter
}
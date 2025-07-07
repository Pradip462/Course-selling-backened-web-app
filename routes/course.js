const { Router } = require("express");

const courseRouter = Router();


// when purchasing the inputs
courseRouter.post("/purchase",async (req,res) => {});

// all the available courses
courseRouter.get("/preview", async (req, res) => {});

module.exports = {
    courseRouter
}
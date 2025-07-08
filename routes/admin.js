const { Router } = require("express");
const adminRouter = Router();
const { AdminModel } = require("../db");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const z = require("zod");
require("dotenv").config();

const JWT_SECRET = process.env.ADMIN_JWT_SECRET_KEY;

// Admin Auth
const adminAuth = async () => {};

adminRouter.post("/signup", async (req, res) => {
  const zodBody = z.object({
    firstName: z
      .string()
      .min(3, { message: "First Name should minimun of 3 length" })
      .max(50, { message: "First Name Should maximum of 50 length" }),
    lastName: z
      .string()
      .min(3, { message: "Last Name should minimun of 3 length" })
      .max(50, { message: "Last Name Should maximum of 50 length" }),
    email: z
      .string()
      .min(3, { message: "Email should minimun of 3 length" })
      .max(50, { message: "Email Should maximum of 50 length" })
      .email("The input should be email"),
    password: z
      .string()
      .min(8, { message: "Password should minimun of 8 length" })
      .max(30, { message: "Password Should maximum of 50 length" })
      .refine((val) => /[A-Z]/.test(val), {
        message: "Password must contain one Uppercase",
      })
      .refine((val) => /[a-z]/.test(val), {
        message: "Password must contain one Lowercase",
      })
      .refine((val) => /[0-9]/.test(val), {
        message: "Password must contain one Number",
      })
      .refine((val) => /[!@#$%^&*]/.test(val), {
        message: "Password must contain one Special Character",
      }),
  });

  const parsedDataWithSuccess = zodBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.status().json({
      msg: "Incorrect Input Pattern",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const { firstName, lastName, email, password } = req.body;

  const existAdmin = await AdminModel.findOne({
    email: email,
  });

  if (existAdmin) {
    res.status(403).
      json({
        msg: "Admin Already exists in the database",
      });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    await AdminModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });

    res.status(200).json({
      msg: "Successfully Signed Up",
    });
  } catch (err) {
    console.log(`Error occuring during Signup : ${err}`);
    res.status(500).json({
      msg: "Internal Server Error during SignUp",
    });
  }
});

adminRouter.post("/signin", (req, res) => {});

// admin can create a course
adminRouter.post("/course", (req, res) => {});

// change the course features like name,pricing
adminRouter.put("/course", (req, res) => {});

// get all the course
adminRouter.put("/course/all", (req, res) => {});

module.exports = {
  adminRouter,
};

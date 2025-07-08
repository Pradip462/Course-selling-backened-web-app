const { Router } = require("express");
const { UserModel, CourseModel } = require("../db");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const z = require("zod");
const bcrypt = require("bcrypt");
require("dotenv").config();
const { safeParse } = require("zod/v4-mini");

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// auth middleware
const auth = async (req, res, next) => {
  try {
  const token = req.headers.authorization;
  if(!token){
    return res.status(401).json({ msg: "No token provided" });
  }
  const tokenToVerify = jwt.verify(token, JWT_SECRET);

  
    const user = await UserModel.findOne({
      _id: tokenToVerify.userId,
    });

    if (!user) {
      res.status(403).json({
        msg: "Incorrect Credentials",
      });
      return;
    }
    req.user = user;
    next();
  } catch (err) {
    console.log(`Error in the auth Middleware : ${err}`);
    res.status(401).json({
      msg: "Unauthorized: " + err.message,
    });
  }
};

// signup
userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
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
      })
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if (!parsedDataWithSuccess.success) {
    res.json({
      msg: "Incorrect Pattern in input",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const { firstName , lastName , email , password } = req.body;

  try {
    const user = await UserModel.findOne({
      email: email,
    });

    if (user) {
      res.status(403).json({
        msg: "User already exists in Database",
      });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await UserModel.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: hashedPassword,
    });
    res.json({
      msg: "Signed Up Successfully",
    });
  } catch (e) {
    console.log(`Error during Signed Up : ${e}`);
    res.status(500).json({
      msg: "Internal Sever Error",
    });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const requiredBody = z.object({
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
  }).strict();

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    res.status(403).json({
      msg: "Incorrect Pattern in input",
      error: parsedDataWithSuccess.error,
    });
    return;
  }


  const { email , password } = req.body;

  // now we have to extract the hashed password form the database
  const user = await UserModel.findOne({ email });

  if (!user) {
    res.status(403).json({
      msg: "Incorrect Email",
    });
  }

  const hashedPassword = user.password;

  const isCorrect = await bcrypt.compare(password, hashedPassword);

  if (!isCorrect) {
    res.status(403).json({
      msg: "Incorrect Password",
    });
    return;
  }

  // when user enters both correct email and password
  // now we need to generate token
  const token = jwt.sign({ userId : user._id }, JWT_SECRET);

  res.json({
    msg: "Successfully Logged In",
    token: token,
  });
});

// my purchased course
userRouter.get("/purchased-course",auth, async (req, res) => {
  res.json(req.user);
});

module.exports = {
  userRouter,
};

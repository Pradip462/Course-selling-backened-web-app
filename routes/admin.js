const { Router } = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const z = require("zod");
const adminRouter = Router();
require("dotenv").config();

const { JWT_ADMIN_SECRET } = require("../config");
const { AdminModel, CourseModel } = require("../db");
const { authAdminMiddleware } = require("../Middlewares/authAdmin");
const { check } = require("zod/v4");

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
    res.status(403).json({
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

adminRouter.post("/login", async (req, res) => {
  const requiredBody = z
    .object({
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
    })
    .strict();

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);
  if (!parsedDataWithSuccess.success) {
    res.status(403).json({
      msg: "Incorrect Pattern in input",
      error: parsedDataWithSuccess.error,
    });
    return;
  }

  const { email, password } = req.body;

  try {
    // now we have to extract the hashed password form the database
    const admin = await AdminModel.findOne({ email });

    if (!admin) {
      res.status(403).json({
        msg: "Incorrect Email",
      });
    }

    const hashedPassword = admin.password;

    const isCorrect = await bcrypt.compare(password, hashedPassword);

    if (!isCorrect) {
      res.status(403).json({
        msg: "Incorrect Password",
      });
      return;
    }

    // when admin enters both correct email and password
    // now we need to generate token
    const token = jwt.sign({ adminId: admin._id }, JWT_ADMIN_SECRET);

    res.json({
      msg: "Successfully Logged In",
      token: token,
    });
  } catch (err) {
    console.log(`Error in the admin login route : ${err}`);
    res.status(500).json({
      msg: "Internal Server Error during admin login",
    });
  }
});

// admin can create a course
adminRouter.post("/course", authAdminMiddleware, async (req, res) => {
  const { title, description, price, imageUrl } = req.body;

  try {
    const course = await CourseModel.create({
      title: title,
      description: description,
      price: price,
      imageUrl: imageUrl,
      createrId: req.admin._id,
    });
    res.status(200).json({
      msg: "Course Created",
      createrId: course.createrId,
    });
  } catch (err) {
    console.log(`Error during creating course by admin : ${err}`);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// change or Edit the course features like name,pricing
adminRouter.put("/course", authAdminMiddleware, async (req, res) => {
  //this below is from authAdminMiddleware
  const adminId = req.adminId;
  const { courseId, title, description, price, imageUrl } = req.body;
  try {
    //check does this courseId belongs to this admin

    const checkCourse = await CourseModel.findOne({
      _id: courseId,
      createrId: adminId,
    });

    if (!checkCourse) {
      res.status(403).json({
        msg: "This is not your course you can not update this course",
      });
      return;
    }

    const course = await CourseModel.updateOne(
      {
        _id: courseId,
        createrId: adminId,
      },
      {
        $set: {
          title,
          description,
          price,
          imageUrl,
        },
      }
    );

    res.status(200).json({
      msg:"Course Updated"
    })
  } catch (err) {
    console.log(`Error during changing the course details : ${err}`);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

// get all the course
adminRouter.get("/course/all", authAdminMiddleware, async (req, res) => {
  //this below is from authAdminMiddleware
  const adminId = req.adminId;
  try {
    const courses = await CourseModel.find({ createrId : adminId });
    res.status(200).json(courses);
  } catch (err) {
    console.log(`Error during changing the course details : ${err}`);
    res.status(500).json({
      msg: "Internal Server Error",
    });
  }
});

module.exports = {
  adminRouter,
};

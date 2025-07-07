const { Router } = require("express");
const { UserModel, CourseModel } = require("../db");
const userRouter = Router();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const z = require("zod");


const JWT_SECRET = "iloveeeeeyouuuuu";

// signup
userRouter.post("/signup", async (req, res) => {
  const requiredBody = z.object({
    name: z
      .string()
      .min(3, { message: "Name should minimun of 3 length" })
      .max(50, { message: "Name Should maximum of 50 length" }),
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
    role: z
      .enum(["Student", "Instructer", "Admin"], {
        errorMap:() => ({
            message: "Role must be student, instructor, or admin",
        }),
      }),
  });

  const parsedDataWithSuccess = requiredBody.safeParse(req.body);

  if(!parsedDataWithSuccess){
    res.json({
        msg:"Incorrect Credentials",
        error:parsedDataWithSuccess.error
    })
    return;
  }

  const name = req.body.name;
  const email = req.body.email;
  const password = req.body.password;
  const role = req.body.role;

try{
  const user = await UserModel.findOne({
    email:email
  })

  if(user){
    res.status(403).json({
        msg:"User already exists in Database"
    })
    return;
  }

  await UserModel.create({
    name:name,
    email:email,
    password:password,
    role:role
  })
  res.json({
    msg:"Signed Up Successfully"
  })
}catch(e){
    console.log(`Error during Signed Up : ${e}`);
    res.status(500).json({
        msg:"Internal Sever Error"
    })
}
  
});

// login
userRouter.post("/login", async (req, res) => {});


// my purchased course
userRouter.get("/purchased-course", async (req, res) => {});


module.exports = {
    userRouter
}
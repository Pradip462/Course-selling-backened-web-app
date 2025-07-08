const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");

const JWT_SECRET = process.env.USER_JWT_SECRET_KEY;


// auth middleware
const authUserMiddleware = async (req, res, next) => {
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


module.exports = {
    authUserMiddleware
}

const jwt = require("jsonwebtoken");
const { UserModel } = require("../db");

const { JWT_USER_SECRET } = require("../config");

// auth middleware
const authUserMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }
    const tokenToVerify = jwt.verify(token, JWT_USER_SECRET);

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
    req.userId = user._id;
    next();
  } catch (err) {
    console.log(`Error in the auth Middleware : ${err}`);
    res.status(401).json({
      msg: "Unauthorized: " + err.message,
    });
  }
};

module.exports = {
  authUserMiddleware,
};

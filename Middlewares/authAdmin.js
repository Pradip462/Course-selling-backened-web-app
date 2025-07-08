const jwt = require("jsonwebtoken");
const { AdminModel } = require("../db");

const { JWT_ADMIN_SECRET } = require("../config");


// auth middleware
const authAdminMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      return res.status(401).json({ msg: "No token provided" });
    }
    const tokenToVerify = jwt.verify(token, JWT_ADMIN_SECRET);

    const admin = await AdminModel.findOne({
      _id: tokenToVerify.adminId,
    });

    if (!admin) {
      res.status(403).json({
        msg: "Incorrect Credentials",
      });
      return;
    }
    req.admin = admin;
    next();
  } catch (err) {
    console.log(`Error in the admin auth Middleware : ${err}`);
    res.status(401).json({
      msg: "Unauthorized: " + err.message,
    });
  }
};

module.exports = {
  authAdminMiddleware,
};

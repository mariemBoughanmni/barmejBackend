const jwt = require("jsonwebtoken");
const UserModel = require("../models/User");
const config = process.env;

exports.authorize = async (req, res, next) => {
  let token = req.headers["x-access-token"] || req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7, token.length);
  }
  if (!token) {
    if (roles.length === 0 || roles.includes("no token")) {
      return next();
    }
    res.status(401).json({ message: "you are not authorized to do this!" });
  }
  try {
    const data = jwt.verify(token, process.env.TOKEN_PASSWORD);
    if (data) {
      const user = await UserModel.findOne({ _id: data._id }).lean();
      req.user = user;
    } else throw new Error("invalid token");

    next();
  } catch (error) {
    res.status(401).json({ message: error.message });
  }
};

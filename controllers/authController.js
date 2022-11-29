const bcrypt = require("bcrypt");
const { sign } = require("jsonwebtoken");
const UserModel = require("../models/User");
const Login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (!user) throw new Error("User not found");
    if(!user.verified) throw new Error("User not verified");
    let checkPassword = await bcrypt.compare(password, user.password);
    if (!checkPassword) throw new Error("Invalid password");
    const token = await generateAuthToken(user);
    delete user.password;
    res.status(200).json({ user, token });
  } catch (error) {
    res.status(401).json({ message: "user not verified" });
  }
};
const generateAuthToken = (user) => {
    console.log(process.env.TOKEN_PASSWORD)
  const token = sign({ _id: user._id }, process.env.TOKEN_PASSWORD, {
    expiresIn: "7d",
  });
  return token;
};

module.exports = {
  Login,
};

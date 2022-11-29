var express = require("express");
const { Login } = require("../controllers/authController");
const { Register, profile, getAllUsers, verifyAccount, editProfile, filterUsers, forgetPassword, changePasswordWhenForgot, searchPartner} = require("../controllers/userController");
const { authorize } = require("../middlewares/auth");
var router = express.Router();

router.post("/login", Login);
router.post("/register", Register);
router.get("/profile", authorize, profile);
router.get("/getAllUsers", getAllUsers);
router.get("/verifyAccount/:email", verifyAccount)
router.put("/updateMyInfos/:id", editProfile)
router.post("/forgetPassword", forgetPassword);
router.post("/changePasswordWhenForgot", changePasswordWhenForgot);
router.get("/searchPartner", searchPartner);
router.post("/filterUsers", filterUsers)

module.exports = router;

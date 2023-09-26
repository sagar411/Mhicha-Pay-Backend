const express = require("express");
const userRoute = express.Router();
const UserController = require("../api/Controller/user.controller");
const letLogoinCheck = require("../api/middleware/login.middleware");
const user_ctrl = new UserController();

userRoute.route("/signup")
    .post(user_ctrl.userCreate);

userRoute.route("/verify_email")
    .post(user_ctrl.verifyEmail);
userRoute.route("/findOtp")
    .post(user_ctrl.otpVerifyByEmai);
userRoute.route("/login")
    .post(user_ctrl.userLogin)

userRoute.route("/me/:id")
    .get(letLogoinCheck,user_ctrl.findMe);
userRoute.route("/receiver/:email")
    .get(letLogoinCheck,user_ctrl.findReciver);
userRoute.route("/update-profile")
    .put(letLogoinCheck,user_ctrl.updateUser);

module.exports = userRoute;
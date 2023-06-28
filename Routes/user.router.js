const express = require("express");
const userRoute = express.Router();
const UserController = require("../api/Controller/user.controller")
const user_ctrl = new UserController();

userRoute.route("/signup")
    .post(user_ctrl.userCreate);

userRoute.route("/verify_email")
    .post(user_ctrl.verifyEmail);

userRoute.route("/login")
    .post(user_ctrl.userLogin)

userRoute.route("/:id")
    .get()
    .post()
    .delete()

module.exports = userRoute;
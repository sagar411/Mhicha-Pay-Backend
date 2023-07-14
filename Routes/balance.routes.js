const express = require("express");
const balanceRouter = express.Router();
const letLogoinCheck = require("../api/middleware/login.middleware");



balanceRouter.route("/find")
    .get(letLogoinCheck,(req,res,next)=>{
        res.json("hello world");
    });

module.exports = balanceRouter;

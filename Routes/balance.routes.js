const express = require("express");
const balanceRouter = express.Router();
const letLogoinCheck = require("../api/middleware/login.middleware");
const BalanceController = require("../api/Controller/balance.controller");
const balance_Ctrl = new BalanceController();


balanceRouter.route("/sendmoney")
    .get(letLogoinCheck,(req,res,next)=>{
        res.json("hello world");
    })
    .post(letLogoinCheck, balance_Ctrl.sendMoney);

module.exports = balanceRouter;

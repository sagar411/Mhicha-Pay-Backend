const express = require("express");
const transactonRouter = express.Router();
const TransactionController = require("../api/Controller/transaction.controller");
const letLogoinCheck = require("../api/middleware/login.middleware");
const trans_ctrl = new TransactionController();


transactonRouter.route("/list/:id")
    .get(letLogoinCheck, trans_ctrl.fetchAllTransaction);


module.exports = transactonRouter;
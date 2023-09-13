const express = require("express");
const BalanceController = require("../api/Controller/balance.controller");
const savingRoutes = express.Router();
const balance_ctrl = new BalanceController();

savingRoutes.route("/saving")
    .post(balance_ctrl.saveMoney)
    .get();

module.exports = savingRoutes;
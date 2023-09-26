const express = require("express");
const BalanceController = require("../api/Controller/balance.controller");
const letLogoinCheck = require("../api/middleware/login.middleware");
const savingRoutes = express.Router();
const balance_ctrl = new BalanceController();

savingRoutes.route("/saving")
    .post(letLogoinCheck,balance_ctrl.saveMoney)
    .get(letLogoinCheck, balance_ctrl.fetchSavingDetailes);

module.exports = savingRoutes;
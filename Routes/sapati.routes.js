const express = require("express");
const BalanceController = require("../api/Controller/balance.controller");
const letLogoinCheck = require("../api/middleware/login.middleware");
const { isAdmin } = require("../api/middleware/rbac.middleware");
const sapatiRouter = express.Router();
const balance_ctrl = new BalanceController();

sapatiRouter.route("/request")
    .post(letLogoinCheck, balance_ctrl.sapati);

sapatiRouter.route("/getlist")
    .get(letLogoinCheck,isAdmin,balance_ctrl.sapatiRequestList)

sapatiRouter.route("/approve/:id")
    .post(letLogoinCheck,isAdmin,balance_ctrl.approveSapati);
sapatiRouter.route("/sapatilistuser")
    .get(letLogoinCheck,balance_ctrl.getSapatiList);
sapatiRouter.route("/returnsapati/:id")
    .post(letLogoinCheck, balance_ctrl.returnSapati);



module.exports = sapatiRouter;


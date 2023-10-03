const express = require("express");
const app = express();
const user_router = require("./user.router");
const balance_router = require("./balance.routes");
const saving_router = require("./saving.routes");
const tranasction_router = require("./transactions");
const sapati_router = require("./sapati.routes")

app.use("/user", user_router);
app.use("/balance",balance_router);
app.use(saving_router);
app.use("/sapati",sapati_router);
app.use("/tranasctions",tranasction_router);



module.exports =app;
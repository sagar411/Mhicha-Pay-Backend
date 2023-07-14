const express = require("express");
const app = express();
const user_router = require("./user.router")
const balance_router = require("./balance.routes")

app.use("/user", user_router);
app.use("/balance",balance_router);


module.exports =app;
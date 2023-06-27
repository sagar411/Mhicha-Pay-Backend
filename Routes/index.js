const express = require("express");
const app = express();
const user_router = require("./user.router")


app.use("/user", user_router);

module.exports =app;
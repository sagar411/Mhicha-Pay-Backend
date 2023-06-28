const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("./constant");
const generateToken = (payload)=>{
    let token = jwt.sign(payload,JWT_SECRET);
    return token;
}
module.exports = {generateToken};


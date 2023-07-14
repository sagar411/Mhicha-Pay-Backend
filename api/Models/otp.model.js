const mongoose = require("mongoose");

const OtpSchemaDef = new mongoose.Schema({
    email:{
        type:String
    },
    otp:{
        type: String,
    },
    type:{
        type: String
    },
    createdAt:{
        type: Date,
        default: Date.now
    },
})
OtpSchemaDef.index({createdAt:1},{expireAfterSeconds:60});

const  OtpModel =  mongoose.model("OTP", OtpSchemaDef);
module.exports = OtpModel;

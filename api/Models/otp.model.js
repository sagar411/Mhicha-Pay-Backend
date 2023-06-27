const mongoose = require("mongoose");

const OtpSchemaDef = new mongoose.Schema({
    email:{
        type:String
    },
    otp:{
        type: Number,
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

const  OtpModel = new mongoose.model("OTP", OtpSchemaDef);
module.exports = OtpModel;
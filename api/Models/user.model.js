const mongoose = require("mongoose");
const UserSchemadef = new mongoose.Schema({
    name: {
        type: String,
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type: String
    },
    role:{
        type: String,
        enum:["admin","user"],
        default: "user"
    },
    saving:{
        type:Number,
        default:0.0
    },
    sapati:{
        type:Number,
        default:0.0
    },
    kyc:{
        type:Boolean,
        default: false
    },
    balance: {
        type:Number,
        default:500.0
    },
    image:{
        type: String
    }, 
    address: {
        type: String
    },
    mpin:{
        type:String
    }


},{
    timestamps: true,
    autoCreate:true,
    autoIndex:true
})

const UserModel = mongoose.model("User", UserSchemadef)
module.exports = UserModel;
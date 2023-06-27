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
    kyc:{
        type:Boolean,
        default: false
    },
    balance: {
        type:Number,
        default:500
    },
    image:{
        type: String
    }, 
    address: {
        type: String
    }


},{
    timestamps: true,
    autoCreate:true,
    autoIndex:true
})

const UserModel = mongoose.model("User", UserSchemadef)
module.exports = UserModel;

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
        default:0.1
    },
    sapati:{
        type:Number,
        default:0.1
    },
    twofactor:{
        type:Boolean,
        default: false
    },
    balance: {
        type:Number,
        default: 500.1,
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
UserSchemadef.pre("save", function (next) {
    // Ensure that balance is stored as a double with two decimal places
    this.balance = parseFloat(this.balance).toFixed(2);
    next();
});

const UserModel = mongoose.model("User", UserSchemadef)
module.exports = UserModel;
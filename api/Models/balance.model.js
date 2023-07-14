const mongoose = require("mongoose");

const balanceSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    transactorName:{
        type:String
    },
    transactorEmail:{
        type:String,
    },
    amount:{
        type:Number,
    },
    requestedAt:{
        type:Date,
    },
    createdAt:{
        type:Date,
    },
    status:{
        type:Boolean,
        default:false,
    },
    
    remarks:{
        type:String,
    },
    purpose:{
        type:String,
    },
    cashFlow:{
        type:String,
        required:true,
    }
});

const BalanceModel = mongoose.model("Balance",balanceSchema);
module.exports = BalanceModel;
const mongoose = require("mongoose");
const savingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    savingamount:{
        type:Number
    },
    purpose:{
        type: String
    },
    createdAt:{
        type:Date,
    },
    paid:{
        type:Boolean,
        default:false
    },
    interestRate: {
        type: Number,
        default: 0.0 // Default to 0% interest
    },
    activity:{
        type:String
        
    }
    
});

const SavingModel = mongoose.model("Saving",savingSchema);
module.exports = SavingModel;
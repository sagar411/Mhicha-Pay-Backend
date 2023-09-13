const mongoose = require("mongoose");
const savingSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    amount:{
        type:Number
    }
})
const mongoose = require("mongoose");


const sapatiSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    userName:{
        type:String,
        
    },
    sapatiAmount:{
        type:Number,
        
        
    },
    purpose:{
        type:String
    },
    charge:{
        type:Number,
        default:5.01
    },
    approvedByAdmin:{
        type:Boolean,
        default:false
    },
    paid:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,

    },
    
    activity:{
        type:String
    }
});

const SapatiModel = mongoose.model("Sapati",sapatiSchema);
module.exports = SapatiModel;
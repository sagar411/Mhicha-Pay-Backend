const OtpModel = require("../Models/otp.model");
class OtpService {
    findOtpByEmailId =async (email,type,otp)=>{
        
        
        try{
            return await OtpModel.find({
                "email":email, 
                "type":type,
                "otp":otp
            },);

        }catch(err){
            throw err;
        }

    }
    saveOtp = (email, otp,type)=>{

        try{
            let otpSave = new OtpModel({
                email: email,
                type:type,
                otp:otp
            });
            return otpSave.save();
            
        }catch(err){
            throw err;
        }
        
    }


}
module.exports = OtpService;
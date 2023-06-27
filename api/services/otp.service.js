const OtpModel = require("../Models/otp.model");
class OtpService {
    saveOtp = (email, value,otp)=>{
        try{
            let otpSave = new OtpModel({
                email: email,
                value:value,
                otp:otp
            });
            return otpSave.save();
            
        }catch(err){
            throw err;
        }
        
    }


}
module.exports = OtpService;
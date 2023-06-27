const {userCreateSchema,emailValidationSchema} = require("../validators/user.schema");
const createError = require("http-errors");
const UserService = require("../services/user.service");
const user_service= new UserService();
const {generateOtp} = require("../Config/otp");
const {userVerifyMail} = require("../Config/mail");
const OtpService = require("../services/otp.service");
const otp_svc = new OtpService();

class UserController {
    verifyEmail = async(req,res,next)=>{
        
        
        const otp = generateOtp();
        const taskName = "verifyemail"
        
        try{
            const {error ,value}= await emailValidationSchema.validate(req.body);
            
            const doesExist =await user_service.userFindByEmail(value.email);
            if(doesExist){
                throw createError.Conflict("User Already exist!");
            }else if(error){
                throw error;
            }else{
                
                userVerifyMail(value.email, taskName,otp);
                let response =await otp_svc.saveOtp(otp,taskName,);
                res.send(response);
            }
            
        }catch(err){
            console.log(err);
            next(err);
        }
    }
    userCreate = async(req,res,next)=>{
        
        try{
            const {error,value}= await userCreateSchema.validate(req.body);
            // console.log(value.email);
            const doesExist =await user_service.userFindByEmail(value.email);
            // console.log(doesExist);
            
            if(doesExist){ 
               throw createError.Conflict("User Already exist!");
            }            
            else if(error){
                // console.log(error.message);
                throw error;
            }else{
               let response = await user_service.userRegister(value);
                res.send(response);
            }

        }catch(err){
            // console.log(err);
            next(err);
        }
    }
    
    
}
module.exports = UserController;
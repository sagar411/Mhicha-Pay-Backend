const {userCreateSchema,emailValidationSchema,userloginValidation} = require("../validators/user.schema");
const createError = require("http-errors");
const UserService = require("../services/user.service");
const user_service= new UserService();
const {generateOtp} = require("../Config/otp");
const {userVerifyMail} = require("../Config/mail");
const OtpService = require("../services/otp.service");
const otp_svc = new OtpService();
const logger = require("../Config/logger");
const AuthService = require("../services/auth.service");
const { generateToken } = require("../Config/jwt");
const auth_svc = new AuthService();


class UserController {
    verifyEmail = async(req,res,next)=>{
        
        logger.http("POST /user/verify_email");
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
                logger.info("Email Verified")
            }
            
        }catch(err){
            logger.err(err);
            next(err);
        }
    }

    userCreate = async(req,res,next)=>{
        console.log("hello !!")
        logger.http("POST /user/signup");
        
        try{
            const {error,value}= await userCreateSchema.validate(req.body);
            // const doesExist =await user_service.userFindByEmail(value.email);
            
                    
            if(error){
                throw error;
            }else{
               let user = await user_service.userRegister(value);
               let token = generateToken({
                id:user._id,
                        name: user.name,
                        email:user.email,
                        role:user.role
               })
               let response = {
                user,token
               }
            res.send(response);
            }

        }catch(err){
            next(err);
            logger.error(err);
        }
    }
    userLogin =async(req,res,next)=>{
        logger.http("POST /user/login")
       
            try{
                const {error,value} = emailValidationSchema.validate(req.body);
                console.log(value.email,value.password);
                if(error){
                    throw  error
                }else{
                    const user =await auth_svc.loginService(value.email, value.password);
                    res.send(
                        user
                    );

                }

                

            }catch(err){
                logger.error(err);
                next(err);
            }
            
            
    


    }
    
    
}
module.exports = UserController;
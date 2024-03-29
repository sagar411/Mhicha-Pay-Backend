const {userCreateSchema,emailValidationSchema,userloginValidation, passwordUpdateValidation} = require("../validators/user.schema");
const createError = require("http-errors");
const UserService = require("../services/user.service");
const user_service= new UserService();
const {generateOtp} = require("../Config/otp");
const {userVerifyMail, passwordChangeMail} = require("../Config/mail");
const OtpService = require("../services/otp.service");
const otp_svc = new OtpService();
const logger = require("../Config/logger");
const AuthService = require("../services/auth.service");
const { generateToken } = require("../Config/jwt");
const UserModel = require("../Models/user.model");
const auth_svc = new AuthService();
const bcrypt = require("bcrypt");

class UserController {
    findReciver = async (req,res,next)=>{
        logger.http('GET /users/reciver/email');
        const email  = req.params.email;
        let receiver = await  auth_svc.findReceiverByEmail(email);
        const currentUser = req.auth_user;
        try{
            if(!receiver || receiver == null){
                next({
                    status:400,
                    message: "Invalid email"
                });
            }else if( receiver.email== currentUser.email ){
                next({
                    status:400,
                    message:"Self-transfer is not allowed!"
                });
            }else{
                
                res.send(receiver);
            }

        }catch(error){
            next(error);
        }
        if(!receiver|| receiver ==null){
            

        }
        // console.log(receiver.name);

    }
    findMe =async(req,res,next)=>{
        logger.http('GET /users/me');
        const id = req.params.id;
        let me = await auth_svc.findMEbyId(id);
        me = {
            _id: me._id,
            name:me.name,
            email: me.email,
            role:me.role,
            twofactor:me.twofactor,
            balance:me.balance,
            sapati:me.sapati,
            saving: me.saving,
            mpin:me.mpin
        }
        res.send(me);
    };
    otpVerifyByEmai = async(req,res,next)=> {
        logger.http("POST /user/findOtp");
        try{
            const type = "verifyemail";
            const email = req.body.email;
            const otp = req.body.otp;

                let response = await otp_svc.findOtpByEmailId(email,type,otp);
                
               
                if(response.length > 0){
                    res.send({
                        message:"Otp verified!!",
                        status:true
                    });
                }else{
                    
                    throw createError.NotFound("otp not found");
                }
            

        }catch(error){
            next(error);
        }

    }
    verifyEmail = async(req,res,next)=>{
        console.log("hello");
        logger.http("POST /user/verify_email");
        try{
            const {error ,value}= await emailValidationSchema.validate(req.body);
            const doesExist =await user_service.userFindByEmail(value.email);
            const otp = generateOtp();
        console.log(otp);
        const taskName = "verifyemail";
            if(doesExist){
                throw createError.Conflict("User Already exist!");
                 
            }else if(error){
                throw error;
            }else{
                
                console.log("email",value.email);
                console.log("otp",otp);
                console.log("taskna")
                userVerifyMail(value.email, taskName,otp);
                let response =await otp_svc.saveOtp(value.email, otp, taskName);
                res.send(response);
                logger.info("Email Verified")
            }
            
        }catch(err){
            logger.error(err);
            next(err);
        }
    }

    userCreate = async(req,res,next)=>{
        
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
                const {error,value} = userloginValidation.validate(req.body);
                console.log(value.email,value.password);
                if(error){
                    next(error);
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
    updateUser = async(req,res,next)=>{
        logger.http("PUT /user/update")
        try{
            let data = req.body;
            const {error,value}= await userCreateSchema.validate(req.body);
            const userid = req.auth_user;

            if(error){
                next(error);

            }else{
                let response = await user_service.userUpdate(data, userid);

                if(response){
                    res.send(
                        {
                            result:response
                        }
                    )

                }else{
                    next({
                        status:400,
                        msg:"Sorry there was problem in update"
                    })
                }

            }
            

            


        }catch(err){
            next(
                err
            );
        }

    }
    resetPasswordRequest = async(req,res,next)=>{
        logger.http("POST /request-passwrod-verify")
        const requestemail = req.body.email;

        try{
            if(requestemail==null ){
                next({
                    status:401,
                    message:"Enter the email"
                })
            }else{
            const requestedUser = await UserModel.findOne({email:requestemail});
            if(requestedUser){
                const otp = generateOtp();
                console.log(requestemail)
                 passwordChangeMail(requestemail,"PasswordChange",otp);
                 await otp_svc.saveOtp(requestemail,otp,"PasswordChange").then(res.send(
                    {
                        message:"Otp Sent",
                        stats:true
                    }
                 ),
                 );


            }else{
                next({status:500,message:"User NOt found"});
            }

            }
            

        }catch(error){
            next(error);
        }

    }
    otpVerifyByEmail = async(req,res,next)=> {
        logger.http("POST /user/findOtp");
        try{
            const type = "PasswordChange";
            const email = req.body.email;
            const otp = req.body.otp;
            

                let response = await otp_svc.findOtpByEmailId(email,type,otp);
                
               
                if(response.length > 0){
                    res.send({
                        message:"Otp verified!!",
                        status:true
                    });
                }else{
                    
                    throw createError.NotFound("otp not found");
                }
            

        }catch(error){
            next(error);
        }

    }
    changePassword = async(req,res,next)=>{
        const {error,value}= passwordUpdateValidation.validate(req.body); 
        const email = req.params.email;
        try{
            const user = await UserModel.find({email:email});
            if(error){
                throw error;
            }else {
                const hashPw = await bcrypt.hash( value.password,10);
                console.log(value.password);
                console.log(hashPw);
                user[0].password =hashPw;

                user[0].save().then((value)=>{
                    res.send({message:"Successfully Updated",stauts:true});
                }).catch((error)=>{
                    console.log(error);
                    throw error;
                });
                
            }

        }catch(error){
            next(error);
        }


    }
    updateTwoFactorState = async(req,res,next)=>{
        const user = req.auth_user;
        const twofactorState = user.twofactor;
        const newstate = !twofactorState;
        await UserModel.findOneAndUpdate(user._id,{twofactor:newstate}).then((value)=>{
            console.log(value)
            res.send({message:"DONE"});
        }).catch((error)=>{next(error)});
        

    }




    

    
    
    
}
module.exports = UserController;
const jwt = require("jsonwebtoken");
const {JWT_SECRET} = require("../Config/constant");
const createError = require("http-errors");
const UserService = require("../services/user.service");
let user_svc = new UserService();
const letLogoinCheck = async(req,res,next)=>{
    let token = null;

    if(req.headers["authorization"]){
        token = req.headers.authorization;
    }else if(req.headers["x-xsrf-token"]){
        token = req.headers["x-xsrf-token"];
    }else if(req.query["token"]){
        token = req.query["token"];
    }

    if(!token){
        const error = createError.Unauthorized("unauthorized");
        next(
            error
        )
    }else{
        token = token.split(" ");
        token = token[token.length -1];

        if(!token){
            next({
                status:401,
                message:"token not found"
            })
        }else{
            let data = jwt.verify(token, JWT_SECRET);
            if(!data || data ==null){
                next({
                    status:401,
                    message:"unknown data"
                })
            }else{
                try{
                    let user = await user_svc.getUserById(data.id);
                    if(user){
                        req.auth_user = user;
                        next();
                    }else{
                        next({
                            status:400,
                            message:"Invalid Token data"
                        })
                    }
                    
                }catch(err){
                    next({
                        status:400,
                        message:err
                    })

                }
            }
        }
    }
}

module.exports = letLogoinCheck;
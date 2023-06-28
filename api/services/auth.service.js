const UserModel = require("../Models/user.model");
const bcrypt = require('bcrypt');
const {generateToken} = require("../Config/jwt");

const createError = require("http-errors");
class AuthService{
    loginService = async (email, password)=>{
        try{
        const user = await UserModel.findOne({email:email});
        if(!user){
            throw createError.NotFound("User Doesn't exist!");

        }else{
            const comparePassword = bcrypt.compareSync(password , user.password);
            if(comparePassword){
                let response = {
                    user:user,
                    token: generateToken({
                        id:user._id,
                        name: user.name,
                        email:user.email,
                        role:user.role
                    })
                }
                return response;
            }else{
                throw createError.Unauthorized("Wrong password")
            }
        }
    }catch(err){
        throw err;
    }

    }

}
module.exports = AuthService;
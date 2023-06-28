const bcrypt = require("bcrypt");
const UserModel = require("../Models/user.model");
const createError = require("http-errors")
const {EMAIL} = process.env;

class UserService{


    userFindByEmail = (data)=>{
        console.log("here i am");
        try{
            let users =  UserModel.findOne({email:data});
            if(users){
                return users;

            }else{
                throw createError.Conflict("User already Exist!")
            }
            // console.log(users);
            
        }catch(err){
            throw err;
        }
    }
    userRegister =(data)=>{
        try{
            console.log(data);
            data['password'] = bcrypt.hashSync(data['password'],10);
            console.log(data);
            let user = new UserModel(data);
            
            return user.save();
        }catch(err){
            throw err;
        }
    }
}
module.exports = UserService;
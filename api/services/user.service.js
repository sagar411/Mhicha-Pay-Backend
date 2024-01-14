const bcrypt = require("bcrypt");
const UserModel = require("../Models/user.model");
const createError = require("http-errors")
const {EMAIL} = process.env;

class UserService{
    getUserById = (user_id)=>{
        try{
            return UserModel.findById(user_id);

        }catch(error){
            throw error;
        }
    }

    userFindByEmail = (data)=>{
        
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

            let user = new UserModel({
                email: data.email,
                name: data.name,
                password:data.password,
                mpin: data.mpin
            });
            return user.save();
        }catch(err){
            throw err;
        }
    }
    userUpdate =(data,id)=>{
        return UserModel.findByIdAndUpdate(id,{
            $set:data
        })

    }
}
module.exports = UserService;
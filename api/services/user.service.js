const bcrypt = require("bcrypt");
const UserModel = require("../Models/user.model");
const {EMAIL} = process.env;

class UserService{


    userFindByEmail = (data)=>{
        console.log(EMAIL);
        // console.log("here i am");
        try{
            let users =  UserModel.findOne({email:data});
            // console.log(users);
            return users;
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
const logger = require("../Config/logger");
const BalanceModel = require("../Models/balance.model");
const UserModel = require("../Models/user.model");
const { sendAmountSchema } = require("../validators/balance.schema");
const {getTodayDate} = require("../Config/date");
class BalanceController {

    sendMoney = async(req,res,next)=> {
        logger.http("Post /balance/sendMoney");
        
        
        const currentUser = req.auth_user;
        // const {amount,email, remarks,purpose,mpin } = req.body;
        // console.log(email);

        try{
            const {error,value} = await sendAmountSchema.validate(req.body);
            const email  = value.email;
            const amount = value.amount;
            const remarks = value.remarks;
            const purpose = value.purpose;
            const mpin = value.mpin;
            const date =  getTodayDate();
            console.log("date",date);


            const reciver = await UserModel.findOne({email});

            if(!reciver || email == currentUser.email){
                next({
                    status:500,
                    message:"Invalid  email"
                })
            } else if(currentUser.balance<amount){
                next({
                    status:500,
                    message:"insufficiant balance!"
                })
            }else if(error){
                throw error;

            }else if(currentUser.mpin !=mpin){
                next({
                    status:500,
                    message:"wrong mpin"
                })
                

            }else{
                console.log("date");
                console.log(currentUser._id, reciver.name, reciver.email, amount, remarks, purpose, reciver._id, currentUser.name, currentUser.email);
                const sendBalance = new BalanceModel({
                    userId:currentUser._id,
                    transactorName:reciver.name,
                    transactorEmail:reciver.email,
                    amount,
                    remarks,
                    purpose,
                    status:true,
                    requestedAt:date,
                    createdAt:date,
                    cashFlow:"Out"

                });

                const reciverBalance = new BalanceModel({
                    userId:reciver._id,
                    transactorName:currentUser.name,
                    transactorEmail:currentUser.email,
                    amount,
                    remarks,
                    purpose,
                    status:true,
                    requestedAt:date,
                    createdAt:date,
                    cashFlow:"In"

                });
                reciver.balance +=amount;

                await Promise.all([
                    sendBalance.save(),
                    reciverBalance.save(),
                    reciver.save(),
                    UserModel.findByIdAndUpdate(
                        
                        currentUser._id,
                        {
                            balance:currentUser.balance -amount
                        }
                    )
                ]

                    
                );
                res.send({
                transactionId: sendBalance._id,
                reciver:reciver.name,
                reciverEmail:reciver.email,
                cashFlow:"Out",
                amount,
                remarks,
                purpose,
                date:sendBalance.createdAt
                }
                );
                
            }
        }catch(error){
            console.log(error);
            next(error);

        }
    }
    saveMoney = (req,res,next)=>{
        
    }
}
module.exports= BalanceController;
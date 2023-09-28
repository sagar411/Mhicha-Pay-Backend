const logger = require("../Config/logger");
const BalanceModel = require("../Models/balance.model");
const UserModel = require("../Models/user.model");
const { sendAmountSchema } = require("../validators/balance.schema");
const {getTodayDate} = require("../Config/date");
const { savingSchema } = require("../validators/saving.schema");
const SavingModel = require("../Models/saving.model");
const { ObjectId } = require('mongoose').Types;
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
    saveMoney = async(req,res,next)=>{
        logger.http("POST /saving");
        const currentUser = req.auth_user;

        try{
            const {error,value} = await savingSchema.validate(req.body);
            
            const savingamount = value.savingamount;
            const purpose = value.purpose;
            const date = getTodayDate();
            
            if(error){
                console.log(error);
                throw error;
            }else{
                if(currentUser.balance<savingamount){
                    console.log(currentUser.balance);
                next({
                    status:500,
                    message:"insufficiant balance to save"
                })

            }else{
                const saveBalance = new SavingModel({
                    userId:currentUser._id,
                    savingamount:savingamount,
                    purpose:purpose,
                    createdAt:date,
                    activity:"Saving"
                    
                });
                // currentUser.balance = currentUser.balance - savingamount;
                // currentUser.saving = currentUser.saving + savingamount;
                await Promise.all([
                    saveBalance.save(),
                    UserModel.findByIdAndUpdate(
                        currentUser._id,
                        {
                            balance:currentUser.balance -savingamount,
                            saving:currentUser.saving + savingamount
                        }

                    )

                ]);                
                
                res.send(
                    {
                        message:"Successfully saved",
                        savingamount:savingamount,
                        purpose:purpose,
                        date:date
                    }
                );
            }
        }
        }catch(error){
            console.log(error);
            next(error);
        }

        
    }
    fetchSavingDetailes   = async(req,res,next)=>{
        logger.http("GET /savings");
        const user = req.auth_user;
        const list = await SavingModel.find(
            {
                "userId": user
            }
        );
        console.log(list);
        if(list.length ===0){
            res.send(
                {
                    message:"No Saving found",
                    status:true
                }
            )
        }else{
            res.send(
                {
                    savingsList:list
                }
            )
        }
    }
    withdraw =async (req,res,next)=>{
         logger.http("POST /user/savewithdraw");
         const currentUser = req.auth_user;
         const savingId = req.params.id;
         console.log("Hello");
         console.log(savingId);
         

        try{
            // const {error,value} = await savingSchema.validate(req.body);
            // const withdrawAmount = value.withdrawAmount;
            const purpose = req.body.purpose;
            const date = getTodayDate();
            

          const result =  await SavingModel.find({ "userId": currentUser, "_id":savingId.toString() });
          console.log(result);
          const numberofdays =getTodayDate().diff(result[0].createdAt,'months');
          console.log(numberofdays);
          console.log(result[0].savingamount);
          if(!result[0].paid){
                 
               
                const saveBalance = new SavingModel({
                    userId:currentUser._id,
                    savingamount:result[0].savingamount,
                    purpose:purpose,
                    paid:true,
                    createdAt:date,
                    activity:"withdraw"
                });
                
                await Promise.all([
                    saveBalance.save(),
                    UserModel.findByIdAndUpdate(
                        currentUser._id,
                        {
                            saving:currentUser.saving - result[0].savingamount ,
                            balance:currentUser.balance +result[0].savingamount +((numberofdays+result[0].interestRate +result[0].savingamount) /100),
                        }

                    ),
                    SavingModel.findByIdAndUpdate(savingId,{
                        paid:true
                    })



                ]);                
                
                res.send(
                    {
                        message:"Successfully withdraw",
                        withdrawamount:result[0].savingamount,
                        purpose:purpose,
                        date:date
                        
                    }
                );
          }else{
            next({
                status:401,
                message:"Not found"
            })
          }
            

      
        }catch(error){
            console.log(error);
            next(error);
        }

    }
}
module.exports= BalanceController;
const logger = require("../Config/logger");
const BalanceModel = require("../Models/balance.model");
const UserModel = require("../Models/user.model");
const { sendAmountSchema } = require("../validators/balance.schema");
const {getTodayDate} = require("../Config/date");
const { savingSchema } = require("../validators/saving.schema");
const SavingModel = require("../Models/saving.model");
const { sapatiSchema } = require("../validators/sapati.schema");
const SapatiModel = require("../Models/sapati.model");
const { admin } = require("googleapis/build/src/apis/admin");
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
            next(
                {
                    message:"No Saving found",
                    status:false
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
                const sapatiamountAfterwithdraw = (numberofdays*result[0].interestRate *result[0].savingamount) /100;
                
                await Promise.all([
                    saveBalance.save(),
                    UserModel.findByIdAndUpdate(
                        currentUser._id,
                        {
                            saving:currentUser.saving - result[0].savingamount ,
                            balance:currentUser.balance +result[0].savingamount +sapatiamountAfterwithdraw,
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
    sapati = async(req,res,next)=>{
        logger.http("POST, /sapati")
        const currentUser = req.auth_user;
        console.log(req.body);
        try{
            const {error,value} = await sapatiSchema.validate(req.body);
            
            const sapatiamount = value.sapatiAmount;
            console.log(sapatiamount);
            const purpose = value.purpose;
            const date = getTodayDate();
            


            if(error){
                console.log(error);
                throw error;

            }else{
                    if(currentUser.sapati>1){
                    next({
                        status:400,
                        message:"Already taken"
                    });
                    
                    }else if(currentUser.balance >10.01 && currentUser.saving>10.01 ){
                    next({
                        status:400,
                        message:"Your balance must be less then 10 "
                    });

                }else { 
                    console.log(sapatiamount);
                    const sapatiBalance = new SapatiModel({
                        userId:currentUser._id,
                        userName:currentUser.name,
                        sapatiAmount:sapatiamount,
                        purpose:purpose,
                        createdAt:date,
                        activity:"Sapati"
                    });
                    sapatiBalance.save();
                    res.send(
                        {
                            message:"Sapati has requested to admin",
                            sapatiamount:sapatiamount,
                            purpose:purpose,
                            date:date
                        }
                    )
                }
            }

        }catch(error){
            next(error);
        }
        

    }
    sapatiRequestList = async(req,res,next)=>{
        try{
            const result = await SapatiModel.find({});
            console.log(result.length);
            if(result.length<=0){
                next(
                    {status:400,
                    message:"List not found"
                }
                )
            }else{
                res.send(result);
                
            }
        }catch(error){
            next(error);
        }

    }
    approveSapati = async(req,res,next)=>{
        logger.http("POST /sapati/approve");
        const adminId = req.auth_user;
        const sapatiID = req.params.id;
        // console.log(adminId);

        try{
            const result  = await SapatiModel.findOne({
                "_id":sapatiID.toString()
            });
            const requestUser = await UserModel.find({"_id":result.userId.toString()});
            console.log(requestUser[0].name);
            console.log(result.sapatiAmount);
            const balance = adminId.balance - result.sapatiAmount;
            console.log(balance);

            
            if(!result.approvedByAdmin){

                await Promise.all([ 
                    UserModel.findByIdAndUpdate(
                        requestUser,
                        {
                            sapati:requestUser[0].sapati + result.sapatiAmount,
                            balance:requestUser[0].balance + result.sapatiAmount
                        }

                    ),
                    UserModel.findByIdAndUpdate(
                        adminId,
                        {
                            balance:adminId.balance - result.sapatiAmount
                        }
                    ),
                    SapatiModel.findByIdAndUpdate(result.id,{
                        approvedByAdmin:true

                    }),
                    

                ]);
                res.send("Successfully approved and sent")


            }else{
                next({
                    status:401,
                    message:"Already approved"
                })
            }
        }catch(error){
            next(error);
        }
        

    }
    getSapatiList = async(req,res,next)=>{
        const currentUser = req.auth_user;
        const list = await SapatiModel.find({
            "userId":currentUser
        });

        // const approvedData = list.filter(item => item.approvedByAdmin === true)

        if(list.length ===0){
            next(
                {
                    message:"No sapati found!",
                    status:false
                }
            )
        }else{
             res.send(list)
            
        }
        

    }
    returnSapati = async(req,res,next)=>{
        logger.http("POST /user/returnsapati")
        const currentUser = req.auth_user;
        const sapatiId = req.params.id;
        const admin = "65185b36fe804bae8cc6115d";

        try{
            const result = await SapatiModel.find({"userId":currentUser._id, "_id":sapatiId });
            console.log(currentUser.sapati);
            const amountUserPay = result[0].sapatiAmount +15;
            console.log(amountUserPay);
            const adminData = await UserModel.find({"_id":admin});
            console.log(adminData);
            if(currentUser.balance <amountUserPay){
                next({
                    status:500,
                    message:"insufficiant balance"
                })
            }else{
                 if(!result[0].paid){
                await Promise.all([
                    UserModel.findByIdAndUpdate(
                        currentUser._id,
                        {
                            sapati:currentUser.sapati - result[0].sapatiAmount,
                            balance:currentUser.balance - result[0].sapatiAmount
                        }                    
                        ),

                    UserModel.findByIdAndUpdate(
                        admin,
                        {
                            balance:adminData[0].balance + result[0].sapatiAmount
                        }

                    ),
                        SapatiModel.findByIdAndUpdate(
                            sapatiId,
                            {
                                paid:true
                            }
                        )
                ]);

                res.send(
                    {
                        message:"Successfully paid",
                        status:true
                    }

                )
            }

            }

           
            
            
        }catch(error){
            console.log("error from here")
            next(error);
        }






    }
    


}
module.exports= BalanceController;
const BalanceModel = require("../Models/balance.model");

class TransactionController {
    fetchAllTransaction = async(req,res,next)=>{
        const user = req.params.id;
        console.log(user);
        const list = await BalanceModel.find(
            {"userId" : user}
        );
        if(list.length ===0){
            res.send(
                {
                    message:"no history found",
                    status:true
                }
            );

        }else{
            res.send(
                list.map((history) => {
                  const newHistory = {
                    ...history._doc,
                    transactionId: history._id,
                    ...(history.transactorName && history.cashFlow === "in"
                      ? { senderName: history.transactorName }: { receiverName: history.transactorName }),
                      ...(history.transactorEmail && history.cashFlow === "in" ? { senderEmail: history.transactorEmail }: { receiverEmail: history.transactorEmail })};
                  delete newHistory._id;
                  delete newHistory.transactorName;
                  delete newHistory.transactorEmail;
          
                  return newHistory;
                })
              );
        }
        
        

    }


}
module.exports = TransactionController;
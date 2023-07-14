const alphanumeric = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

const generateOtp = ()=>{
    let otp = '';
    for(let i =0 ;i<6; i++){
        otp += alphanumeric.charAt(~~(Math.random()* alphanumeric.length));  
    };
    return  otp;
}


module.exports = {generateOtp};
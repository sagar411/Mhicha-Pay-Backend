const nodemailer = require("nodemailer");
const {google} = require('googleapis');
const {CLIENT_ID,CLIENT_SECRETS, REDIRECT_URI, REFRESH_TOKEN, EMAIL }=require("./constant");

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRETS, REDIRECT_URI);

oAuth2Client.setCredentials({
    refresh_token: REFRESH_TOKEN
});

const sendMail = async ({ email, subject, text,html})=>{
    console.log(CLIENT_ID);
    try{

        const accessToken = await oAuth2Client.getAccessToken();

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth :{
                type: "OAuth2",
                user: EMAIL,
                clientId:CLIENT_ID,
                clientSecret:CLIENT_SECRETS,
                refreshToken: REFRESH_TOKEN,
                accessToken
            }
        });
        
        await transporter.sendMail({
            from :`"mhicha pay" <${email}>`,
            to: email,
            subject,
            text,
            html
        });
    }catch(e){
        
        console.log("eRROR FROM SEND EMAIL",e);
       throw e;
       
    }
}

const userVerifyMail = (email,value,otp)=>{
    sendMail({
        value,
        email,
        subject:"User Verification Code !!",
        html:
        `<!DOCTYPE html>
        <html lang="en">
          <body>
            <h1>Hi ${email}!</h1>
            <p>You are receiving this email because you requested for a new OTP code. In order to complete your verification please use this token.</p>
            <br/>
            <p>Token: <code>${otp}</code></p>
            <p>If you did not requested for the code, please ignore this email.</p>
            <p><b>Note: Please do not share the token with anyone else. This might lead to harm your account.</b></p>
            <br/>
            <p>Thank you!</p>
            <p>mhicha pay</p>
          </body>
        </html>
        `

        
    });
    console.log("Email send ");
}

module.exports = {userVerifyMail};
const nodemailer = require('nodemailer');
const dotenv=require("dotenv")
dotenv.config({
    path:"./custom.env"
})
const transport=nodemailer.createTransport({
    host:process.env.HOST,
    port:Number(process.env.HOST_PORT),
      secure: false,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.APP_PASSWORD
        
    }
})
const sendEmail=async(sendto,code)=>{
    try{
const mailOptions={
    from: process.env.EMAIL_FROM || '"MyApp" <no-reply@myapp.com>',
    to: sendto,
    subject: 'Your 6-digit verification code',
    text: `Your verification code is: ${code}. It expires in 15 minutes.`,
    html: `<p>Your verification code is: <b>${code}</b></p><p>It expires in 15 minutes.</p>`
    
}
const info=await transport.sendMail(mailOptions)
 console.log('Email sent:', info.messageId);
    return info;
    }catch(e){
        console.log(e.message)
        throw e;
    }

}
module.exports=sendEmail
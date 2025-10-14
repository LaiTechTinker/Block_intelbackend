const mongoose=require("mongoose")
const bcrypt=require("bcrypt")
const Schema=mongoose.Schema
const EmailTokenSchema=new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        required:true,
        ref:"users"  
    },
     // hashed OTP
    tokenHash:{
         type: String, required: true 
        },
},
  {
    timestamps:true
    });
// Auto-delete verification doc after 15 minutes (900 seconds)
EmailTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 900 });
const EmailModel=mongoose.model("Emailtoken",EmailTokenSchema)
module.exports=EmailModel
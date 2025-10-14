const express=require("express")
const mongoose=require("mongoose")
const app=express()
const cors=require("cors")
const nodemailer = require('nodemailer');
const dotenv=require("dotenv")
const userRoutes=require("./Routes/userRoutes")
dotenv.config({
    path:"./custom.env"
})

app.use(cors({
    origin: "*"
}))
app.use(express.json())
// the following code block will connect to mongodb
const connection=async()=>{
    try{
 await mongoose.connect(process.env.MONGODB_STRING)
   console.log("mongodb connection successfull")
    }catch(e){
        console.log(e.message)
    }
  
}
connection()
app.get("/",(req,res)=>{
res.send("hello boy")
})
app.use("/user",userRoutes)

PORT=process.env.PORT||3000
app.listen(PORT,async()=>{
    try{
console.log("connection successfull on Port:",PORT)
    }catch(e){
        console.log(e.message)
    }
    
})
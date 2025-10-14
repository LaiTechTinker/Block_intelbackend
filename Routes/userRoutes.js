const express=require("express")
const Routes=express.Router()
const authMiddleware=require("../Middleware/auth")
const {signupController,loginController,verify,getUserInfo}=require("../Controller/userController")

Routes.post("/Signup", signupController);
Routes.post("/verify", verify);
Routes.post("/Login", loginController);
Routes.get("/getinfo",authMiddleware,getUserInfo);
module.exports=Routes
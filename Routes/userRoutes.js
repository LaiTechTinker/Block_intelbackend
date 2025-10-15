const express=require("express")
const Routes=express.Router()
const authMiddleware=require("../Middleware/auth")
const upload=require("../utils/imageupload")
const {signupController,loginController,verify,getUserInfo,updateProfilePicture}=require("../Controller/userController")

Routes.post("/Signup", signupController);
Routes.post("/verify", verify);
Routes.post("/Login", loginController);
Routes.get("/getinfo",authMiddleware,getUserInfo);
Routes.post(
  '/profile-picture',
  authMiddleware,
  upload.single('profilePic'), // form field name = profilePic
  updateProfilePicture
);
module.exports=Routes
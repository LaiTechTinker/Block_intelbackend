const Jwt=require('jsonwebtoken');

const dotenv=require("dotenv")
dotenv.config({
    path:"../custom.env"
})
const  generateToken=(id)=>{
    return Jwt.sign({id},process.env.SECRET, {expiresIn:"30d"})
}
console.log(process.env.SECRET)
module.exports=generateToken
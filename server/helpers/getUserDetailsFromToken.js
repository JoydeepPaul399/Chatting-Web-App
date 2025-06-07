const jwt = require("jsonwebtoken")
const UserModel = require("../models/UserModel")


const getUserDetailsFromToken= async (token)=>{
    try {
        if(!token){
            return  {
                message: "Session out",
                logout: true,
            }
        }

        const decode= await jwt.verify(token, process.env.JWT_SECRET_KEY)
        const user= await UserModel.findById(decode.id).select("-password")

        return user
    } catch (error) {
        if(error.name==="TokenExpiredError"){
            return {
                message: "Token Expired!",
                logout: true
            }
        }
    }
}

module.exports= getUserDetailsFromToken
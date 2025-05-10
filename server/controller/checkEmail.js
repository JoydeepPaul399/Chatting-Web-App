const UserModel = require("../models/UserModel")

async function checkEmail(req, res){
    try{
        const {email}= req.body
        const checkEmail= await UserModel.findOne({email}).select("-password")

        if(!checkEmail){
            return res.status(400).json({
                message: "Email is not registered",
                error: true,
                success: false
            })
        }

        return res.status(200).json({
            message: "Email verified",
            success: true,
            error: false,
            data: checkEmail
        })

    }
    catch(error){
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports= checkEmail
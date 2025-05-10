const bcryptjs= require('bcryptjs')
const UserModel = require('../models/UserModel')
const jwt = require('jsonwebtoken')

async function checkPassword(req, res) {
    try{
        const {password, userId}= req.body
        const user= await UserModel.findById(userId)
        const verifyPassword= await bcryptjs.compare(password, user.password)

        if(!verifyPassword){
            return res.status(400).json({
                message: "Please check password",
                error: true,
                success: false
            })
        }

        const tokenData= {
            id: user._id,
            email: user.email
        }
        const token= await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, {expiresIn: "1d"})
        const cookieOption= {
            httpOnly: true,
            secure: true
        }

        // res.cookie("token", token, cookieOption)

        // return res.json({
        //     message: "Login successfully",
        //     error: false,
        //     success: true,
        //     data: token
        // })

        return res.cookie('token',token,cookieOption).status(200).json({
            message : "Login successfully",
            token : token,
            success :true
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

module.exports= checkPassword
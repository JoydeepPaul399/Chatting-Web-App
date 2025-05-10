const UserModel = require("../models/UserModel")
const bcryptjs= require('bcryptjs')

async function registerUser(req, res){
    try {
        const {name, email, password, profile_pic}= req.body
        const checkEmail= await UserModel.findOne({email})

        if(!email || !password || !name || !profile_pic){
            return res.status(400).json({
                message: "Please provide all fields",
                error: true,
                success: false
            })
        }

        if(checkEmail){
            return res.status(400).json({
                message: "User already exist",
                error: true,
                success: false
            })
        }

        const salt= await bcryptjs.genSalt(10)
        const hasedPassword= await bcryptjs.hash(password, salt)

        const payload= {
            name,
            email,
            profile_pic,
            password: hasedPassword
        }

        const user= new UserModel(payload)
        const userSave= await user.save()

        return res.status(201).json({
            message: "User created successfully", 
            error: false,
            success: true,
            data: userSave
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports= registerUser
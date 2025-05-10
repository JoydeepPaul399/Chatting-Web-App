const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")
const UserModel = require("../models/UserModel")

async function updateUserDetails(req, res){
    try{
        const token = req.cookies.token 

        if (!token) {
            return res.status(401).json({
                message: "Unauthorized: Token missing",
                success: false,
                error: true
            });
        }
        
        const user= await getUserDetailsFromToken(token)

        const {name, profile_pic}= req.body

        if(!name || !profile_pic){
            return res.json({
                message: "All fields are required!",
                error: true,
                success: false
            })
        }

        const updateUser= await UserModel.updateOne({_id: user._id}, {
            name,
            profile_pic
        })

        if (updateUser.modifiedCount === 0) {
            return res.status(400).json({
                message: "No changes were made",
                success: false,
                error: true,
            });
        }

        // console.log("Updating")

        const userInformation= await UserModel.findById(user._id).select("-password")

        return res.json({
            message: "User updated successfully",
            data: userInformation,
            success: true,
            error: false
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

module.exports= updateUserDetails
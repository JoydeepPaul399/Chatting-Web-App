const UserModel = require("../models/UserModel")

async function searchUser(req, res) {
    try{
        const {search}= req.body
        // This line is trying to create a regular expression object in JavaScript.
        // const query= new RegExp(search, "i", "g")
        const query= new RegExp(search, "i")

        const user= await UserModel.find({
            "$or": [
                {name: query},
                {email: query}
            ]
        }).select("-password")

        return res.json({
            message: "All Users",
            data: user,
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

module.exports = searchUser
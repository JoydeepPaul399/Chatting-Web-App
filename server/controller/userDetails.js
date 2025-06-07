const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken")

async function userDetails(req, res){
    try {
        const token = req.cookies.token || ""
        
        const user= await getUserDetailsFromToken(token)

        if(user.logout){
            return res.status(401).json({
                message: user.message,
                error: true,
                success: false
            })
        }
        return res.status(200).json({
            message: "User details",
            data: user
        }) 

    } catch (error) {
        return res.status(500).json({
            message: error.message || error,
            error: true,
            success: false
        })
    }
}

module.exports= userDetails
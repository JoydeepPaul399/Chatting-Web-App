async function logout(req, res){
    try{

        const cookieOption= {
            httpOnly: true,
            secure: true
        }

        return res.cookie("token", "", cookieOption).status(200).json({
            message: "Session out/Logged out successfully",
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

module.exports= logout
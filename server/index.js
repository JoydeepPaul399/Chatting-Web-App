// npm i express cors mongoose jsonwebtoken cookie-parser dotenv bcryptjs
const express = require('express')
const cors= require('cors')
const dotenv= require('dotenv')
dotenv.config()
const connectDB= require('./config/connectDB')
const router= require("./routes/index")
const cookieParser= require('cookie-parser')
const {app, server}= require('./socket/index')

// const app= express() // Now I am commenting because we have app instance on wesocket configuration

app.use(cors({
    origin: process.env.FRONTEND_URL,
    credentials: true 
}))

app.use(cookieParser())

app.use(express.json())

const PORT= process.env.PORT || 8080


app.get("/", (req, res)=>{
    res.json({
        message: "Server is running on port " + PORT
    })
})

// api end point 
app.use("/api", router)

connectDB().then(()=>{
    // app.listen(PORT, ()=>{ It is also commenting server is created in socket folder that will be used now. 
    server.listen(PORT, ()=>{
        console.log(`Server is running on ${PORT}`)
    })
    // Now websocket server is running at http://localhost:8080/
})




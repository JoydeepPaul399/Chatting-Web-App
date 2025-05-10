const express= require('express')
const {Server}= require('socket.io')
const  http = require('http') // This is built-in module, so there is no need to install it explicitly
const getUserDetailsFromToken = require('../helpers/getUserDetailsFromToken')
const UserModel = require('../models/UserModel')
const { conversationModel, messageModel } = require('../models/ConversationModel')
const getConversation = require('../helpers/getConversation')
const app= express()
// socket io needs the raw server to work which is built with http 
// socket connections 
const server= http.createServer(app)

const io= new Server(server, {
    cors:{
        origin: process.env.FRONTEND_URL,
        credentials: true 
    }
})

// online user. A Set is a special type of JavaScript object that lets you store unique values — meaning no duplicates allowed.
const onlineUser= new Set()

io.on('connection', async (socket)=>{
    console.log("connected user", socket.id)
    // This handshake typically includes metadata about the connection request.
    const token= socket.handshake.auth.token

    const user= await getUserDetailsFromToken(token)
    // console.log(user)
    if (!user) {
        socket.disconnect()
        return
    }

    // create a room 
    socket.join(user?._id?.toString())
    onlineUser.add(user?._id?.toString())

    io.emit('onlineUser', Array.from(onlineUser))

    // This is for the message page, sending data from frontend messagepage useEffect 
    socket.on('message-page', async (userId)=>{
        // console.log("User id is ", userId)
        const userDetails= await UserModel.findById(userId).select("-password")

        const payload= {
            name: userDetails?.name,
            _id: userDetails?._id,
            email: userDetails?.email,
            online: onlineUser.has(userId),
            profile_pic: userDetails.profile_pic
        }

        socket.emit("message-user", payload)

        // Get previos message 
        const getConversationMessage= await conversationModel.findOne({
            "$or":[
                {sender: user?._id, receiver: userId},
                {sender: userId, receiver: user?._id}
                ]
        }).populate("message").sort({updatedAt : -1})


        socket.emit("message", getConversationMessage?.message || [])
        // just to test 
        // socket.emit("conversation-with-user", getConversationMessage)
    })

    

    

    // New Message 
    socket.on("new-message", async (data)=>{
        // console.log("New Message", data)

        // Check whether conversations are available for both users
        // Find a conversation where (sender is A and receiver is B) OR (sender is B and receiver is A).
        let conversation= await conversationModel.findOne({
            "$or":[
                {sender: data?.sender, receiver: data?.receiver},
                {sender: data?.receiver, receiver: data?.sender}
        ]
        })
        // console.log("conversation", conversation)

        // console.log("conversation", conversation)
        
        // if the conversation is null (not available) then I need to create the conversation 
        if(!conversation){
            const createConversation= new conversationModel({
                sender: data?.sender,
                receiver: data?.receiver
            })
            conversation= await createConversation.save()
        }

        // console.log("conversation", conversation)

        const message= new messageModel({
            text: data?.text,
            imageUrl: data?.imageUrl,
            videoUrl: data?.videoUrl,
            msgByUserId: data?.msgByUserId
        })

        const saveMessage= await message.save()

        //Now we need to update the message in conversation modle
        const updateConversation= await conversationModel.updateOne({_id: conversation?._id}, {
            "$push": {message: saveMessage._id}
        })

        
        const getConversationMessage= await conversationModel.findOne({
            "$or":[
                {sender: data?.sender, receiver: data?.receiver},
                {sender: data?.receiver, receiver: data?.sender}
                ]
        }).populate("message").sort({updatedAt : -1})

        // console.log("Emitting to sender:", data?.sender)
        // console.log("Emitting to receiver:", data?.receiver)

        io.to(data?.sender).emit("message", getConversationMessage?.message || [])
        io.to(data?.receiver).emit("message", getConversationMessage?.message || [])

        const conversationSender= await getConversation(data?.sender)
        const conversationReceiver= await getConversation(data?.receiver)
        // socket.emit("conversation", conversationSideBar)
        io.to(data?.sender).emit("conversation", conversationSender)
        io.to(data?.receiver).emit("message", conversationReceiver)
    })


    // console.log(token)

    socket.on("sidebar", async (currentUserId)=>{
        // console.log("current user Id", currentUserId)
        const conversation= await getConversation(currentUserId)
        socket.emit("conversation", conversation)
    })

    socket.on("seen", async (msgByuserId)=>{
        let conversation= await conversationModel.findOne({
            "$or":[
                {sender: user?._id, receiver: msgByuserId},
                {sender: msgByuserId, receiver: user?._id}
        ]
        })

        const conversationMessageId= conversation?.message || []

        const updateMessages = await messageModel.updateMany({
            _id: {"$in": conversationMessageId}, msgByUserId: msgByuserId
        }, 
        {
            "$set": {seen: true}
        })

        const conversationSender= await getConversation(user?._id?.toString())
        const conversationReceiver= await getConversation(msgByuserId)
        // socket.emit("conversation", conversationSideBar)
        io.to(user?._id?.toString()).emit("conversation", conversationSender)
        io.to(msgByuserId).emit("message", conversationReceiver)
    })

    socket.on('disconnect', ()=>{
        onlineUser.delete(user?._id?.toString())
        console.log("Disconnected user", socket.id)
    })
})

module.exports= {
    app,
    server
}
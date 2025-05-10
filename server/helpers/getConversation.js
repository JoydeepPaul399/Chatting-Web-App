const { conversationModel } = require("../models/ConversationModel")

const getConversation= async (currentUserId)=>{
    if(currentUserId){
        const currentUserConversation= await conversationModel.find({
            "$or":[
                {sender: currentUserId},
                {receiver: currentUserId}
            ]
        }).sort({updatedAt: -1}).populate("message").populate("sender").populate("receiver")
        const conversation= currentUserConversation.map((converse)=>{
            const countUnseenMsg= converse.message.reduce((preves,curr) => {
                const msgByUserId= curr?.msgByUserId?.toString()
                if(msgByUserId!==currentUserId){
                    return preves+(curr.seen ? 0 : 1)
                }
                else{
                    return preves
                }
            } ,0)
            // console.log("This is ", converse?.message[converse?.message?.length - 1])
            return {
                _id: converse?._id,
                sender: converse?.sender,
                receiver: converse?.receiver,
                unseenMsg: countUnseenMsg,
                lastMsg: converse?.message[converse?.message?.length - 1]
            }
        })
        
        return conversation
        // socket.emit("conversation", conversation)
    }

    else{
        return []
    }
}

module.exports= getConversation
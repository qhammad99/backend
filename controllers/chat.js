const Chat = require('../model/chat.js');

exports.getMessages = async (req, res) => {
    try{
        const [user] = req.user;
        const sender_id = req.params.sender_id;
        const reciever_id = req.params.reciever_id;

        let [chat] = await Chat.getChat(sender_id, reciever_id);
    
        if(chat.length == 0)
        {
            return res.status(200).json({
                success:false,
                message: "no chat"
            });
        }

        res.status(200).json({
            success:true,
            message: "your chat",
            chat: chat
        });
    }catch(err){
        res.status(500).json({message:"Server error", error:err})
    }
}
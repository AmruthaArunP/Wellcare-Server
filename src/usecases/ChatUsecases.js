const chatRepository = require('../repositories/chatRepository');
const doctorUsecases = require('./doctorUsecases');
const ChatUsecases ={
    saveChat : async (data) =>{
        try {
            console.log("data inside savechat****:",data);
           const checkChatExists = await chatRepository.getChatByChatId(data.id)
           let chat;
           if(checkChatExists){
            chat = await chatRepository.updateChat(checkChatExists._id, data)
           }else{
            chat = await chatRepository.createNewChat(data)
           }
           return chat
        } catch (error) {
            console.log(error);
        }
    },

    getChatByChatId : async (req, res) => {
        try {
            const chatId = req.query.chatId;
            const result = await chatRepository.getChatByChatId(chatId)
            console.log("result in chat page:",result);
            res.json(result)
        } catch (error) {
            console.log(error);
        }
    },



}

module.exports = ChatUsecases;
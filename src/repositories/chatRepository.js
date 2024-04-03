const Chat = require('../entities/chatModel')

const chatRepository = {
    getChatByChatId : async (chatId) => {
        try {
            return Chat.findOne({chatId : chatId})
        } catch (error) {
            throw new Error('Error finding chat');
        }
    },

    updateChat : async ( chatId , message ) => {
        try {
            const result = await Chat.findByIdAndUpdate(
                chatId,
                {
                    $push: {
                        messages: message
                    },
                },
                {
                    new: true
                }  
            )
            return result
        } catch (error) {
            throw new Error('Error updating chat');
             
        }
    },

    createNewChat: async (data) => {
        try {
            const chat = new Chat({
                chatId: data.id,
                messages: [{
                    from: data.from,
                    message: data.message,
                    to: data.to,
                }]
            });
            const result = await chat.save();
            console.log("result in repo:",result);
            return result;
        } catch (error) {
            // Handle error
            console.error(error);
            throw error; // Rethrow error for handling upstream
        }
    },

    getChatByChatId : async (chatId) => {
         try {
            return await Chat.findOne({chatId : chatId})
         } catch (error) {
            throw new Error("error while getting chat data");
         }
    }

    

}

module.exports = chatRepository;
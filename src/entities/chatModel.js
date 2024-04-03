const mongoose = require('mongoose')

const chatSchema = new mongoose.Schema({
    chatId:{
        type:String
    },
    messages: [
        {
            from: {
                type: String,
                
            },
            message: {
                type: String,
                
            },
            to: {
                type: String,
                
            },
            id:{
                type:String
            },
         
            timestamp: {
                type: Date,
                default: Date.now
            }
            
            
        }
    ]
    })

module.exports = mongoose.model('Chat',chatSchema);

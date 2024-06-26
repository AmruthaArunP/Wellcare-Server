const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      age: {
        type: Number,
       
      },
      contact: {
        type: Number,
        
      },
      password: {
        type: String,
       
      },
      image: {
        type: String,
      },
      documents: {
        type: Array,
      },
      address: {
        type: String,
      },
      gender: {
        type: String,
      },
      token: {
        type: String,
      },
      otp: {
        type: Number,
      },
      isBlocked: {
        type: Boolean,
        default: false,
      },
      isVerified: {
        type: Boolean,
        default: false,
      },
      timeStamp: {
        type: String,
        required: true,
      },

});


module.exports = mongoose.model('User', userSchema);
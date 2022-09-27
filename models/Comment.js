const mongoose = require('mongoose');
  
// Yorumlar bloglar silinse de burada kalmalı sanırım , gerçek hayatta kanıt olması amacıyla

const commentSchema = mongoose.Schema({

    publisherName:{
        type:String,
        required:true
    },

    publisherId : {
        type:String,
        required: true
    },

    blogId: {
        type: String,
        required: true
    },


    content :{
        type:String,
        required:true
    },

    isActive : {
        type:Boolean,
        default : false
    },

    postedAt:{
        type:String,
        default: new Date().toUTCString()
    }



});


module.exports = mongoose.model("Comment", commentSchema);
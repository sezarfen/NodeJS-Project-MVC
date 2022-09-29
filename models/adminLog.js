const mongoose = require('mongoose');


const logSchema = mongoose.Schema({

    user : {
        type : String,
        required : true
    },
    
    content: {
        type: String,
        required: true
    },

    date: {
        type: String,

        default: new Date().toUTCString()
    }

});


module.exports = mongoose.model("adminLog", logSchema );
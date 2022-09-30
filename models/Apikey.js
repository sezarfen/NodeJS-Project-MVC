const mongoose = require('mongoose');


const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

const randomStringGenerator = (length) =>{

    let string = "";

    for (let i = 0; i < length; i++) {
        const randomNumber = Math.floor(Math.random() * characters.length);
        string += characters[randomNumber];
    }

    return string
} 

const apiSchema = mongoose.Schema({

    key : {
        type: String,
        default: randomStringGenerator(10)
    },


    userId : {
        type:String,
        required : true
    }

})


module.exports = mongoose.model("ApiKey" , apiSchema);
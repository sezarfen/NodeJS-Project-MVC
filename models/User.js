const mongoose = require('mongoose');

let referenceNumber = Math.floor(Math.random() * 999999);

const userSchema = mongoose.Schema({

    fullname: {
        type: String,
        required: true
    },

    username: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true
    },

    password: {
        type: String,
        required: true,
        validate: {
            validator: (args) => {
                args.length >= 6
            },
            message: "Şifre en az 6 karakter içermelidir"

        }
    },

    isAdmin: {
        type: Boolean,
        default: false,
    },

    adress: {
        type: String,
        required: false
    },

    ability: {
        type: String,
        required: true
    },

    phoneNumber: {
        type: String,
        minlength: 11,
        maxlength: 11
    },

    createdAt: {
        type: String,
        default: new Date().toUTCString()
    },


    following: [],

    followers: [],


    subUsers: [
        {
            userId: {
                type: String,
                ref: "User"
            }
        }
    ],

    referenceNumber: {
        type: Number,
        default: referenceNumber
    },

    referrerNumber: {
        type: Number,
        required: true,
        default: "111111"
    },

    notifications: []


})



module.exports = mongoose.model("User", userSchema);
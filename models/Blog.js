const mongoose = require('mongoose');

const blogSchema = mongoose.Schema({

    title : {
        type : String,
        required : true,
        maxLength : 100
    },

    content : {
        type : String,
        required : true,
        minLength : 10,
        validate:{
            validator: function(args){
                return args.length >= 10
            },
            message: "İçeriğin uzunluğu en az 10 karakter olmalıdır"
        }
    },

    imageUrl : {
        type : String,
        required : false,
        default : "https://via.placeholder.com/150"
    },

    editorId : {
        type: String,
        ref : "User",
        required : true
    },

    comments : [
        {
            commentId:{
                type: String,
                required: true
            },

            publisherName:{
                type:String,
                required:true
            },

            publisherId: {
                type:String,
                ref:"User",
                required:true
            },
            content:{
                type:String,
                required: true

            },
            postedAt:{
                type:String,
                default: new Date().toUTCString()
            }
        }
    ]

});


module.exports = mongoose.model("Blog" , blogSchema);
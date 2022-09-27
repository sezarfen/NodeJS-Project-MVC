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

    
    editorName : {
        type: String,
        required : true
    },

    comments : [
        {
            commentId:{
                type: String,
                required: true
            }
        }
    ]

});


module.exports = mongoose.model("Blog" , blogSchema);
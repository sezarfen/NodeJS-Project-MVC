// Database'e gitmeyecek bir login nesnesi oluşturuyoruz
// save işlemi gibi işlemler kullanmayacağız yani
const mongoose = require('mongoose');
const {isEmail} = require("validator");

const loginSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true,"Eposta adresi girmelisiniz"],
        validate : [isEmail,"Geçersiz ya da Hatalı eposta adresi"]
    },
    password: {
        type: String,
        required: [true , "Parola giriniz"]
    }  
});


module.exports = mongoose.model("Login", loginSchema);
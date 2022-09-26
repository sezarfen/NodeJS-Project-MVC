module.exports = (req, res, next) => {
    if (!req.session.isAdmin) {
        if(!req.session.user){
            req.session.errorMessage = "Bu işlemi yapabilmek için lütfen giriş yapınız"
            return res.redirect("/login");  // login sayfasına yönlendirme yapalım    
        }else{
            req.session.errorMessage = "Bu işlemi yapabilme yetkisine sahip değilsiniz"
            return res.redirect("/profile");  // login sayfasına yönlendirme yapalım
        }
    } else {
        next();
    }

}
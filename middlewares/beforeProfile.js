module.exports = (req,res,next) =>{

    if(!req.session.user){
        req.session.errorMessage = "You have to login before visiting Profiles";
        return res.redirect("/login")
    }
    next();
}
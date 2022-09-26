module.exports = (req,res,next) =>{


    if(!req.session.isAuthenticated){
        req.session.errorMessage = "You have to login in before doing that"
        return res.redirect("/login")
    }

    next()
}
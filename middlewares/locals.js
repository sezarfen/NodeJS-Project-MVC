module.exports = (req, res, next) => {

    if(req.originalUrl == "/favicon.ico"){
     next();
    }
    delete res.locals.errorMessage;

    // Locals otomatik olarak renderların içerisine gidiyor o yüzden her renderda yazmaya gerek kalmıyor

    res.locals.isAuthenticated = req.session.isAuthenticated;     // bunu da ekledim ve artık renderlardan isAuthenticated ' ı silebiliriz 
    res.locals.errorMessage = req.session.errorMessage;  // errorMessage ' ı da localsdan gönderiyoruz
    res.locals.currentUrl = req.originalUrl;
    
    // console.log(req.originalUrl);

    next();
}
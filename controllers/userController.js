const graphqlFunctions = require("../GraphQL/graphqlFunctions");
const Comment = require("../models/Comment");
const User = require("../models/User");
const {isEmpty, not} = require("ramda");
const Apikey = require("../models/Apikey");


exports.getIndex = (req, res, next) => {

    graphqlFunctions.getBlogs().then((blogs) => {
        res.render("mainPages/index", {

            title: "Main Page",
            blogs: blogs
        
        });
    }).catch(err => console.log(err))

}


exports.getBlogIndex = async (req, res, next) => {

    const infoMessage = await req.session.infoMessage;
    delete req.session.infoMessage;

    const blogId = req.params.blogId;            // link/:params olarak almak gerekiyor
   
    graphqlFunctions.getBlogById(blogId).then(async blog => {
               
        const comments = await Comment.find({

        _id : {$in: blog.comments.map(comment=>comment.commentId)}, 
        isActive : true   // isActive olmayanlar boşuna gelmesin
    
        }).then(comments=>comments).catch(e=>console.log(e)); 


        res.render("mainPages/blogindex", {
            title: "Blogs",
            blog: blog,
            comments: comments || R.isEmpty(comments),
            currentUser: req.user || {},
            infoMessage : infoMessage
        });
        
    }).catch(err => console.log(err));
}


exports.postNewComment = async (req,res)=>{  // Eğer kullanıcı giriş yapmamışsa login sayfasına yönlendirilsin

    const newComment = new Comment({
    
        publisherName : req.body.publisherName ,
        publisherId : req.body.commenterId ,
        blogId : req.body.blogId,
        content: req.body.blogComment
        
    });

    await newComment.save();

    User.find({isAdmin : true}).then(admins=>{
        
        return admins.forEach(async admin=>{
       
            const notifications = admin.notifications;
            await notifications.push({type:"comment" , newComment})
            admin.notifications = notifications;
            admin.save();

        })

    }).then(()=>{

        return req.session.infoMessage ="Yorumunuz kontrol edilmek üzere gönderilmiştir"; // BURADA BİR ZAMANSAL SIKINTI VAR KONTROL EDİLMELİ
    
    }).then(()=>{

        res.redirect("back");

    }).catch(e=>console.log(e));
}


const apiKeyGenerator = (req,text)=>{

    const newApiKey = new Apikey({
        userId : req.user._id
    });

    User.findById(req.user._id).then(async user=>{ 
        const notifications = await user.notifications;
        await notifications.push({type: "newapikey", content :`${text} ${newApiKey.key}`});
        user.notifications = await notifications;
        user.save();
    });

    newApiKey.save()

}


exports.postNewApiKey = async (req,res) =>{

    const apikey = await Apikey.findOne({userId : req.user._id}).then(key => key).catch(e=>console.log(e));

    if(apikey){
        await apikey.delete();

        apiKeyGenerator(req,"yeni API_KEY isteğiniz : ");

    }else{

        apiKeyGenerator(req,"API_KEY oluşturuldu : ")

    }


    res.redirect("/notifications");
}
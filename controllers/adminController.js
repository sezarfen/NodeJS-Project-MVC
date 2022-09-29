const graphqlFunctions = require("../GraphQL/graphqlFunctions");
const User = require("../models/User");
const Blog = require("../models/Blog");
const Comment = require("../models/Comment");
const fs = require('fs');

const DeleteCommentNotificationFromAdmin = async (commentId) => {

    console.log(commentId)

    const admins = await User.find({ isAdmin: true });
    admins.forEach(async (admin) => {
        const notifications = admin.notifications;
        const index = await notifications.findIndex(async notification => {
            console.log(notification); // yine zamansal problemler yaşanıyor ara sıra 
            // üsteki logu attım diye sanırım bekleyebildi ve newCommentId döndü
            const newComment = await notification.newComment
            console.log(newComment);
            const newCommentId = await newComment._id
            return newCommentId.toString() === commentId.toString();
        });
        notifications.splice(index, 1);
        admin.notifications = notifications;

        admin.save();

    });
}

exports.getAddBlog = (req, res, next) => {

    res.render("adminPages/add-blog", {});

}

exports.postAddBlog = (req, res, next) => {
    addQuery = `
    mutation Mutation($input: addBlogInputs!) {
        addBlog(input: $input) {
          id
          title
          content
          imageUrl
          editorId
          editorName
        }
      }`;

    let variables;

    if (req.file) {
        variables = {
            "input": {
                "title": req.body.blogTitle,
                "content": req.body.blogContent,
                "editorId": req.user._id,
                "editorName": req.user.username,
                "imageUrl": "/img/" + req.file.filename
            }
        };
    } else {
        variables = {
            "input": {
                "title": req.body.blogTitle,
                "content": req.body.blogContent,
                "editorId": req.user._id,
            }
        };
    }


    graphqlFunctions.MutateBlog(addQuery, variables).then((data) => {
        if (data.data.errors) {
            this.errorController(data.data.errors, res)
        } else {
            res.redirect("/admin/blogs")
            console.log(data.data.data.addBlog);
        }
    }).catch(err => console.log(err));


}

exports.getBlogs = (req, res, next) => {

    graphqlFunctions.getBlogs().then(blogs => {

        return blogs.map(blog => {

            User.findById(blog.editorId)

                .then(user => user)

                .then(user => {
                    // console.log(user.username)
                    blog.editorId = user.username
                })

                .catch(e => console.log(e));

            return blog     // EKLEYEN KİŞİNİN ID'Sİ YERİNE USERNAME ' İ DÖNMESİ İÇİN BURADA BAKILABİLİR ASYNC OLAYI OLDUĞUNU DÜŞÜNÜYORUM

        })

    }).then((blogs) => {
        res.render("adminPages/blogs", {
            title: "Admin Blogs",
            blogs: blogs
        })
    })
        .catch(err => console.log(err));


}

exports.postDeleteBlog = async (req, res, next) => {

    const blogId = req.body.blogId;

    const blog = await Blog.findOne({ _id: blogId }).then(blog => blog).catch(e => console.log(e));


    // blog silinince onun içerisindeki yorumların isActive özelliği false dönebilir    


    fs.unlink("public" + blog.imageUrl, err => {
        if (err) {
            console.log(err)
        }
    })


    const query = `mutation DeleteBlog($deleteBlogId: ID!) {
        deleteBlog(id: $deleteBlogId)
      }`;

    const variables = {
        "deleteBlogId": blogId
    }


    graphqlFunctions.MutateBlog(query, variables).then(() => {

        res.redirect("/admin/blogs");

    }).catch(err => console.log(err));
}

exports.getEditBlog = (req, res, next) => {

    const blogId = req.body.blogId;

    graphqlFunctions.getBlogById(blogId).then(blog => {
        res.render("adminPages/edit-blog", {
            blog: blog,
            title: "Edit Page"
        })
    })

}

exports.postEditBlog = async (req, res, next) => {

    const blog = await Blog.findOne({ _id: req.body.blogId }).then(blog => {
        return blog
    }).catch(e => console.log(e))

    const content = req.body.blogContent;
    const title = req.body.blogTitle
    const file = req.file ? "/img/" + req.file.filename : blog.imageUrl;

    if (req.file) {
        fs.unlink("public" + blog.imageUrl, err => {
            if (err) {
                console.log(err)
            }
        })
    }

    editQuery = `
    mutation Mutation($input: editBlogInputs!) {
        editBlog(input: $input) {
          id
          title
          content
          imageUrl
        }
      }
    
    `

    variables = {
        "input": {
            "id": req.body.blogId,
            "title": title,
            "content": content,
            "imageUrl": file,
            "editorId": req.user._id,
            "editorName": req.user.username
        }
    };

    graphqlFunctions.MutateBlog(editQuery, variables).then(blog => {
        res.redirect("/admin/blogs");
    }).catch(err => console.log(err));

}

//Hata kontrolücü yazalım
exports.errorController = (error, res) => {
    // Biraz basit bir kontrolcü oldu ama üzerine sonra uğraşılabilir

    res.render("adminPages/add-blog", {
        title: "Add-Blog",
        errorMessage: `Hatalı bir işlem yaptınız`
    })
}


exports.postAcceptComment = async (req, res) => {

    const commentId = await req.body.commentId;

    const comment = await Comment.findById(commentId).then(comment => comment).catch(e => console.log(e));


    Blog.findById(comment.blogId).then(async blog => {

        const comments = blog.comments;
        comments.push({ commentId: comment._id });
        blog.comments = comments;
        return blog.save();

    })
        .then(() => {

            comment.isActive = true;
            return comment.save();

        })
        .then(async () => {

            await DeleteCommentNotificationFromAdmin(commentId);

            res.redirect("/notifications")

        })
        .catch(e => console.log(e));


    // Yorumun atıldığı bloğun comments kısmına bu yorumu ekle *****
    // yorumun isActive özelliği true olsun ***********
    // adminlerden bildirimi sil ***********
}


exports.postRejectComment = async (req, res) => {

    // bu yorumu ve tüm adminlerdeki bildirimi sil (bu yorumla alakalı olanları) ********

    const commentId = await req.body.commentId;

    Comment.findByIdAndDelete(commentId).then(async () => {

        await DeleteCommentNotificationFromAdmin(commentId);

        res.redirect("/notifications");
    }).catch(e => console.log(e));

}


exports.postdeleteComment = (req, res) => {
    // DB'den comments'den yorumu sil +++++
    // bloğun içinden yorumu sil +++++
    // Artık blog içerisinden yorumu silmiyoruz isActive özelliğini değiştiriyoruz

    // Blog.findById(blogId).then(async blog=>{
    //     const comments = blog.comments;
    //     const index = await comments.findIndex(comment=>{
    //         return comment.commentId.toString() === commentId.toString()
    //     })
    //     comments.splice(index,1);
    //     blog.comments = comments;
    //     return blog.save()

    // }).then(()=>{
    // }).catch(e=>console.log(e));

    const commentId = req.body.commentId;

    Comment.findByIdAndUpdate(commentId, { isActive: false }).then(() => {

        res.redirect("back");

    }).catch(e => console.log(e));

}

exports.postWarnUser = (req,res) =>{

    const warnedUserId = req.body.warnedUserId;
    
    User.findById(warnedUserId).then(async user=>{
        
        user.warnings += 1;
        
        if(user.warnings >= 3){
            user.warnings += 1;

            user.isBlocked = true;
            
            if(user.referrerNumber != 111111){
                User.findOne({referenceNumber : user.referrerNumber}).then(async rUser=>{
                    const notifications = await rUser.notifications;
                    await notifications.push({type : "warning" , content : `${new Date().toUTCString()} tarihinde ${user.username} isimli referans verdiğiniz kullanıcı bloke edilmiştir`});
                    rUser.notifications = notifications;
                    rUser.save();

                    // referrer olan kullanıcıya da warnings verilebilir

                }).catch(e=>console.log(e));
            }
            
            return user.save(); 
        }

        const notifications = await user.notifications;
        await notifications.push({type : "warning" , content : `${new Date().toUTCString()} tarihinde bir uyarı aldınız`});
        user.notifications = notifications;
        return user.save();

    }).then(()=>{

        res.redirect("back");

    })

}

exports.getLogs = (req,res) => {

    graphqlFunctions.getLogs().then(logs=>{

        res.render("adminPages/logs",{
            title:"Logs",
            logs:logs
        })
    })
    

    
}

exports.postUnblockUser = (req,res)=>{

    const userId = req.body.userId

    User.findById(userId).then(user=>{

        user.isBlocked = false;
        user.warnings = 0;
        
        return user.save();

    }).then(()=>{

        res.redirect("back");    
    
    }).catch(e=>console.log(e));

}
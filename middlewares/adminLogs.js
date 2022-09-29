const Log = require("../models/adminLog");
const graphqlFunctions = require("../GraphQL/graphqlFunctions");

module.exports = async (req, res, next) => {

    const adminUsername = await req.user.username;
    const url = await req.originalUrl.split("/")[2]; // [2] yapılan işlemi bize verecektir
    console.log(url)

    if (url == "add-blog") {
        const blogTitle = await req.body.blogTitle
        content = `${adminUsername} '${blogTitle}' isimli bloğu ekledi`
    }
    else if (url == "delete-blog") {
        const blogId = await req.body.blogId
        const title = await bloggraphqlFunctions.getBlogById(blogId).then(blog => blog.title).catch(e => console.log(e));
        content = `${adminUsername} '${title}' isimli bloğu kaldırdı`
    }
    else if (url == "edit-blog") {
        const blogTitle = await req.body.blogTitle
        content = `${adminUsername} '${blogTitle}' isimli bloğu güncelledi`
    }
    else if (url == "acceptComment") {
        const commentPublisher = await req.body.commentPublisher
        content = `${adminUsername} '${commentPublisher}' isimli kişininin yorumunu kabul etti`
    }
    else if (url == "rejectComment") {
        const commentPublisher = await req.body.commentPublisher
        content = `${adminUsername} '${commentPublisher}' isimli kişininin yorumunu redetti`
    }
    else if (url == "deleteComment") {
        const commentId = await req.body.commentId
        content = `${adminUsername} '${commentId}' id'li yorumu kaldırdı`
    } else if (url == "warnUser") {
        const userId = await req.body.warnUser
        content = `${adminUsername} '${userId}' id'li kişiyi 1 kez uyardı`
    } else if (url == "unblockUser") {
        const userId = await req.body.userId
        content = `${adminUsername} '${userId}' id'li kişinin erişim engelini kaldırdı`
    }

    const log = new Log({
        user: adminUsername,
        content: content
    });

    log.save().then(() => {

        console.log(`'${content}' başarıyla database'e loglandı `);

        next();

    })

}
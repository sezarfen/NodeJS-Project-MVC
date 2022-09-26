const graphqlFunctions = require("../GraphQL/graphqlFunctions");
const bcrypt = require('bcrypt');
const Login = require("../models/Login");
const User = require("../models/User");

exports.postRegister = (req, res) => {
    const referrerNumber = req.body.referrerNumber ? req.body.referrerNumber : "111111";

    const query = `mutation Mutation($input: addUserInput!) {
        addUser(input: $input) {
        id
        fullname
        username
        email
        password
        isAdmin
        adress
        ability
        phoneNumber
        }
      }`;


    const variables = {
        "input": {
            "fullname": req.body.fullName,
            "username": req.body.userName,
            "email": req.body.userEmail,
            "password": req.body.userPassword,
            "adress": req.body.userAdress,
            "ability": req.body.userAbility,
            "phoneNumber": req.body.userPhone,
            "referrerNumber": referrerNumber
        }
    };

    graphqlFunctions.MutateBlog(query, variables)
        .then((response) => {
            console.log(response.data.data.addUser);
            res.redirect("/login");
        })
        .catch(err => console.log(err));


}

exports.getRegister = (_, res) => {

    res.render("account/register", {
        title: "Register"
    });

}

exports.getLogin = (req, res) => {

    delete req.session.errorMessage

    res.render("account/login", {

        title: "Login",

    });

}

exports.postLogin = (req, res) => {

    const email = req.body.userEmail;
    const password = req.body.userPassword;


    const login = new Login({
        email: email,
        password: password
    })

    login.validate()
        .then(() => {

            User.findOne({ email: email }).then(user => {
                if (!user) {
                    req.session.errorMessage = "Eposta ile bağdaşan bir kullanıcı bulunamadı";
                    return res.redirect("/login")

                }

                bcrypt.compare(password, user.password).then( isTrue => {
                    if (!isTrue) {
                        return req.session.errorMessage = "Hatalı ya da eksik şifre"
                    }

                    req.session.user = user;
                    
                    return res.redirect("/");

                })


            }).catch(err => {
                console.log(err);
            })

        }).catch(err => {

            if (err.errors.email) {
                req.session.errorMessage = err.errors.email.properties.message
                res.redirect("/login");
            } else if (err.errors.password) {
                req.session.errorMessage = err.errors.password.properties.message
                res.redirect("/login");
            }

        })


}

exports.getLogout = (req, res) => {

    delete req.session.user;
    
    res.redirect("/");

}

exports.getNotifications = async (req, res) => {

    const notifications = await req.user.notifications;
    const referenceNotifications = await notifications.filter(notification=>notification.type=="reference") 
    const commentNotifications = await notifications.filter(notification=>notification.type=="comment") 

    

    console.log(commentNotifications)

    res.render("account/notifications", {
        title: "Notifications",
        notifications: notifications,
        referenceNotifications : referenceNotifications,
        commentNotifications : commentNotifications
    });

}

exports.postAcceptRequest = (req, res) => {

    User.findById(req.body.subUserId).then(subUser => {
        subUser.referrerNumber = req.user.referenceNumber;
        subUser.save().then(() => {

            const subUsers = req.user.subUsers;
            return subUsers

        }).then(subUsers => {

            subUsers.push(req.body.subUserId);
            req.user.subUsers = subUsers;

            return req.user.save();

        }).then(() => {
            const userNotifs = req.user.notifications;
            const index = userNotifs.findIndex(notification => {
                return notification.id.toString() === req.body.subUserId.toString()
            })

            userNotifs.splice(index, 1)
            return userNotifs

        }).then((userNotifs) => {
            req.user.updateOne({ _id: req.user._id }, {
                notifications: userNotifs
            })
            return req.user.save();

        })
            .then(() => { res.redirect("/notifications") })
            .catch(err => console.log(err));


    }).catch(err => console.log(err));

}

exports.postRejectRequest = (req, res) => {

    const userNotifs = req.user.notifications;
    const index = userNotifs.findIndex(notification => {
        return notification.id.toString() === req.body.subUserId.toString()
    })

    userNotifs.splice(index, 1)

    req.user.updateOne({ _id: req.user._id }, {
        notifications: userNotifs
    }).then(() => {
        return req.user.save();
    }).then(() => { res.redirect("/notifications") })
        .catch(err => console.log(err));

}

exports.getSubUsers = (req, res, next) => {

    // 2 SAAT ASYNC OLAYLARIYLA UĞRAŞTIKRAN SONRA SİNİRLENİLİP setTimeout KULLANILMIŞTIR İLERİDE DÜZELTİLİR 

    const subUsers = [];


    req.user.subUsers.forEach(subUser => {
        User.find({ _id: subUser._id }).then(user => {
            subUsers.push(user[0]);
        });
    })

    setTimeout(() => {
        res.render("account/subUsers", {

            title: "SubUsers",
            subUsers: subUsers

        })
    }, 500)


}

exports.postContectUser = (req, res) => {
    // Bir ileriki aşamada yapılabilir
}

exports.postDeleteSubUser = (req, res) => {

    const subUsers = req.user.subUsers;

    const index = subUsers.findIndex(subUser => {
        return subUser._id.toString() === req.body.subUserId.toString()
    })
    subUsers.splice(index, 1);


    User.findByIdAndUpdate(req.user._id, {
        subUsers: subUsers
    }).then(() => {

        User.findByIdAndUpdate(req.body.subUserId, {
            referrerNumber: 111111

        }).then(() => {

            res.redirect("/subUsers")

        }).catch(e => console.log(e))
    })
        .catch(e => console.log(e))

}

exports.getProfile = async (req, res) => {
    delete req.session.errorMessage

    User.findOne({referenceNumber : req.user.referrerNumber}).then(user=>{


        res.render("account/profile", { 
            title: "Profile Page",
            user: req.user,
            currentUser: req.user,  // locals'a eklenebilir
            isFollowed: [],
            referrer: user
            
        })
    

    }).catch(e=>console.log(e))

}

exports.getReferenceAgain = async (req, res) => {
    
    await User.findOne({ referenceNumber: req.body.newReferenceNumber }).then(user => {
        if (user) {

            const notifications = user.notifications ? user.notifications : [];
            const subUsers = user.subUsers ? user.subUsers : [];

            if(subUsers.filter(user=>user._id.toString()===req.user._id.toString()).length > 0){  // içerip içermediğini burada kontrol ediyoruz // güzel bir algoritma

                console.log("You have one :D")

                return req.session.errorMessage = "You already have a reference from that person";

            }
            else{

                console.log("You don't have one :(")

                notifications.push({
                    type: "reference",
                    id: req.body.userId,
                    username: req.body.username,
                });

                user.notifications = notifications;
                user.createdAt = user.createdAt;  // createdAt değişmesin diye yaptım
                return user.save();

            }
            
        }
    });

    res.redirect("/profile");


}

exports.getSpecificProfile = async (req, res ,next) => {

    const username = req.params.username;
    User.findOne({ username: username }).then(async user => {

        let isFollowed = await req.user.following.filter(id => {
            return user._id == id
        })

        User.findOne({referenceNumber: user.referrerNumber}).then(referrer=>{
            res.render("account/profile", {
                user: user,
                title: `${username}'s Profile`,
                currentUser: req.user,
                isFollowed: isFollowed,
                referrer: referrer
            });
        }).catch(e=>console.log(e));

        

    }).catch(e => next("404 Profile Not Found"));


}

exports.postFollowUser = (req, res) => {
    const followingId = req.body.followingId;

    var followQuery = `
    mutation FollowUser($input: followUserInput!) {
        followUser(input: $input)
      }
    `
    var variables = {
        "input": {
            "currentUserId": req.user._id,
            "followingId": followingId
        }
    }


    graphqlFunctions.MutateBlog(followQuery, variables).then(() => {

        res.redirect(`back`)

    }).catch(e => console.log(e));



}

exports.postUnfollowUser = (req, res) => {
    const unfollowId = req.body.unfollowId;

    var unfollowQuery = `
    mutation Mutation($input: unfollowUserInput!) {
        unfollowUser(input: $input)
      }
    `
    var variables = {
        "input": {
            "currentUserId": req.user._id,
            "unfollowId": unfollowId
        }
    }


    graphqlFunctions.MutateBlog(unfollowQuery, variables).then(() => {

        
        res.redirect(`back`)


    }).catch(e => console.log(e));

}

exports.getFollowers = async (req,res)=>{

    const followersList = req.user.followers;

    const followers = [];

    await followersList.forEach(userId =>{
        User.findById(userId)
        .then(user=>{
            followers.push(user);
        }).catch(e=>console.log(e));
    });




}
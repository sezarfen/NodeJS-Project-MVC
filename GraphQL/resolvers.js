const Blog = require("../models/Blog");
const User = require("../models/User");
const bcrypt = require('bcrypt');
const adminLog = require("../models/adminLog");
const { AuthenticationError } = require("apollo-server");

const resolvers = {

    Query: {
        blogs: async (_, __, context) => {
            // console.log('adana merkez patlıyor herkes');  // Enes Pazar abiye selamlar :D

            if (await context.isAuthenticated()) {  // await ile almazsam promise dönüyor ve istenilen mantığa ulaşamıyoruz
                return Blog.find().then(blogs => blogs).catch(err => console.log(err));
            } else {
                throw new AuthenticationError("Please Check Your API_KEY");
            }

        },

        blog: async (parent, args, context) => {
            if (await context.isAuthenticated()) {
                return Blog.findById(args.id).then(blog => blog).catch(err => console.log(err));
            } else {
                throw new AuthenticationError("Please Check Your API_KEY");
            }
        },

        users: async (_, __, context) => {

            if (await context.isAuthenticated()) {

                return User.find().then(users => {
                    return users.map(user => {
                        user.id = user._id;
                        return user
                    })
                }).catch(err => console.log(err));

            } else {
                throw new AuthenticationError("Please Check Your API_KEY");
            }
        },

        logs: () => {
            return adminLog.find().then(logs => logs).catch(e => console.log(e));
        }

    },

    Mutation: {
        addBlog: async (parent, args) => {
            const blog = new Blog({
                title: args.input.title,
                content: args.input.content,
                imageUrl: args.input.imageUrl,
                editorId: args.input.editorId,
                editorName: args.input.editorName
            });

            await blog.save().then((data) => { console.log(data) })
                .catch(error => { throw new Error() });

            return blog;
        },

        editBlog: async (parent, args) => {

            return await Blog.findById(args.input.id).then(async (blog) => {
                blog.title = args.input.title;
                blog.content = args.input.content;
                blog.imageUrl = args.input.imageUrl;
                blog.editorId = args.input.editorId;

                await blog.save()

                return blog
            }).catch(err => console.log(err));

        },

        deleteBlog: async (_, args) => {
            await Blog.findByIdAndDelete(args.id).then(result => {
                console.log(result);
            }).catch(err => console.log(err));

            return "Blog başarıyla silindi";
        },

        addUser: (parent, args) => {
            const password = args.input.password;

            return bcrypt.hash(password, 10).then(async hashedPassword => {

                const newUser = User({
                    fullname: args.input.fullname,
                    username: args.input.username,
                    email: args.input.email,
                    password: hashedPassword,
                    adress: args.input.adress,
                    ability: args.input.ability,
                    phoneNumber: args.input.phoneNumber,
                    createdAt: new Date().toUTCString(),
                });

                User.findOne({ referenceNumber: args.input.referrerNumber }).then(user => {
                    if (user) {
                        const notifications = user.notifications ? user.notifications : [];
                        notifications.push({
                            type: "reference",
                            id: newUser._id,
                            username: newUser.username,
                        });
                        user.notifications = notifications;
                        return user.save();
                    }

                })

                await newUser.save();

                return newUser
            }).catch(err => console.log(err));

        },

        followUser: (_, args) => {

            User.findById(args.input.currentUserId).then(async user => {

                const following = user.following;
                await following.push(args.input.followingId);
                user.following = following;
                user.save().then(() => {
                    User.findById(args.input.followingId).then(async user2 => {
                        const followers = user2.followers;
                        await followers.push(args.input.currentUserId);
                        user2.followers = followers;
                        user2.save();
                    })
                })

            }).catch(e => console.log(e));

            return "İşlemler başarılı"

        },

        unfollowUser: (_, args) => {

            User.findById(args.input.currentUserId).then(async user => {

                const following = user.following;

                const index = await following.findIndex(id => {
                    return id == args.input.unfollowId
                })

                following.splice(index, 1);

                user.following = following;

                user.save().then(() => {

                    User.findById(args.input.unfollowId).then(async user2 => {

                        const followers = user2.followers;

                        const index = await followers.findIndex(id => {
                            return id == args.input.currentUserId;
                        })

                        followers.splice(index, 1);

                        user2.followers = followers;

                        user2.save();

                    }).catch(e => console.log(e));

                }).catch(e => console.log(e));

            }).catch(e => console.log(e));

            return "İşlemler başarılı";

        },


    },


}

module.exports = { resolvers };
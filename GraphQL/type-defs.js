const {gql} = require("apollo-server");


const typeDefs = gql`

    type Blog{
        id: ID!
        title: String!
        content: String!
        imageUrl: String!
        editorId: ID!
        comments: [Comment!]
    }

    type Comment{
        id: ID!
        publisherName: String!
        publisherId: ID!
        commentId: ID!
        content: String!
        postedAt: String
    }

    type User{
        id: ID!
        fullname: String!
        username: String!
        email: String!
        password: String!
        isAdmin: Boolean!
        adress: String!
        ability: String!
        phoneNumber: String!
        createdAt: String!
        following: [ID!]
        followers: [ID!]
        subUsers: [subUser!]
        referenceNumber: ID!
        referrerNumber: ID!
        notifications: [subUser]
    }

    type subUser{
        id: ID!
    }

    type Query{
        blogs: [Blog!]!
        blog(id: ID!): Blog!
        users: [User!]!
    }

    input addBlogInputs{
        title: String!
        content: String!
        imageUrl: String = "https://via.placeholder.com/262x174"
        editorId: ID!
    }

    input editBlogInputs{
        id: ID!
        title: String!
        content: String!
        imageUrl: String = "https://via.placeholder.com/262x174"
        editorId: ID!
    }

    input addUserInput{
        fullname: String!
        username: String!
        email: String!
        password: String!
        adress: String!
        ability: String!
        phoneNumber: String!
        referrerNumber: ID = 111111
        createdAt: String
    }

    input followUserInput{
        currentUserId: ID!
        followingId: ID!

    }
    input unfollowUserInput{
        currentUserId: ID!
        unfollowId: ID!
    }

    type Mutation{
        addBlog(input: addBlogInputs!): Blog
        editBlog(input: editBlogInputs!): Blog
        deleteBlog(id: ID!): String
        addUser(input: addUserInput!): User
        followUser(input: followUserInput!): String
        unfollowUser(input: unfollowUserInput!): String
    }


`

module.exports = {typeDefs};
const {gql} = require("apollo-server");

const typeDefs = gql`

    type Blog{
        id: ID!
        title: String!
        content: String!
        imageUrl: String!
        editorId: ID!
        editorName: String!
        comments: [Comment!]
    }

    type Comment{
        id: ID!
        commentId: ID!
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
        warnings: Int!
        isBlocked: Boolean!
    }

    type subUser{
        id: ID!
    }

    type Log{
        id: ID!
        user: String!
        content: String!
        date: String!
    }

    input addBlogInputs{
        title: String!
        content: String!
        imageUrl: String = "https://via.placeholder.com/262x174"
        editorId: ID!
        editorName: String!
    }

    input editBlogInputs{
        id: ID!
        title: String!
        content: String!
        imageUrl: String = "https://via.placeholder.com/262x174"
        editorId: ID!
        editorName: String!
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
        warnings: Int = 0
        isBlocked: Boolean = false
    }

    input followUserInput{
        currentUserId: ID!
        followingId: ID!

    }
    input unfollowUserInput{
        currentUserId: ID!
        unfollowId: ID!
    }

    type Query{
        blogs: [Blog!]!
        blog(id: ID!): Blog!
        users: [User!]!
        logs: [Log!]
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
const axios = require("axios");

exports.getBlogs = async () => {

    blogsQuery = `
    query Blogs {
        blogs {
          id
          title
          content
          imageUrl
          editorId
        }
      }
    
    `

    const endpoint = "http://localhost:4000/graphql";
    const headers = {
        "content-type": "application/json",
    };
    const graphqlQuery = {
        "query": blogsQuery,
    };

    const response = await axios.post(endpoint, graphqlQuery, {
        method: 'post',
        headers: headers,
    });

    return response.data.data.blogs; // data

}

exports.getBlogById = async (id) => {  // Bunu da MutateBlog'a aktarabiliriz

    blogQuery = `
    query Blog($blogId: ID!) {
        blog(id: $blogId) {
          id
          title
          content
          imageUrl
          editorId
          comments{
            id
            publisherId
            commentId
            content
            postedAt
            publisherName
          }
        }
      }
    
    `

    const endpoint = "http://localhost:4000/graphql";
    const headers = {
        "content-type": "application/json",
    };
    const graphqlQuery = {
        "query": blogQuery,
        "variables": {
            "blogId": id
          }
    };

    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });

    return response.data.data.blog; // data

}

exports.MutateBlog = async (query,variables) =>{

    const endpoint = "http://localhost:4000/graphql";
    
    const headers = {
        "content-type": "application/json",
    };

    const graphqlQuery = {
        "query": query,
        "variables": variables
    };

    const response = await axios({
        url: endpoint,
        method: 'post',
        headers: headers,
        data: graphqlQuery
    });

    return response;  // controllerlarda response üzerinden işlem yapılacaksa yaparız
}


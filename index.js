const {ApolloServer, gql} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
// const {nanoid} = require('nanoid');
const uid = function(){ return Date.now().toString(36) + Math.random().toString(36).substr(2); }

const {users, posts, comments} = require('./data')

const typeDefs = gql`
    # User
    type User {
        id: ID!
        fullName: String!
        age: Int!
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    input CreateUserInput {
        fullName: String!
        age: Int!
    }
    
    input UpdateUserInput {
        fullName: String
        age: Int
    }
    
    # Post
    type Post {
        id: ID!
        title: String!
        user_id: ID!
        user: User!
        comments: [Comment!]!
    }
    
    input CreatePostInput {
        title: String!, 
        user_id: ID!
    }
    
    input UpdatePostInput {
        title: String, 
        user_id: ID
    }
    
    # Comment
    type Comment {
        id: ID!
        text: String!
        post_id: ID!
        user: User!
        post: Post!
    }
    
    input CreateCommentInput {
        text: String!, 
        post_id: ID!, 
        user_id: ID!
    }
    
    input UpdateCommentInput {
        text: String, 
        post_id: ID, 
        user_id: ID
    }
    
    
    type DeleteAllOutput {
        count: Int!
    }
    
    type Query {
        # user
        users: [User!]!
        user(id: ID!): User!
        
        # post
        posts: [Post!]!
        post(id: ID!): Post!
        
        # comment
        comments: [Comment!]!
        comment(id: ID!): Comment!
    }
    
    type Mutation {
        # User
        createUser(data: CreateUserInput!): User!
        updateUser(id: ID!, data: UpdateUserInput!): User!
        deleteUser(id: ID!): User!
        deleteAllUsers: DeleteAllOutput!
        
        # Post
        createPost(data: CreatePostInput!): Post!
        updatePost(id: ID!, data: UpdatePostInput!): Post!
        deletePost(id: ID!): Post!
        deleteAllPosts: DeleteAllOutput!
        
        # Comment
        createComment(data: CreateCommentInput!): Comment!
        updateComment(id: ID!, data: UpdateCommentInput!): Comment!
        deleteComment(id: ID!): Comment!
        deleteAllComments: DeleteAllOutput!
    }
`;

const resolvers = {
    Mutation: {
        // create islemlerinde data'dan veri cekerken farklı yontemler gosterildi

        // User
        createUser: (parent, {data}) => {
            const user = {
                id: uid(),
                fullName: data.fullName,
            }
            users.push(user)

            return user
        },
        updateUser: (parent, {id, data}) => {
            const user_index = users.findIndex((user) => user.id === id)
            if (user_index === -1) {
                throw new Error("User not found")
            }
            const updated_user = (users[user_index] = {
                ...users[user_index],
                ...data,
            })
            return updated_user
        },
        deleteUser: (parent, {id}) => {
            const user_index = users.findIndex((user) => user.id === id)
            if (user_index === -1){
                throw new Error("User not found")
            }
            const deleted_user = users[user_index]

            // ilk parametre hangi index değerinden sonra silme işlemi yapılacağını belirtir
            // ikinci parametre kaç index silineceğini belirtir
            users.splice(user_index, 1)

            return deleted_user
        },
        deleteAllUsers: () => {
            const length = users.length
            users.splice(0, length)
            return {count: length}
        },

        // Post
        createPost: (parent, {data: {title, user_id}}) => {
            const post = {
                id: uid(),
                title,
                user_id,
            }
            posts.push(post)

            return post
        },
        updatePost: (parent, {id, data}) => {
            const post_index = posts.findIndex((post) => post.id === id)
            if (post_index === -1){
                throw new Error("Post not found")
            }
            const updated_post = (posts[post_index] = {
                ...posts[post_index],
                ...data,
            })
            return updated_post
        },
        deletePost: (parent, {id}) => {
            const post_index = posts.findIndex((post) => post.id === id)
            if (post_index === -1){
                throw new Error("Post not found")
            }
            const deleted_post = posts[post_index]
            posts.splice(post_index,1)
            return deleted_post
        },
        deleteAllPosts: () => {
            const length = posts.length
            posts.splice(0, length)
            return {count:length}
        },

        // Comment
        createComment: (parent, {data}) => {
            const comment = {
                id: uid(),
                ...data
            }
            comments.push(comment)

            return comment
        },
        updateComment: (parent, {id, data}) => {
            const comment_index = comments.findIndex((comment) => comment.id === id)
            if (comment_index === -1){
                throw new Error("Comment not found")
            }
            const updated_comment = (comments[comment_index] = {
                ...comments[comment_index],
                ...data,
            })
            return updated_comment
        },
        deleteComment: (parent, {id}) => {
            const comment_index = comments.findIndex((comment) => comment.id === id)
            if (comment_index === -1){
                throw new Error("Comment not found")
            }
            const deleted_comment = comments[comment_index]
            comments.splice(comment_index, 1)
            return deleted_comment
        },
        deleteAllComments: () => {
            const length = comments.length
            comments.splice(0, length)
            return {count: length}
        },
    },

    Query: {
        // user
        users: () => users,
        user: (parent, args) => {
            const user = users.find((user) => user.id === args.id)
            if(!user) {
                return new Error('User not found')
            }
            return user
        },

        // post
        posts: () => posts,
        post: (parent, args) => posts.find((post) => post.id === args.id),

        // comment
        comments: () => comments,
        comment: (parent, args) => comments.find((comment) => comment.id === args.id)
    },

    User: {
        posts: (parent) => posts.filter((post) => post.user_id === parent.id),
        comments: (parent) => comments.filter((comment) => comment.user_id === parent.id),
    },

    Post: {
        user: (parent) => users.find((user) => user.id === parent.user_id),
        comments: (parent) => comments.filter((comment) => comment.post_id === parent.id)
    },

    Comment: {
        user: (parent) => users.find((user) => user.id === parent.user_id),
        post: (parent) => posts.find((post) => post.id === parent.post_id)
    }
};

const server = new ApolloServer({
    typeDefs,
    resolvers,
    plugins: [ApolloServerPluginLandingPageGraphQLPlayground({})],
})

server.listen().then(({url}) => console.log(`Apollo servers is up ${url}`))
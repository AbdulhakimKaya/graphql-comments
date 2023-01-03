const {ApolloServer, gql} = require('apollo-server');
const {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core')

const {users, posts, comments} = require('./data')

const typeDefs = gql`
    type User {
        id: ID!
        fullName: String!
        posts: [Post!]!
        comments: [Comment!]!
    }
    
    type Post {
        id: ID!
        title: String!
        user_id: ID!
        user: User!
        comments: [Comment!]!
    }
    
    type Comment {
        id: ID!
        text: String!
        post_id: ID!
        user: User!
        post: Post!
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
`;

const resolvers = {
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
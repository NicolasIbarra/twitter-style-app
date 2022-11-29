const { ApolloServer } = require("apollo-server");
const MONGOOSE = require("mongoose");
const gql = require("graphql-tag");

const { MONGODB } = require("./config.js");
const POST = require("./models/Post.js");
const USER = require("./models/User.js");

/** GraphQL actions */
const TYPEDEFS = gql`
  type Post {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
  }
  type Query {
    getPosts: [Post]
  }
`;
/** GraphQL actions code to execute */
const RESOLVERS = {
  Query: {
    async getPosts() {
      try {
        const POSTS = await POST.find();
        return POSTS;
      } catch (error) {
        throw new Error(error);
      }
    },
  },
};
/** Setting up Apollo server */
const SERVER = new ApolloServer({
  typeDefs: TYPEDEFS,
  resolvers: RESOLVERS,
});

/* Connecting to database and listening to the server. Once done, it can be runned by typing "node index" */
MONGOOSE.connect(MONGODB, { useNewUrlParser: true })
  .then(() => {
    console.log("MongoDB successfully connected!");
    return SERVER.listen({ port: 5000 });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
  });

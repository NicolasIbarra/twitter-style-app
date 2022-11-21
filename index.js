const { ApolloServer } = require("apollo-server");
const MONGOOSE = require("mongoose");
const gql = require("graphql-tag");

const { MONGODB } = require("./config.js");

/** GraphQL actions */
const TYPEDEFS = gql`
  type Query {
    sayHi: String!
  }
`;
/** GraphQL actions code to execute */
const RESOLVERS = {
  Query: {
    sayHi: () => "This is my first resolver!",
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

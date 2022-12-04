const { ApolloServer } = require("apollo-server");
const MONGOOSE = require("mongoose");

const { MONGODB } = require("./config.js");
const TYPEDEFS = require("./graphql/typeDefs");
const RESOLVERS = require ("./graphql/resolvers");

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

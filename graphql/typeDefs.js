const { gql } = require("apollo-server");

/** GraphQL types */
module.exports = gql`
  type Post {
    id: ID!
    body: String!
    userName: String!
    createdAt: String!
  }
  type User {
    id: ID!
    userName: String!
    email: String!
    createdAt: String!
    token: String!
  }
  # This is an input type for receiving params
  input RegisterInput {
    userName: String!
    password: String!
    confirmPassword: String!
    email: String!
  }
  # This type is for getting info from the database
  type Query {
    getPosts: [Post]
  }
  # This type is for making changes in the database
  type Mutation {
    # This is a register function with a registerInput param of type RegisterInput and a return value of type User
    register(registerInput: RegisterInput): User!
  }
`;

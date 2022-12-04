const BCRYPT = require("./bcrypt");
const JWT = require("./jsonwebtoken");

const USERSMODEL = require("../../models/User");

module.exports = {
  Mutation: {
    // Parent param refers to the others resolvers results, in case we have it.
    // The second param refers to the registerInput param from the typeDefs call.
    // Info param refers to some metadata.
    async registerUser(parent, { registerInput }, context, info) {
      try {
        const { userName, password, confirmPassword, email } = registerInput;

        // Hashing password. We need bcryptjs package.
        
        // Creating auth token. We need jsonwebtoken package.

        
      } catch (error) {
        throw new Error("Error in registerUser resolver: ", error);
      }
    },
  },
};

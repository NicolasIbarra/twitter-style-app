const BCRYPT = require("bcryptjs");
const JWT = require("jsonwebtoken");

const USERSMODEL = require("../../models/User");
const { SECRET_KEY } = require("../../config");

module.exports = {
  Mutation: {
    // Parent param refers to the others resolvers results, in case we have it.
    // The second param refers to the registerInput param from the typeDefs call.
    // Info param refers to some metadata.
    async registerUser(parent, { registerInput }, context, info) {
      let { userName, password, confirmPassword, email } = registerInput;

      // Hashing password. We need bcryptjs package.
      password = await BCRYPT.hash(password, 12);
      const NEWUSER = new USERSMODEL({
        userName,
        email,
        password,
        createdAt: new Date().toISOString(),
      });
      const RES = await NEWUSER.save();

      // Creating auth token. We need jsonwebtoken package.
      const token = JWT.sign(
        {
          id: RES.id,
          userName: RES.userName,
          email: RES.email,
        },
        SECRET_KEY,
        { expiresIn: "1h" }
      );

      return {
        ...RES._doc,
        id: RES._id,
        token,
      };
    },
  },
};

// function HashPassword(userName, password, confirmPassword, email){

// }

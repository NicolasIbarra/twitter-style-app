const BCRYPT = require("bcryptjs");
const JWT = require("jsonwebtoken");

const USERSMODEL = require("../../models/User");
const { SECRET_KEY } = require("../../config");

module.exports = {
  Mutation: {
    // Parent param refers to the others resolvers results, in case we have it.
    // The second param refers to the registerInput param from the typeDefs call.
    // Info param refers to some metadata.
    async RegisterUser(parent, { registerInput }, context, info) {
      let { userName, password, confirmPassword, email } = registerInput;

      // Hashing password. We need bcryptjs package.
      password = await HashPassword(password);
      // Instantiate a new user.
      const USER = InstantiateNewUser(registerInput);
      // Saving the new user in the database.
      const RESPONSE = await USER.save();
      // Creating auth token. We need jsonwebtoken package.
      const token = CreateToken(RESPONSE);

      return {
        ...RESPONSE._doc,
        id: RESPONSE._id,
        token,
      };
    },
  },
};

const HashPassword = async password => await BCRYPT.hash(password, 12);

const InstantiateNewUser = registerInput => {
  let { userName, password, email } = registerInput;
  const NEWUSER = new USERSMODEL({
    userName,
    email,
    password,
    createdAt: new Date().toISOString(),
  });
  return NEWUSER;
}

const CreateToken = RESPONSE => {
  const token = JWT.sign(
    {
      id: RESPONSE.id,
      userName: RESPONSE.userName,
      email: RESPONSE.email,
    },
    SECRET_KEY,
    { expiresIn: "1h" }
  );
  return token;
}
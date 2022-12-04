const BCRYPT = require("bcryptjs");
const JWT = require("jsonwebtoken");
const {UserInputError} = require("apollo-server");

const USERSMODEL = require("../../models/User");
const { SECRET_KEY } = require("../../config");

module.exports = {
  Mutation: {
    // Parent param refers to the others resolvers results, in case we have it.
    // The second param refers to the registerInput param from the typeDefs call.
    // Info param refers to some metadata.
    async RegisterUser(parent, { registerInput }) {
      let { userName, password, confirmPassword, email } = registerInput;
      // Verify the userName and email are not taken
      await VerifyUser(userName);
      await VerifyEmail(email);
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

const VerifyUser = async userName => {
  const existsUser = await USERSMODEL.findOne({ userName });
  if(existsUser){
    throw new UserInputError("Username already taken", {
      errors: {
        userName: "This username is already taken. Please choose another."
      }
    })
  }
}

const VerifyEmail = async email => {
  const existsEmail = await USERSMODEL.findOne({ email });
  if(existsEmail){
    throw new UserInputError("Email already taken", {
      errors: {
        email: "This email is already taken. Please choose another."
      }
    })
  }
}
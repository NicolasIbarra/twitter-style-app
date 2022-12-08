const BCRYPT = require("bcryptjs");
const JWT = require("jsonwebtoken");

const USERSMODEL = require("../../models/User");
const { SECRET_KEY } = require("../../config");
const { 
  ValidateRegistrationUsername,
  ValidateLoginUsername,
  ValidateLoginPassword,
  ValidatePassword, 
  ValidateEmail 
} = require("../../util/Validators");

module.exports = {
  Mutation: {
    // Parent param refers to the others resolvers results, in case we have it.
    // The second param refers to the registerInput param from the typeDefs call.
    async RegisterUser(parent, { registerInput }) {
      let { userName, password, confirmPassword, email } = registerInput;
      // Validate user info
      await ValidateRegistrationUsername(userName, "register");
      ValidatePassword(password, confirmPassword);
      await ValidateEmail(email);
      // Hashing password. We need bcryptjs package.
      password = await HashPassword(password);
      // Instantiate a new user.
      const USER = InstantiateNewUser(userName, password, email);
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
    
    async LoginUser(parent, {userName, password}) {
      await ValidateLoginUsername(userName, "login");
      const user = await ValidateLoginPassword(userName, password);
      const token = CreateToken(user);
      return {
        ...user._doc,
        id: user._id,
        token,
      };
    }
  },
};

const HashPassword = async password => await BCRYPT.hash(password, 12);
const InstantiateNewUser = (userName, password, email) => {
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
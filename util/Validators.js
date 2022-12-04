const { UserInputError } = require("apollo-server");
const USERSMODEL = require("../models/User");

module.exports.ValidateUsername = async (userName) => {
  await ValidateExistingUsername(userName);
};

module.exports.ValidateEmail = async (email) => {
  const existsEmail = await USERSMODEL.findOne({ email });
  if (existsEmail) {
    throw new UserInputError("Email already taken", {
      errors: {
        email: "This email is already taken. Please choose another.",
      },
    });
  }
};

const ValidateExistingUsername = async (userName) => {
  const existsUser = await USERSMODEL.findOne({ userName });
  if (existsUser) {
    throw new UserInputError("Username already taken", {
      errors: {
        userName: "This username is already taken. Please choose another.",
      },
    });
  }
};

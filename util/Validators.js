const { UserInputError } = require("apollo-server");
const USERSMODEL = require("../models/User");

module.exports.ValidateUsername = async (userName) => {
  ValidateEmptyUsername(userName);
  await ValidateExistingUsername(userName);
};

module.exports.ValidateEmail = async (email) => {
  ValidateEmptyEmail(email);
  ValidateEmailFormat(email);
  await ValidateExistingEmail(email);
};

module.exports.ValidatePassword = (password, confirmPassword) => {
  ValidateEmptyPassword(password);
  ValidateSamePassword(password, confirmPassword);
};

const ValidateExistingUsername = async (userName) => {
  const existsUser = await USERSMODEL.findOne({ userName });
  if (existsUser) {
    throw new UserInputError("Username already taken", {
      error: {
        userName: "This username is already taken. Please choose another",
      },
    });
  }
};

const ValidateEmptyUsername = (userName) => {
  if (userName.trim() === "") {
    throw new UserInputError("Empty field", {
      error: {
        userName: "You must enter a username",
      },
    });
  }
};

const ValidateExistingEmail = async (email) => {
  const existsEmail = await USERSMODEL.findOne({ email });
  if (existsEmail) {
    throw new UserInputError("Email already taken", {
      error: {
        email: "This email is already taken. Please choose another",
      },
    });
  }
};

const ValidateEmptyEmail = (email) => {
  if (email.trim() === "") {
    throw new UserInputError("Empty field", {
      error: {
        email: "You must enter an email",
      },
    });
  }
};

const ValidateEmailFormat = (email) => {
  const regEx = /^([0-9a-zA-Z]([-.\w]*[0-9a-zA-Z])*@([0-9a-zA-Z][-\w]*[0-9a-zA-Z]\.)+[a-zA-Z]{2,9})$/;
  if (!email.match(regEx)) {
    throw new UserInputError("Incorrect email format", {
      error: {
        email: "You must enter a valid email address",
      },
    });
  }
};

const ValidateEmptyPassword = (password) => {
  if (password.trim() === "") {
    throw new UserInputError("Empty field", {
      error: {
        password: "You must enter a password",
      },
    });
  }
};

const ValidateSamePassword = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    throw new UserInputError("Password don't match", {
      error: {
        password: "The password must be the same in both fields",
      },
    });
  }
};

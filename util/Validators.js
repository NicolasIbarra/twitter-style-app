const BCRYPT = require("bcryptjs");
const { UserInputError } = require("apollo-server");
const USERSMODEL = require("../models/User");

module.exports.ValidateRegistrationUsername = async (userName, action) => {
  ValidateEmptyUsername(userName);
  await ValidateExistingUsername(userName, action);
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

module.exports.ValidateLoginUsername = async (userName, action) => {
  ValidateEmptyUsername(userName);
  await ValidateExistingUsername(userName, action);
}

module.exports.ValidateLoginPassword = async (userName, password) => {
  ValidateEmptyPassword(password);
  return await CompareLoginPassword(userName, password);
}

const CompareLoginPassword = async (userName, password) => {
  const user = await USERSMODEL.findOne({ userName });
  const match = ( password === user.password ) ? true : false ;
  
  if (!match) {
    throw new UserInputError("Incorrect password", {
      error: {
        password: "The password is incorrect",
      }
    })
  }
  return user;
}

const ValidateExistingUsername = async (userName, action) => {
  const existsUser = await USERSMODEL.findOne({ userName });
  if (action === "register") {
  if (existsUser) {
    throw new UserInputError("Username already taken", {
      error: {
        userName: "This username is already taken. Please choose another",
      },
    });
    }
  }
  if (action === "login") {
    if (!existsUser) {
      throw new UserInputError("Username not found", {
        error: {
          userName: "The entered username does not exists"
        }
      })
    }
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

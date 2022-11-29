/* This file is for creating and exporting Users model */

const { model, Schema } = require("mongoose");

const USERSCHEMA = new Schema({
  userName: String,
  password: String,
  email: String,
  createdAt: String,
});

module.exports = model("User", USERSCHEMA);

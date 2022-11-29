/* This file is for creating and exporting Post model */

const { model, Schema } = require("mongoose");

const POSTSCHEMA = new Schema({
  userName: String,
  body: String,
  createdAt: String,
  comments: [
    {
      userName: String,
      body: String,
      createdAt: String,
    },
  ],
  likes: [
    {
      userName: String,
      createdAt: String,
    },
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

module.exports = model("Post", POSTSCHEMA);



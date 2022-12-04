const POSTSMODEL = require("../../models/Post");

module.exports = {
  Query: {
    async getPosts() {
      try {
        const POSTS = await POSTSMODEL.find();
        return POSTS;
      } catch (error) {
        throw new Error("Error in getPosts resolver: ", error);
      }
    },
  },
};

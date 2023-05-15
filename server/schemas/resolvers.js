const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");

const resolvers = {
  Query: {
    // Check if user is authenticated to retrieve user data (including their books) from user's ID
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );

        return userData;
      }

      throw new AuthenticationError("Please log in!");
    },
  },

  //Mutations:

    //addUser

    //login

    //saveBook

    //removeBook
};

module.exports = resolvers;
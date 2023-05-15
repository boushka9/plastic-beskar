const { AuthenticationError } = require("apollo-server-express");
const { User } = require("../models");
const { signToken } = require("../utils/auth");

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

  Mutation: {

    // Create user, pass in required user data as args
    addUser: async (parent, args) => {
        const user = await User.create(args);
        // After user is created, generate Auth token
        const token = signToken(user);
  
        // Return Auth token/new user objects
        return { token, user };
    },

    //login

    //saveBook

    //removeBook

  }
};

module.exports = resolvers;
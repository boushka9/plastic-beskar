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

    login: async (parent, { email, password }) => {
        // Find user by entered email
        const user = await User.findOne({ email });
  
        // If email isn't found
        if (!user) {
          throw new AuthenticationError('Incorrect credentials');
        }
  
        //Verify if password is correct
        const correctPass = await user.isCorrectPassword(password);
  
        // If PW incorrect
        if (!correctPass) {
          throw new AuthenticationError('Incorrect credentials');
        }
        
        // Create Auth toke once user is logged in
        const token = signToken(user);

        return { token, user };
    },

    saveBook: async (parent, { bookData }, context) => {
        // Find logged in user by their ID, update their array of books by adding new book to it (passed in object) and return updated document
        if (context.user) {
          const updatedUser = await User.findByIdAndUpdate(
            { _id: context.user._id },
            { $push: { savedBooks: bookData } },
            { new: true }
          );
  
          return updatedUser;
        }
        // Handle unauthorized access
        throw new AuthenticationError('Please log in to save a book!');
    },

    //removeBook

  }
};

module.exports = resolvers;
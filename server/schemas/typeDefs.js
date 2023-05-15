const { gql } = require("apollo-server-express");

const typeDefs = gql`
  // Define ways to modify data, : Auth will return the Auth object = ID token and corresponding user
  type Mutation {
    login(email: String!, password: String!): Auth
    addUser(username: String!, email: String!, password: String!): Auth
    saveBook(bookData: BookInput!): User
    removeBook(bookId: ID!): User
  }

  type User {
    _id: ID!
    username: String!
    email: String
    bookCount: Int
    savedBooks: [Book]
  }

  type Book {
    bookId: ID!
    authors: [String]
    description: String
    image: String
    link: String
    title: String!
  }

  // Ref by saveBook mutation
  input BookInput {
    authors: [String]
    description: String!
    bookId: String!
    image: String
    link: String
    title: String!
  }

  type Query {
    me: User
  }

  // Define Auth object returned from mutations
  type Auth {
    token: ID!
    user: User
  }
`;

module.exports = typeDefs;

const { ApolloServer } = require('apollo-server');

const mongoose = require('mongoose');
require('dotenv').config();

const typeDefs = require('./graphql/typedef.js');
const resolvers = require('./graphql/resolver.js');



//   type Employee {
//     _id: ID!
//     FirstName: String!
//     LastName: String!
//     Age: Int!
//     DateOfJoining: String!
//     Title: String!
//     Department: String!
//     EmployeeType: String!
//   }

//   type Query {
//     getEmployees: [Employee]!
//     getEmployee(id: ID!): Employee
//   }

//   type Mutation {
//     createEmployee(
//       FirstName: String!
//       LastName: String!
//       Age: Int!
//       DateOfJoining: String!
//       Title: String!
//       Department: String!
//       EmployeeType: String!
//     ): Employee

//     updateEmployee(
//         id: ID!
//         FirstName: String
//         LastName: String
//         Age: Int
//         DateOfJoining: String
//         Title: String
//         Department: String
//         EmployeeType: String
//       ): Employee
//   }
// `;
mongoose.connect(process.env.CONNECTION_STRING);




const server = new ApolloServer({typeDefs, resolvers})

server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});

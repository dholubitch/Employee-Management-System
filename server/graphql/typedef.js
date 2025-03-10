const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    name: String!
    email: String!
    password: String!
    role: String!
    token: String
  }

  type Employee {
    _id: ID!
    userId: ID! # Reference to User ID
    FirstName: String!
    LastName: String!
    Age: Int!
    Title: String!
    Department: String!
    EmployeeType: String!
    DateOfJoining: String!
  }

  type Query {
    getEmployees(limitValue: Int!, offset: Int!): [Employee]
    getEmployee(id: ID!): Employee
    searchEmployees(name: String!): [Employee] # Added back to match resolver
    filterEmployees(type: String!): [Employee] # Added to match resolver
  }

  type Mutation {
    register(name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): User
    
    # Admin Mutations
    createUser(name: String!, email: String!, password: String!, role: String!): User
    updateUserRole(userId: ID!, role: String!): User
    updateUserPassword(userId: ID!, newPassword: String!): User

    # HR Mutations
    createEmployee(
      FirstName: String!
      LastName: String!
      Age: Int!
      Title: String!
      Department: String!
      EmployeeType: String!
      DateOfJoining: String!
      email: String!
      password: String!
    ): Employee

    updateEmployee(
      id: ID!
      FirstName: String
      LastName: String
      Age: Int
      Title: String
      Department: String
      EmployeeType: String
      DateOfJoining: String
    ): Employee

    # Admin - Delete Employee
    deleteEmployee(id: ID!): String
  }
`;

module.exports = typeDefs;

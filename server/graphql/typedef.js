const { gql } = require('apollo-server');

const typeDefs = gql`
  type Employee {
    _id: ID!
    FirstName: String!
    LastName: String!
    Age: Int!
    DateOfJoining: String!
    Title: String!
    Department: String!
    EmployeeType: String!
  }

  type Query {
    getEmployees: [Employee]!
    getEmployee(id: ID!): Employee
    searchEmployees(name: String!):[Employee]!
  }

  type Mutation {
    createEmployee(
      FirstName: String!
      LastName: String!
      Age: Int!
      DateOfJoining: String!
      Title: String!
      Department: String!
      EmployeeType: String!
    ): Employee

    updateEmployee(
        id: ID!
        FirstName: String
        LastName: String
        Age: Int
        DateOfJoining: String
        Title: String
        Department: String
        EmployeeType: String
      ): Employee

      deleteEmployee(id: ID!): String
  }
`;

module.exports =typeDefs;
const Employee = require("../models/employees.js");

const moment = require("moment");

const resolvers = {
  Query: {
    getEmployees: async () => {
      return await Employee.find({});
    },
    getEmployee: async (_root, { id }) => {
      return await Employee.findById(id);
    },
    searchEmployees: async (_root, args) => {
        const name = args.name;
        console.log(name);
        if (!name) {
          return 0;
        }
  
        const Employees = await Employee.find({"FirstName":{$regex: name, $options: 'i'}});
  console.log(Employees);
        if(!Employees){
          throw new Error("Employee not found");
        }
  
        return Employees;
      },
  },
  Mutation: {
    createEmployee: async (_root, args) => {
      const {
        FirstName,
        LastName,
        Age,
        DateOfJoining,
        Title,
        Department,
        EmployeeType,
      } = args;

      const employeeData = new Employee({
        FirstName: FirstName,
        LastName: LastName,
        Age: Age,
        DateOfJoining: moment(DateOfJoining),
        Title: Title,
        Department: Department,
        EmployeeType: EmployeeType,
      });
      await employeeData.save();

      return employeeData;
    },
    updateEmployee: async (_root, args) => {
      
      const { id, ...updateData } = args;

      // Use Moment.js to parse the updated DateOfJoining string if it's provided
      if (updateData.DateOfJoining) {
        updateData.DateOfJoining = moment(updateData.DateOfJoining);
      }

      // Find the employee by ID and update their data
      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, {
        new: true, // Return the updated document
        runValidators: true, // Run Mongoose validators
      });

      if (!updatedEmployee) {
        throw new Error("Employee not found");
      }
      const data = new Employee(updatedEmployee);
      return data;
    },
  
  },
};

module.exports = resolvers;

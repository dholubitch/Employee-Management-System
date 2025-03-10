const Employee = require("../models/employees.js");
const User = require("../models/user.js");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const moment = require("moment");
require("dotenv").config();

const resolvers = {
  Query: {
    getEmployees: async (_root, { limitValue, offset }, { user }) => {
      if (!user) throw new Error("Unauthorized");
      if (user.role !== "Admin" && user.role !== "HR") throw new Error("Access denied");

      return await Employee.find({})
        .limit(parseInt(limitValue))
        .skip(parseInt(offset))
        .select("FirstName LastName Age Department Title EmployeeType userId DateOfJoining");
    },

    getEmployee: async (_root, { id }, { user }) => {
      if (!user) throw new Error("Unauthorized");

      const employee = await Employee.findById(id);
      if (!employee) throw new Error("Employee not found");

      if (user.role === "Employee" && user.userId !== employee.userId.toString()) {
        throw new Error("Access denied");
      }

      return employee;
    },

    searchEmployees: async (_root, { name }, { user }) => {
      if (!user || (user.role !== "Admin" && user.role !== "HR")) throw new Error("Access denied");

      return await Employee.find({ FirstName: { $regex: name, $options: "i" } });
    },

    filterEmployees: async (_root, { type }, { user }) => {
      if (!user || (user.role !== "Admin" && user.role !== "HR")) throw new Error("Access denied");

      return await Employee.find({ EmployeeType: { $regex: type, $options: "i" } });
    },
  },

  Mutation: {
    register: async (_root, { name, email, password, role}) => {
      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword, role: "Employee" }); // Default role is Employee
      await user.save();

      const token = jwt.sign({ userId: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

      return { id: user._id, name: user.name, email: user.email, role: user.role, token };
    },

    login: async (_root, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user) throw new Error("Invalid credentials");
      

      const isMatch = await bcrypt.compare(password, user.password);
     
      if (!isMatch) throw new Error("Invalid credentials");

      const token = jwt.sign({ userId: user._id, name: user.name, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

     
      return { id: user._id, name: user.name, email: user.email, role: user.role, token };
    },

    // Admin - Create User
    createUser: async (_root, { name, email, password, role }, { user }) => {
      // if (!user || user.role !== "Admin") throw new Error("Access denied");

      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({ name, email, password: hashedPassword, role });
      await newUser.save();

      return newUser;
    },

    // Admin - Update User Role
    updateUserRole: async (_root, { userId, role }, { user }) => {
      if (!user || user.role !== "Admin") throw new Error("Access denied");

      const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true });
      if (!updatedUser) throw new Error("User not found");

      return updatedUser;
    },

    // Admin - Update User Password
    updateUserPassword: async (_root, { userId, newPassword }, { user }) => {
      if (!user || user.role !== "Admin") throw new Error("Access denied");

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const updatedUser = await User.findByIdAndUpdate(userId, { password: hashedPassword }, { new: true });

      if (!updatedUser) throw new Error("User not found");

      return updatedUser;
    },

    // HR - Create Employee
    createEmployee: async (
      _,
      { FirstName, LastName, Age, Title, Department, EmployeeType, DateOfJoining, email, password },
      { user }
    ) => {
      if (!user || (user.role !== "Admin" && user.role !== "HR")) throw new Error("Access denied");

      const existingUser = await User.findOne({ email });
      if (existingUser) throw new Error("User already exists");

      const hashedPassword = await bcrypt.hash(password, 10);
      const newUser = new User({
        name: `${FirstName} ${LastName}`,
        email,
        password: hashedPassword,
        role: "Employee", // Default role is Employee
      });
      await newUser.save();

      const newEmployee = new Employee({
        userId: newUser._id,
        FirstName,
        LastName,
        Age,
        Title,
        Department,
        EmployeeType,
        DateOfJoining: moment(DateOfJoining).toDate(),
      });
      await newEmployee.save();

      return {
        userId: newUser._id,
        
        FirstName: newEmployee.FirstName,
        LastName: newEmployee.LastName,
      };
    },

    // HR - Update Employee
    updateEmployee: async (_root, { id, ...updateData }, { user }) => {
      if (!user || (user.role !== "Admin" && user.role !== "HR")) throw new Error("Access denied");

      const updatedEmployee = await Employee.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
      if (!updatedEmployee) throw new Error("Employee not found");

      return updatedEmployee;
    },

    // Admin - Delete Employee
    deleteEmployee: async (_root, { id }, { user }) => {
      if (!user || user.role !== "Admin") throw new Error("Access denied");

      const deletedEmployee = await Employee.findByIdAndDelete(id);
      if (!deletedEmployee) throw new Error("Employee not found");

      return "Employee deleted successfully";
    },
  },
};

module.exports = resolvers;

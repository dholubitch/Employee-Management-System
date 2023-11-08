import { useState } from "react";
import { useNavigate } from "react-router-dom";

const EmployeeCreate = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    dateOfJoining: "",
    title: "",
    department: "",
    employeeType: "",
    currentStatus: "",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === "age") {
      let valuek = parseInt(value);
      setEmployee({
        ...employee,
        [name]: valuek,
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let query = `mutation addEmployee(
      $firstName: String!,
      $lastName: String!,
      $title: String!,
      $age: Int!,
      $department: String!,
      $employeeType: String!,
      $dateOfJoining: String!,
    ) {
      createEmployee(
        FirstName: $firstName,
        LastName: $lastName,
        Title: $title,
        Age: $age,
        Department: $department,
        EmployeeType: $employeeType,
        DateOfJoining: $dateOfJoining,
      ) {
        FirstName
        LastName
        Age
        Title
        EmployeeType
        Department
        DateOfJoining
      }
    }`;

    fetch("https://ems-backend-zqv9.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: employee,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        console.log(res);
        navigate("/");
      });
  };

  return (
    <div className="container mx-auto h-screen flex justify-center items-center">
      <div className="w-96 bg-white p-8 shadow-md rounded-lg">
        <h2 className="text-2xl text-center mb-4">Create Employee Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
              First Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
              Last Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700">
              Age:
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              name="age"
              value={employee.age}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700">
              Date of Joining:
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded"
              name="dateOfJoining"
              value={employee.dateOfJoining}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              name="title"
              value={employee.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700">
              Department:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              name="department"
              value={employee.department}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700">
              Employee Type:
            </label>
            <select
              className="w-full p-2 border rounded"
              name="employeeType"
              value={employee.employeeType}
              onChange={handleChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contractor">Contractor</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreate;

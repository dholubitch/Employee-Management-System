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
    <div className="container mx-auto h-full flex justify-center items-center ">
      <div className="w-96 bg-white p-8 shadow-md rounded-xl border-2  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
        <h2 className="text-2xl text-center mb-4">Create Employee Data</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              First Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="firstName"
              value={employee.firstName}
              onChange={handleChange}
              placeholder="Enter First Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              Last Name:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="lastName"
              value={employee.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              Age:
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="age"
              value={employee.age}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="dateOfJoining" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              Date of Joining:
            </label>
            <input
              type="date"
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="dateOfJoining"
              value={employee.dateOfJoining}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              Title:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="title"
              value={employee.title}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="department" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              Department:
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="department"
              value={employee.department}
              onChange={handleChange}
            />
          </div>
          <div className="mb-4">
            <label htmlFor="employeeType" className="block text-sm font-medium text-gray-700  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400">
              Employee Type:
            </label>
            <select
              className="w-full p-2 border rounded  dark:bg-gray-800 dark:border-gray-700  dark:text-gray-400"
              name="employeeType"
              value={employee.employeeType}
              onChange={handleChange}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contractor">Contractor</option>
            </select>
          </div>
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded btn btn-warning  dark:border-gray-700  dark:text-gray-100">
            Create Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmployeeCreate;

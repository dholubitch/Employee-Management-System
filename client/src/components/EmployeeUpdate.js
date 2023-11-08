import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import moment from "moment";

const EmployeeUpdate = () => {
  const { state } = useLocation();
  const [employee, setEmployee] = useState(state.item);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "Age") {
      const valuek = parseInt(value);
      setEmployee({
        ...employee,
        [name]: valuek,
      });
    } else if (name === "DateOfJoining" && moment(value).isValid()) {
      const valueK = moment(value).format("YYYY-MM-DD");
      setEmployee({
        ...employee,
        [name]: valueK,
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
  };

  const handleUpdate = () => {
    let query = `mutation Mutation($_id: ID!, $FirstName: String, $LastName: String, $Age: Int, $Title: String, $DateOfJoining: String, $Department: String, $EmployeeType: String) {
    updateEmployee(id: $_id, FirstName: $FirstName, LastName: $LastName, Age: $Age, Title: $Title, DateOfJoining: $DateOfJoining, Department: $Department, EmployeeType: $EmployeeType) {
      Age
      DateOfJoining
      Department
      EmployeeType
      FirstName
      LastName
      Title
      _id
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
        navigate("/");
      });
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="card">
        <div className="card-body">
          <h2 className="card-title text-center">Update Employee Data</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="FirstName" className="block text-sm font-medium text-gray-700">
                First Name:
              </label>
              <input
                type="text"
                className="form-input block w-full mt-1 border rounded p-2"
                name="FirstName"
                value={employee.FirstName}
                onChange={handleChange}
                placeholder="Enter First Name"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="LastName" className="block text-sm font-medium text-gray-700">
                Last Name:
              </label>
              <input
                type="text"
                className="form-input block w-full mt-1 border rounded p-2"
                name="LastName"
                value={employee.LastName}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Age" className="block text-sm font-medium text-gray-700">
                Age:
              </label>
              <input
                type="number"
                className="form-input block w-full mt-1 border rounded p-2"
                name="Age"
                value={employee.Age}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="DateOfJoining" className="block text-sm font-medium text-gray-700">
                Date of Joining:
              </label>
              <input
                type="date"
                className="form-input block w-full mt-1 border rounded p-2"
                name="DateOfJoining"
                value={moment(employee.DateOfJoining).format("YYYY-MM-DD")}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Title" className="block text-sm font-medium text-gray-700">
                Title:
              </label>
              <input
                type="text"
                className="form-input block w-full mt-1 border rounded p-2"
                name="Title"
                value={employee.Title}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="Department" className="block text-sm font-medium text-gray-700">
                Department:
              </label>
              <input
                type="text"
                className="form-input block w-full mt-1 border rounded p-2"
                name="Department"
                value={employee.Department}
                onChange={handleChange}
              />
            </div>
            <div className="mb-4">
              <label htmlFor="EmployeeType" className="block text-sm font-medium text-gray-700">
                Employee Type:
              </label>
              <select
                className="form-select block w-full mt-1 border rounded p-2"
                name="EmployeeType"
                value={employee.EmployeeType}
                onChange={handleChange}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>

            <button
              type="button"
              onClick={handleUpdate}
              className="btn btn-primary w-full p-2 rounded"
            >
              Update Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeUpdate;

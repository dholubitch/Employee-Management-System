import React, { useState } from "react";

const EmployeeUpdate = ({ employeeData }) => {
  const [employee, setEmployee] = useState(employeeData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(
      "🚀 ~ file: EmployeeUpdate.js:10 ~ handleChange ~ e.target:",
      e.target
    );

    if (name === "Age") {
      console.log("age insisde", name, value);
      const valuek = parseInt(value);
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

  const handleUpdate = () => {
    console.log("inside", employee);
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

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: employee,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        console.log(
          "🚀 ~ file: EmployeeUpdate.js:49 ~ handleUpdate ~ res:",
          res
        );

        console.log("done");
      });
  };

  return (
    <div>
      <h2>Update Employee Data</h2>
      <form onSubmit={handleUpdate}>
        <div>
          <label>FirstName:</label>
          <input
            type="text"
            name="FirstName"
            value={employee.FirstName}
            onChange={(e) => handleChange(e)}
          />
        </div>
        <div>
          <label>LastName:</label>
          <input
            type="text"
            name="LastName"
            value={employee.LastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="Age"
            value={employee.Age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>DateOfJoining:</label>
          <input
            type="text"
            name="DateOfJoining"
            value={employee.DateOfJoining}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="Title"
            value={employee.Title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="Department"
            value={employee.Department}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>EmployeeType:</label>
          <select
            name="EmployeeType"
            value={employee.EmployeeType}
            onChange={handleChange}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
        <div>
          <label>CurrentStatus:</label>
          <input
            type="number"
            name="CurrentStatus"
            value={1}
            onChange={handleChange}
          />
        </div>
        <button type="button" onClick={handleUpdate}>
          Update Employee
        </button>
      </form>
    </div>
  );
};

export default EmployeeUpdate;

import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import moment from "moment";
const EmployeeUpdate = () => {
  const { state } = useLocation();
  const [employee, setEmployee] = useState(state.item);



  const handleChange = (e) => {
    const { name, value } = e.target;

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

  const dateConversion = (timeStamp) => {
    console.log("🚀 ~ file: EmployeeUpdate.js:63 ~ dateConversion ~ timeStamp:", timeStamp)
    
    
    const formattedDate = moment(parseInt(timeStamp)).format("YYYY-MM-DD");
    console.log("KAK date",typeof formattedDate);
    return formattedDate;

  }



  return (
    <div class="container d-flex justify-content-center align-items-center">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title text-center">Update Employee Data</h2>
          <form>
            <div class="mb-3">
              <label for="FirstName" class="form-label">
                First Name:
              </label>
              <input
                type="text"
                class="form-control"
                name="FirstName"
                value={employee.FirstName}
                onChange={(e) => handleChange(e)}
                placeholder="Enter First Name"
              />
            </div>
            <div class="mb-3">
              <label for="LastName" class="form-label">
                Last Name:
              </label>
              <input
                type="text"
                class="form-control"
                name="LastName"
                value={employee.LastName}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="Age" class="form-label">
                Age:
              </label>
              <input
                type="number"
                class="form-control"
                name="Age"
                value={employee.Age}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="DateOfJoining" class="form-label">
                Date of Joining:
              </label>
              <input
                type="text  "
                class="form-control"
                name="DateOfJoining"
                defaultValue={dateConversion(employee.DateOfJoining)}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="Title" class="form-label">
                Title:
              </label>
              <input
                type="text"
                class="form-control"
                name="Title"
                value={employee.Title}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="Department" class="form-label">
                Department:
              </label>
              <input
                type="text"
                class="form-control"
                name="Department"
                value={employee.Department}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="EmployeeType" class="form-label">
                Employee Type:
              </label>
              <select
                class="form-select"
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
              class="btn btn-primary btn-block"
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

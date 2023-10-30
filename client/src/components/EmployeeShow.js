import { createElement, useEffect, useState } from "react";
import moment from "moment";

import React from "react";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";
const EmployeeShow = () => {
  const [employees, setEmployees] = useState([]);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
 
  useEffect(() => {
    getEmployees();
  }, []);

  useEffect(() => {
    getEmployees();
  }, [offset]);

  const dateConversion = (timeStamp) => {
    const formattedDate = moment(parseInt(timeStamp)).format("YYYY-MM-DD");

    return formattedDate;
  };


  const getEmployees = () => {

    let query = `query Query($limitValue: Int!, $offset: Int!) {
      getEmployees(limitValue: $limitValue, offset: $offset) {
        Age
        DateOfJoining
        Department
        FirstName
        EmployeeType
        Title
        LastName
        _id
      }
    }`;

    let data = {
      limitValue: 5,
      offset: offset,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        if (offset == 0) {
          setEmployees(res.data.getEmployees);
        } else {
          setEmployees((employees) => [...employees, ...res.data.getEmployees]);
          console.log("employees", employees);
        }
      });
  };

  const createEmployee = () => {
    navigate("/create");
  }

  const searchEmployees = (e) => {
    e.preventDefault();
    console.log(typeof e.target.value);
    let name = e.target.value;
    if (name.length == 0) {
      return getEmployees();
    }
    let query = `
query ExampleQuery($name: String!) {
 
  searchEmployees(name: $name) {
    Age
    DateOfJoining
    Department
    EmployeeType
    Title
    LastName
    FirstName
    _id
  }
}
`;
    let data = {
      name: name,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        setEmployees(res.data.searchEmployees);
      });
  };

  const filterEmployees = (e) => {
    e.preventDefault();
    console.log(typeof e.target.value);
    let type = e.target.value;
    if (type.length == 0) {
      return getEmployees();
    }
    let query = `
    query FilterEmployees($type: String!) {
      filterEmployees(type: $type) {
        FirstName
        LastName
        _id
        Title
        EmployeeType
        Department
        DateOfJoining
        Age
      }
    }
`;
    let data = {
      type: type,
    };

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        setEmployees(res.data.filterEmployees);
      });
  };

  const deleteEmployee = (item) => {
    console.log("working till here", item);
    const _id = item._id;
    let data = {
      _id: _id,
    };
    let query = `
    mutation Mutation($_id: ID!) {
      deleteEmployee(id: $_id)
    }
    `;
    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        getEmployees();
      });
  };

  const updateEmployee = (item) => {
    navigate("/update",
    { state: { item } });
  }
  return (
    <div className="container mt-4">
      <div class="d-flex flex-row align-items-center justify-content-between" >
    <h2 class="text-center my-4">Employee's Portal</h2>
    <button type="button" class="btn btn-primary my-4" onClick={createEmployee}>Create Employee</button>
</div>
      <div className="row">
        <div className="col-md-6 d-flex align-items-end">
          <div className="input-group">
            <input
              type="text"
              id="searchInput"
              className="form-control"
              placeholder="Search employees by name or criteria"
              onChange={searchEmployees}
            />

            <div className="input-group-prepend">
              <span className="input-group-text h-100">
                <BiSearch className="position-relative top-0 " />
              </span>
            </div>
          </div>
        </div>
        <div className="col-md-6">
         
          <select
            id="filterDropdown"
            className="form-select"
            onChange={filterEmployees}
          >
            <option value=""> 
            Filter by Employee Type
         </option>
          
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
      </div>
      <table className="table mt-4 border ">
        <thead>
          <tr>
            <th>FirstName</th>
            <th>LastName</th>
            <th>Age</th>
            <th>DateOfJoining</th>
            <th>Title</th>
            <th>Department</th>
            <th>EmployeeType</th>
            <th>CurrentStatus</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((item, index) => (
            <tr key={index}>
              <td>{item.FirstName}</td>
              <td>{item.LastName}</td>
              <td>{item.Age}</td>
              <td>{dateConversion(item.DateOfJoining)}</td>
              <td>{item.Title}</td>
              <td>{item.Department}</td>
              <td>{item.EmployeeType}</td>
              <td>{item.CurrentStatus}</td>
              <td>
             
           
              <button
                  className="btn btn-warning mx-3"
                  onClick={() => updateEmployee(item)}
                >
                  Update
                </button>  
                <button
                  className="btn btn-danger"
                  onClick={() => deleteEmployee(item)}
                >
                  Delete
                </button>

              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="text-center">
        <button
          className="btn btn-primary"
          onClick={() => setOffset(offset + 5)}
        >
          Load More
        </button>
      </div>
    </div>
  );
};

export default EmployeeShow;

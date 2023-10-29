import { useEffect, useState } from "react";
import EmployeeUpdate from "./EmployeeUpdate";
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

  const getEmployees = () => {
    let updatingData = employees;

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
    navigate("/update");
  }
  return (
    <div className="container mt-4">
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
          <label htmlFor="filterDropdown" className="form-label">
            Filter by Employee Type:
          </label>
          <select
            id="filterDropdown"
            className="form-select"
            onChange={filterEmployees}
          >
            <option value="">All Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
      </div>
      <table className="table mt-4">
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
              <td>{item.DateOfJoining}</td>
              <td>{item.Title}</td>
              <td>{item.Department}</td>
              <td>{item.EmployeeType}</td>
              <td>{item.CurrentStatus}</td>
              <td>
             
              <button
                  className="btn btn-danger"
                  onClick={() => updateEmployee(item)}
                >
                  Update
                </button>  <EmployeeUpdate employeeData={item} />
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

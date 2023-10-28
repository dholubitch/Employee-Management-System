import { useEffect, useState } from "react";
import EmployeeUpdate from "./EmployeeUpdate";

const EmployeeShow = () => {
  const [employees, setEmployees] = useState([]);
  const [offset, setOffset] = useState(0);

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

  return (
    <div  className="">
      <div className="border border-success p-2 mb-2 border-opacity-25 ">
        <input
          type="text"
          id="searchInput"
          placeholder="Enter employee name or other criteria"
          className="w-100 text-center"
          onChange={searchEmployees}
        />
      </div>
      <div>
        <label htmlFor="filterDropdown">Filter by Employee Type: </label>
        <select id="filterDropdown" onChange={filterEmployees}>
          <option value="">All Types</option>
          <option value="Full-Time">Full-Time</option>
          <option value="Part-Time">Part-Time</option>
          <option value="Contractor">Contractor</option>
        </select>
      </div>
      <table className="d-flex justify-content-center align-items-center flex-column">
        
        <tbody>
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
          </tr>
        </thead>
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
              <EmployeeUpdate employeeData={item}></EmployeeUpdate>
              <button onClick={() => deleteEmployee(item)}>Delete</button>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setOffset(offset + 5)}>List More</button>
    </div>
  );
};

export default EmployeeShow;

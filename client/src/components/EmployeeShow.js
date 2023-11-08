import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const EmployeeShow = () => {
  const [employees, setEmployees] = useState([]);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    getEmployees();
  }, [offset]);

  const dateConversion = (timeStamp) => {
    const formattedDate = moment(parseInt(timeStamp)).format("YYYY-MM-DD");
    return formattedDate;
  };

  const getEmployees = () => {
    let query = `
      query Query($limitValue: Int!, $offset: Int!) {
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
      }
    `;

    let data = {
      limitValue: 5,
      offset: offset,
    };

    fetch("https://ems-backend-zqv9.onrender.com", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        if (offset === 0) {
          setEmployees(res.data.getEmployees);
        } else {
          setEmployees((employees) => [...employees, ...res.data.getEmployees]);
        }
      });
  };

  const createEmployee = () => {
    navigate("/create");
  };

  const searchEmployees = (e) => {
    e.preventDefault();
    let name = e.target.value;
    if (name.length === 0) {
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

    fetch("https://ems-backend-zqv9.onrender.com", {
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
    let type = e.target.value;
    if (type.length === 0) {
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

    fetch("https://ems-backend-zqv9.onrender.com", {
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
    const _id = item._id;
    let data = {
      _id: _id,
    };
    let query = `
      mutation Mutation($_id: ID!) {
        deleteEmployee(id: $_id)
      }
    `;

    fetch("https://ems-backend-zqv9.onrender.com", {
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
    navigate("/update", { state: { item } });
  };

  return (
    <div className="container mx-auto mt-4">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-center">Employee's Portal</h2>
        <button className="btn btn-primary my-4" onClick={createEmployee}>
          Create Employee
        </button>
      </div>
      <div className="md:flex md:items-end">
        <div className="md:w-1/2">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              id="searchInput"
              className="form-input block w-full pr-12 sm:text-sm sm:leading-5"
              placeholder="Search employees by name or criteria"
              onChange={searchEmployees}
            />
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mt-4 md:mt-0 md:w-1/2">
          <select
            id="filterDropdown"
            className="form-select block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:leading-5"
            onChange={filterEmployees}
          >
            <option value="">Filter by Employee Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
      </div>
      <div class="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">
                First Name
              </th>
              <th scope="col" className="px-6 py-3">
                Last Name
              </th>
              <th scope="col" className="px-6 py-3">
                Age
              </th>
              <th scope="col" className="px-6 py-3">
                DateOfJoining
              </th>
              <th scope="col" className="px-6 py-3">
                Title
              </th>
              <th scope="col" className="px-6 py-3">
                Department
              </th>
              <th scope="col" className="px-6 py-3">
                EmployeeType
              </th>
              <th scope="col" className="px-6 py-3">
                CurrentStatus
              </th>
              <th scope="col" className="px-6 py-3">
                <span className="sr-only">Action</span>
              </th>
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
      </div>
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

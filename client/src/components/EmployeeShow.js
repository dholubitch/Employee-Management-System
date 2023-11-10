import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const EmployeeShow = () => {
  const [employees, setEmployees] = useState([]);
  const [offset, setOffset] = useState(0);
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);
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

const darkModeLogo = () =>{
 if(dark){
return ( <svg
id="theme-toggle-dark-icon"
className=" w-5 h-5"
fill="currentColor"
viewBox="0 0 20 20"
xmlns="http://www.w3.org/2000/svg"
>
<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
</svg>)
 }
            
   
 return(
    <svg
      id="theme-toggle-light-icon"
      className="  w-5 h-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
        fill-rule="evenodd"
        clip-rule="evenodd"
      ></path>
    </svg>)
  
}

  const toggleDarkMode = () => {
    if (localStorage.getItem("color-theme")) {
      
      if (localStorage.getItem("color-theme") === "light") {
        setDark(true);
        console.log("🚀 ~ file: EmployeeShow.js:173 ~ toggleDarkMode ~ dark:", dark)

        document.documentElement.classList.add("dark");

        localStorage.setItem("color-theme", "dark");
        
      } else {
        setDark(false);
        document.documentElement.classList.remove("dark");
        console.log("🚀 ~ file: EmployeeShow.js:173 ~ toggleDarkMode ~ dark:", dark)

        localStorage.setItem("color-theme", "light");
        
      }

      // if NOT set via local storage previously
    } else {
      if (document.documentElement.classList.contains("dark")) {
        console.log("🚀 ~ file: EmployeeShow.js:173 ~ toggleDarkMode ~ dark:", dark)

        document.documentElement.classList.remove("dark");
        localStorage.setItem("color-theme", "light");
        setDark(false);
      } else {
        console.log("🚀 ~ file: EmployeeShow.js:173 ~ toggleDarkMode ~ dark:", dark)

        setDark(true);
        document.documentElement.classList.add("dark");
        localStorage.setItem("color-theme", "dark");
      }
    }
  };

  return (
    <div className="container mx-auto mt-4 dark:bg-gray-700 dark:text-gray-400">
      <div className="flex justify-between items-center my-4">
        <h2 className="text-center">Employee's Portal</h2>
        <button className="btn btn-primary my-4" onClick={createEmployee}>
          Create Employee
        </button>
        <button
          type="button"
          className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-700 rounded-lg text-sm p-2.5"
          onClick={toggleDarkMode}
        >
          {darkModeLogo()}
        </button>
      </div>
      <div className="md:flex md:items-end">
        <div className="md:w-1/2 ">
          <div className="relative rounded-md shadow-sm  ">
            <input
              type="text"
              id="searchInput"
              className="form-input block w-full pr-12 sm:text-sm sm:leading-5 dark:bg-gray-700 dark:text-gray-400"
              placeholder="Search employees by name or criteria"
              onChange={searchEmployees}
            />
            <div className="absolute inset-y-0 right-0 p-3 flex items-center pointer-events-none dark:bg-gray-700 dark:text-gray-400">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="mt-4 md:w-1/2  dark:bg-gray-700 dark:text-gray-400">
          <select
           
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            onChange={filterEmployees}
          >
            <option value="">Filter by Employee Type</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
      </div>
      <div className={`relative overflow-x-auto ${dark?'shadow-md':'shadow-xl'} sm:rounded-lg my-2 border-2 dark:border-0`}>
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
              <tr
                key={index}
                class="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <th
                  scope="row"
                  class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:bg-gray-800 dark:text-white"
                >
                  {item.FirstName}
                </th>

                <td class="px-6 dark:bg-gray-800">{item.LastName}</td>
                <td class="px-6 dark:bg-gray-800">{item.Age}</td>
                <td class="px-6 dark:bg-gray-800">
                  {dateConversion(item.DateOfJoining)}
                </td>
                <td class="px-6 dark:bg-gray-800">{item.Title}</td>
                <td class="px-6 dark:bg-gray-800">{item.Department}</td>
                <td class="px-6 dark:bg-gray-800">{item.EmployeeType}</td>
                <td class="px-6 dark:bg-gray-800">{item.CurrentStatus}</td>
                <td class="px-6 dark:bg-gray-800 text-right flex-col flex justify-center">
                  <button
                    className="btn m-2 btn-warning rounded-xl "
                    onClick={() => updateEmployee(item)}
                  >
                    Update
                  </button>
                  <button
                    className="btn m-2 btn-danger rounded-xl"
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

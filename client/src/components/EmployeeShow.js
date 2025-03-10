import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { BiSearch } from "react-icons/bi";

const EmployeeShow = () => {
  const [employees, setEmployees] = useState([]);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState(false);
  const navigate = useNavigate();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      getEmployees(token);
    }
  }, [offset]);

  const dateConversion = (timeStamp) => {
    return moment(parseInt(timeStamp)).format("YYYY-MM-DD");
  };

  const getEmployees = (token) => {
    let query = `
      query Query($limitValue: Int!, $offset: Int!) {
        getEmployees(limitValue: $limitValue, offset: $offset) {
          _id
          FirstName
          LastName
          Age
          DateOfJoining
          Title
          Department
          EmployeeType
        }
      }
    `;

    let data = {
      limitValue: 5,
      offset: offset,
    };

    fetch("https://ems-backend-zqv9.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: data,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.error("Error fetching employees:", res.errors);
          return;
        }
        if (offset === 0) {
          setEmployees(res.data.getEmployees);
        } else {
          setEmployees((prev) => [...prev, ...res.data.getEmployees]);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div className="container mx-auto mt-4 dark:bg-gray-700 dark:text-gray-100">
      <h2 className="text-center">Employee's Portal</h2>
      <div className="flex justify-between items-center my-4">
        <button className="btn btn-primary my-4" onClick={() => navigate("/create")}>
          Create Employee
        </button>
        <button
          className="btn btn-danger my-4"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
      <div className="md:flex md:items-end my-3">
        <div className="md:w-1/2">
          <div className="relative rounded-md shadow-sm">
            <input
              type="text"
              className="form-input block w-full pr-12 sm:text-sm sm:leading-5 dark:bg-gray-700 dark:text-gray-400 rounded-md"
              placeholder="Search employees by name or criteria"
              onChange={(e) => setSearch(e.target.value)}
            />
            <div className="absolute inset-y-0 right-0 p-3 flex items-center pointer-events-none dark:bg-gray-700 dark:text-gray-400">
              <BiSearch className="h-5 w-5 text-gray-400" />
            </div>
          </div>
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-2 border-2 dark:border-gray-600">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-grayark-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th className="px-6 py-3">First Name</th>
              <th className="px-6 py-3">Last Name</th>
              <th className="px-6 py-3">Age</th>
              <th className="px-6 py-3">Date Of Joining</th>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Department</th>
              <th className="px-6 py-3">Employee Type</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((item, index) => (
              <tr key={index} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-200 dark:hover:bg-gray-900">
                <td className="px-6 py-4 font-medium text-gray-900 dark:bg-gray-800 dark:text-white">{item?.FirstName}</td>
                <td className="px-6 dark:bg-gray-800">{item?.LastName}</td>
                <td className="px-6 dark:bg-gray-800">{item?.Age}</td>
                <td className="px-6 dark:bg-gray-800">{dateConversion(item?.DateOfJoining)}</td>
                <td className="px-6 dark:bg-gray-800">{item?.Title}</td>
                <td className="px-6 dark:bg-gray-800">{item?.Department}</td>
                <td className="px-6 dark:bg-gray-800">{item?.EmployeeType}</td>
                <td className="px-6 dark:bg-gray-800 text-right flex-col flex justify-center">
                  <button className="btn m-2 btn-warning rounded-xl" onClick={() => navigate("/update", { state: { item } })}>
                    Update
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-center">
        {search ? null : (
          <button className="btn btn-primary" onClick={() => setOffset(offset + 5)}>
            Load More
          </button>
        )}
      </div>
    </div>
  );
};

export default EmployeeShow;

import { useEffect, useState } from "react";
import moment from "moment";
import { useNavigate } from "react-router-dom";

const EmployeeShow = () => {
  const [employee, setEmployee] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = JSON.parse(localStorage.getItem("user")).id;
    

    if (!token) {
      navigate("/login");
    } else {
      getEmployee(token, userId);
    }
  }, []);

  const dateConversion = (timeStamp) => {
    return moment(parseInt(timeStamp)).format("YYYY-MM-DD");
  };

  const getEmployee = (token, userId) => {
    let query = `
      query Query($id: ID!) {
        getEmployee(id: $id) {
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

    fetch("http://localhost:4000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: { id: userId },
      }),
       
    })
      .then((res) => res.json())
      .then((res) => {
       
        if (res.errors) {
          console.error("Error fetching employee details:", res.errors);
          return;
        }
        setEmployee(res.data.getEmployee);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div className="container mx-auto mt-4 dark:bg-gray-700 dark:text-gray-100">
      <h2 className="text-center">Your Employee Details</h2>
      <div className="flex justify-end">
        <button
          className="btn btn-danger my-4"
          onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("role");
            localStorage.removeItem("userId");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>
      {employee ? (
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg my-2 border-2 dark:border-gray-600">
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <tbody>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">First Name</td>
                <td className="px-6">{employee.FirstName}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">Last Name</td>
                <td className="px-6">{employee.LastName}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">Age</td>
                <td className="px-6">{employee.Age}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">Date of Joining</td>
                <td className="px-6">{dateConversion(employee.DateOfJoining)}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">Title</td>
                <td className="px-6">{employee.Title}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">Department</td>
                <td className="px-6">{employee.Department}</td>
              </tr>
              <tr className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                <td className="px-6 py-3 font-medium text-gray-900 dark:text-white">Employee Type</td>
                <td className="px-6">{employee.EmployeeType}</td>
              </tr>
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-center">Loading employee details...</p>
      )}
    </div>
  );
};

export default EmployeeShow;

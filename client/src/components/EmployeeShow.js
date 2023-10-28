import { useEffect, useState } from "react"
import EmployeeUpdate from "./EmployeeUpdate";


const EmployeeShow = () => {
  const [employ̥ees, setEmployees] = useState([]);


  useEffect(() => {

    getEmployees();



  }, []);

  const getEmployees = () => {
    let query = `query GetEmployees {
      getEmployees {
        Age
        DateOfJoining
        Department
        EmployeeType
        LastName
        FirstName
        Title
        _id
      }
    }`
    fetch("http://localhost:4000/graphql", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,

      })
    }).then(res => res.json()).then(function (res) {


      setEmployees(res.data.getEmployees);
      console.log("🚀 ~ file: EmployeeShow.js:31 ~ useEffect ~ res.data.getEmployees:", res.data.getEmployees)

    })
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
      "name": name
    }

    fetch("http://localhost:4000/graphql", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,

      })
    }).then(res => res.json()).then(function (res) {



      setEmployees(res.data.searchEmployees);
    })


    

  }

  const deleteEmployee = (item) =>{
   
    console.log("working till here",item);
    const _id = item._id;
    let data = {
      _id:_id
    }
    let query = `
    mutation Mutation($_id: ID!) {
      deleteEmployee(id: $_id)
    }
    `
    fetch("http://localhost:4000/graphql", {
      method: 'POST',
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: data,

      })
    }).then(res => res.json()).then(function (res) {



      getEmployees();
    })

    
  }

  return (
    <div>
      <table>
        <div>
          <label htmlFor="searchInput">Search Employees: </label>
          <input
            type="text"
            id="searchInput"
            placeholder="Enter employee name or other criteria"

            onChange={searchEmployees}
          />
        </div>
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
        <tbody>

          {employ̥ees.map((item, index) => (

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
              <button onClick={() =>deleteEmployee(item)}>Delete</button>
            </tr>

          ))}

        </tbody>
      </table>
    </div>
  )
}

export default EmployeeShow
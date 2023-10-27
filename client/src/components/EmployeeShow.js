import { useEffect, useState } from "react"
import EmployeeUpdate from "./EmployeeUpdate";


const EmployeeShow = () =>{
  const [employees,setEmployees] = useState([]);
  useEffect(() =>{
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
    }).then(res => res.json()).then(function(res) {
      

      setEmployees(res.data.getEmployees);
      console.log("🚀 ~ file: EmployeeShow.js:31 ~ useEffect ~ res.data.getEmployees:", res.data.getEmployees)
    
    })
    
      
  
},[]);
  
  
    return (
        <div>
        <table>
         
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
              </tr>
             
            ))}
           
            </tbody>
          </table>
        </div>
    )
}

export default EmployeeShow
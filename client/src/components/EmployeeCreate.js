import { useState } from 'react';

const EmployeeCreate = () => {
  const [employee, setEmployee] = useState({
    firstName: '',
    lastName: '',
    age: 0,
    dateOfJoining: '',
    title: '',
    department: '',
    employeeType: '',
    currentStatus: '',
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
   

    if (name === "age") {
      let valuek = parseInt(value);
      setEmployee({
        ...employee,
        [name]: valuek
      });
    } else {
     
      setEmployee({
        ...employee,
        [name]: value
      });
    }
    console.log("Employee",employee);
  }


  const handleSubmit = (e) =>{
 e.preventDefault();
 let query = `mutation addEmployee(
  $firstName: String!, 
  $lastName: String!, 
  $title: String!, 
  $age: Int!, 
  $department: String!, 
  $employeeType: String!, 
  $dateOfJoining: String!, 
  ) {
  createEmployee(
      FirstName: $firstName, 
      LastName: $lastName,
      Title: $title, 
      Age: $age, 
       Department: $department, 
       EmployeeType: $employeeType, 
       DateOfJoining: $dateOfJoining,
        ) {
  FirstName
  LastName
  Age
  Title
  EmployeeType
  Department
  DateOfJoining
  
  }
}`      


fetch("http://localhost:4000/graphql", {
  method: 'POST',
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
      query: query,
      variables: employee
  })
}).then(res => res.json()).then(function(res) {
  
  console.log("data,submitted",res)})

  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>FirstName:</label>
          <input
            type="text"
            name="firstName"
            value={employee.firstName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>LastName:</label>
          <input
            type="text"
            name="lastName"
            value={employee.lastName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Age:</label>
          <input
            type="number"
            name="age"
            value={employee.age}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>DateOfJoining:</label>
          <input
            type="text"
            name="dateOfJoining"
            value={employee.dateOfJoining}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Title:</label>
          <input
            type="text"
            name="title"
            value={employee.title}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Department:</label>
          <input
            type="text"
            name="department"
            value={employee.department}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>EmployeeType:</label>
          <select
          type="text"
            name="employeeType"
            value={employee.employeeType}
            onChange={handleChange}
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contractor">Contractor</option>
          </select>
        </div>
        <div>
          <label>CurrentStatus:</label>
          <input
            type="number"
            name="currentStatus"
            value={employee.currentStatus}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Create Employee</button>
      </form>
    </div>
  );
}

export default EmployeeCreate;

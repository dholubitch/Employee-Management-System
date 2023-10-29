import { useState } from "react";

const EmployeeCreate = () => {
  const [employee, setEmployee] = useState({
    firstName: "",
    lastName: "",
    age: 0,
    dateOfJoining: "",
    title: "",
    department: "",
    employeeType: "",
    currentStatus: "",
  });

  const handleChange = (e) => {
    let { name, value } = e.target;
    

    if (name === "age") {
      let valuek = parseInt(value);
      setEmployee({
        ...employee,
        [name]: valuek,
      });
    } else {
      setEmployee({
        ...employee,
        [name]: value,
      });
    }
   
  };

  const handleSubmit = (e) => {
    console.log("Employee", employee);
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
}`;

    fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: query,
        variables: employee,
      }),
    })
      .then((res) => res.json())
      .then(function (res) {
        console.log("data,submitted", res);
      });
  };

  return (
    <div class="container d-flex justify-content-center align-items-center">
      <div class="card">
        <div class="card-body">
          <h2 class="card-title text-center">Create Employee Data</h2>
          <form onSubmit={handleSubmit}>
            <div class="mb-3">
              <label for="FirstName" class="form-label">
                First Name:
              </label>
              <input
                type="text"
                class="form-control"
                name="firstName"
                defaultValue={employee.firstName}
                onChange={(e) => handleChange(e)}
                placeholder="Enter First Name"
              />
            </div>
            <div class="mb-3">
              <label for="LastName" class="form-label">
                Last Name:
              </label>
              <input
                type="text"
                class="form-control"
                name="lastName"
                defaultValue={employee.lastName}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="Age" class="form-label">
                Age:
              </label>
              <input
                type="number"
                class="form-control"
                name="age"
                defaultValue={employee.age}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="DateOfJoining" class="form-label">
                Date of Joining:
              </label>
              <input
                type="text"
                class="form-control"
                name="dateOfJoining"
                defaultValue={employee.dateOfJoining}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="Title" class="form-label">
                Title:
              </label>
              <input
                type="text"
                class="form-control"
                name="title"
                defaultValue={employee.title}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="Department" class="form-label">
                Department:
              </label>
              <input
                type="text"
                class="form-control"
                name="department"
                defaultValue={employee.department}
                onChange={handleChange}
              />
            </div>
            <div class="mb-3">
              <label for="EmployeeType" class="form-label">
                Employee Type:
              </label>
              <select
                class="form-select"
                name="employeeType"
                defaultValue={employee.employeeType}
                onChange={handleChange}
              >
                <option value="Full-Time">Full-Time</option>
                <option value="Part-Time">Part-Time</option>
                <option value="Contractor">Contractor</option>
              </select>
            </div>
            
            <button
              type="submit"
             
              class="btn btn-primary btn-block"
            >
              Create Employee
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EmployeeCreate;

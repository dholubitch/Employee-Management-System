import EmployeeShow from "./components/EmployeeShow";
import { useState } from "react";
import { Context } from "./context/context";
import EmployeeCreate from "./components/EmployeeCreate";

function App() {
  const [employees, setEmployees] = useState([]);
  return (
    <div>
      <EmployeeShow></EmployeeShow>
      <EmployeeCreate></EmployeeCreate>
    </div>
  );
}

export default App;

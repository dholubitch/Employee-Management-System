import EmployeeShow from "./components/EmployeeShow";
import { useState } from "react";
import { Context } from "./context/context";
import EmployeeCreate from "./components/EmployeeCreate";
import { Route, Routes } from "react-router-dom"
import EmployeeUpdate from "./components/EmployeeUpdate";
function App() {
  const [employees, setEmployees] = useState([]);
  return (
    <Routes>
    <Route path="/" element={<EmployeeShow />} />
    <Route path="/create" element={<EmployeeCreate />} />
    <Route path="/update" element={<EmployeeUpdate />} />
  </Routes>
  );
}

export default App;

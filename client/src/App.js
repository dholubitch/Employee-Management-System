import { useState, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import { AuthProvider, AuthContext } from "./context/context";
import EmployeeShow from "./components/EmployeeShow";
import EmployeeCreate from "./components/EmployeeCreate";
import EmployeeUpdate from "./components/EmployeeUpdate";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AdminDashboard from "./components/AdminDashboard";  // Create this component
import HRDashboard from "./components/HRDashboard";  // Create this component
import EmployeeProfile from "./components/EmployeeProfile";  // Create this component

function App() {
  const [employees, setEmployees] = useState([]);

  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<EmployeeShow />} />
        <Route path="/employees" element={<EmployeeShow />} />
        <Route path="/create" element={<EmployeeCreate />} />
        <Route path="/update" element={<EmployeeUpdate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Add Role-Based Routes */}
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/hr" element={<HRDashboard />} />
        <Route path="/employee" element={<EmployeeProfile />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [updatedUserRole, setUpdatedUserRole] = useState({
    userId: "",
    role: "Employee",
  });
  const [updatedPassword, setUpdatedPassword] = useState({
    userId: "",
    newPassword: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    } else {
      getUsers(token);
    }
  }, [navigate]); // Added dependency

  // Fetch users from backend
  const getUsers = (token) => {
    const query = `
      query {
        getUsers {
          id
          name
          email
          role
        }
      }
    `;

    fetch("http://localhost:4000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query }),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("🚀 ~ .then ~ res:", res)
        if (res.errors) {
          console.error("Error fetching users:", res.errors);
          return;
        }
        setUsers(res.data.getUsers); // Corrected API response handling
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  // Update user role mutation
  const handleUpdateUserRole = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const query = `
      mutation UpdateUserRole($userId: ID!, $role: String!) {
        updateUserRole(userId: $userId, role: $role) {
          id
          name
          email
          role
        }
      }
    `;

    const variables = {
      userId: updatedUserRole.userId,
      role: updatedUserRole.role,
    };

    fetch("http://localhost:4000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.error("Error updating user role:", res.errors);
          return;
        }
        alert("User role updated successfully!");
        setUpdatedUserRole({ userId: "", role: "Employee" }); // Reset form
        getUsers(token); // Refresh the user list
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  // Update user password mutation
  const handleUpdateUserPassword = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const query = `
      mutation UpdateUserPassword($userId: ID!, $newPassword: String!) {
        updateUserPassword(userId: $userId, newPassword: $newPassword) {
          id
          name
          email
        }
      }
    `;

    const variables = {
      userId: updatedPassword.userId,
      newPassword: updatedPassword.newPassword,
    };

    fetch("http://localhost:4000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ query, variables }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.error("Error updating password:", res.errors);
          return;
        }
        alert("Password updated successfully!");
        setUpdatedPassword({ userId: "", newPassword: "" }); // Reset form
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div className="container mx-auto mt-4 dark:bg-gray-700 dark:text-gray-100 p-6">
      <h2 className="text-center text-xl font-bold">Admin Dashboard</h2>

      <div className="flex justify-between items-center my-4">
        <button
          className="bg-red-500 text-white px-4 py-2 rounded"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
        >
          Logout
        </button>
      </div>

      {/* Update User Role Form */}
      <h3 className="mt-4 font-semibold">Update User Role</h3>
      <form onSubmit={handleUpdateUserRole} className="flex gap-2 mt-2">
        <input
          type="text"
          value={updatedUserRole.userId}
          onChange={(e) =>
            setUpdatedUserRole({ ...updatedUserRole, userId: e.target.value })
          }
          placeholder="User ID"
          required
          className="border p-2 rounded"
        />
        <select
          value={updatedUserRole.role}
          onChange={(e) =>
            setUpdatedUserRole({ ...updatedUserRole, role: e.target.value })
          }
          className="border p-2 rounded"
        >
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
        </select>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Update Role
        </button>
      </form>

      {/* Update User Password Form */}
      <h3 className="mt-4 font-semibold">Update User Password</h3>
      <form onSubmit={handleUpdateUserPassword} className="flex gap-2 mt-2">
        <input
          type="text"
          value={updatedPassword.userId}
          onChange={(e) =>
            setUpdatedPassword({ ...updatedPassword, userId: e.target.value })
          }
          placeholder="User ID"
          required
          className="border p-2 rounded"
        />
        <input
          type="password"
          value={updatedPassword.newPassword}
          onChange={(e) =>
            setUpdatedPassword({ ...updatedPassword, newPassword: e.target.value })
          }
          placeholder="New Password"
          required
          className="border p-2 rounded"
        />
        <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded">
          Update Password
        </button>
      </form>

      {/* Users List */}
      <div className="my-4">
        <h3 className="font-semibold">Users List</h3>
        <input
          type="text"
          placeholder="Search users..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded my-2 w-full"
        />
        <table className="w-full border-collapse border mt-2">
          <thead>
            <tr className="bg-gray-300">
              <th className="border p-2">Name</th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) =>
                user.name.toLowerCase().includes(search.toLowerCase()) ||
                user.email.toLowerCase().includes(search.toLowerCase())
              )
              .map((user) => (
                <tr key={user.id}>
                  <td className="border p-2">{user.name}</td>
                  <td className="border p-2">{user.email}</td>
                  <td className="border p-2">{user.role}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import moment from "moment";
import { BiSearch } from "react-icons/bi";

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
  }, []);

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
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.error("Error fetching users:", res.errors);
          return;
        }
        setUsers(res.data.getUsers);
      })
      .catch((err) => console.error("Fetch error:", err));
  };

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
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.error("Error updating user role:", res.errors);
          return;
        }
        alert("User role updated successfully!");
        getUsers(token); // Refresh the user list
      })
      .catch((err) => console.error("Fetch error:", err));
  };

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
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.errors) {
          console.error("Error updating password:", res.errors);
          return;
        }
        alert("Password updated successfully!");
      })
      .catch((err) => console.error("Fetch error:", err));
  };

  return (
    <div className="container mx-auto mt-4 dark:bg-gray-700 dark:text-gray-100">
      <h2 className="text-center">Admin Dashboard</h2>

      <div className="flex justify-between items-center my-4">
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

      {/* Update User Role Form */}
      <h3>Update User Role</h3>
      <form onSubmit={handleUpdateUserRole}>
        <input
          type="text"
          value={updatedUserRole.userId}
          onChange={(e) =>
            setUpdatedUserRole({ ...updatedUserRole, userId: e.target.value })
          }
          placeholder="User ID"
          required
        />
        <select
          value={updatedUserRole.role}
          onChange={(e) =>
            setUpdatedUserRole({ ...updatedUserRole, role: e.target.value })
          }
        >
          <option value="Admin">Admin</option>
          <option value="HR">HR</option>
          <option value="Employee">Employee</option>
        </select>
        <button type="submit">Update Role</button>
      </form>

      {/* Update User Password Form */}
      <h3>Update User Password</h3>
      <form onSubmit={handleUpdateUserPassword}>
        <input
          type="text"
          value={updatedPassword.userId}
          onChange={(e) =>
            setUpdatedPassword({ ...updatedPassword, userId: e.target.value })
          }
          placeholder="User ID"
          required
        />
        <input
          type="password"
          value={updatedPassword.newPassword}
          onChange={(e) =>
            setUpdatedPassword({
              ...updatedPassword,
              newPassword: e.target.value,
            })
          }
          placeholder="New Password"
          required
        />
        <button type="submit">Update Password</button>
      </form>

      <div className="my-4">
        <h3>Users List</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {users
              .filter((user) => {
                return (
                  user.name.toLowerCase().includes(search.toLowerCase()) ||
                  user.email.toLowerCase().includes(search.toLowerCase())
                );
              })
              .map((user) => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;

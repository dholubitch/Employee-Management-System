import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch("http://localhost:4000/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
            mutation Mutation($email: String!, $password: String!) {
              login(email: $email, password: $password) {
                id
                name
                email
                role
                token
              }
            }
          `,
          variables: { email, password },
        }),
      });
      const { data } = await response.json();
      if (data?.login) {
        // Set user in context
        login(data.login);
        // Save token and user to localStorage
        localStorage.setItem("token", data.login.token);
        localStorage.setItem("user", JSON.stringify(data.login));

        // Navigate based on role
        if (data.login.role === "Admin") {
          navigate("/admin");
        } else if (data.login.role === "HR") {
          navigate("/hr");
        } else {
          navigate("/employee");
        }
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      console.log("🚀 ~ handleLogin ~ err:", err);
      setError("Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="bg-gray-800 p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 rounded bg-gray-700 text-white"
        />
        <button type="submit" className="w-full p-2 bg-blue-500 rounded hover:bg-blue-600">Login</button>
      </form>
    </div>
  );
}

export default Login;

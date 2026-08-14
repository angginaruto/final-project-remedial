import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setError("");

      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data.data;

      localStorage.setItem("token", token);
      localStorage.setItem("role", user.role);

      if (user.role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/cashier");
      }
    } catch (error: any) {
      setError(
        error.response?.data?.message ||
          "Login gagal"
      );
    }
  };

  return (
    <div>
      <h1>Login</h1>

      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

        {error && <p>{error}</p>}

        <button type="submit">
          Login
        </button>
      </form>
    </div>
  );
}
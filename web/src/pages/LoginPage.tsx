import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import "./LoginPage.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
      
      if (!EMAIL_REGEX.test(email)) {
        setError("Format email tidak valid");
      return;
      }

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
    <div className="lg">
      <div className="lg-card">
        <span className="lg-eyebrow">Selamat Datang</span>
        <h1 className="lg-title">Login</h1>

        <form onSubmit={handleLogin} className="lg-form">
          <label className="lg-field">
            <span className="lg-label">Email</span>
            <input
              type="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lg-input"
              maxLength={20}
            />
          </label>

          <label className="lg-field">
            <span className="lg-label">Password</span>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="lg-input"
            />
          </label>

          {error && <p className="lg-error">{error}</p>}

          <button type="submit" className="lg-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
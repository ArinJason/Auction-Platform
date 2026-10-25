import React, { useState, useEffect } from "react";
import API from "../api"; // use your axios instance with interceptor
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./LoginRegister.css";
import LogoutButton from "../LogoutButton";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryMessage = new URLSearchParams(location.search).get("message");
    if (queryMessage) {
      setMessage(queryMessage);
    }
  }, [location.search]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/auth/login", {
        email: formData.email,
        password: formData.password,
      });

      // ✅ Save token and user for authenticated requests
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login successful!");

      // ✅ Redirect based on role
      if (res.data.user?.role === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="register-page">
      <header className="header">
        <h1 className="logo">AuctionX</h1>
        <nav>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/auctions">Auctions</Link></li>
            <li><Link to="/help">Help</Link></li>
            <li><Link to="/register">Register</Link></li>
          </ul>
        </nav>
        <LogoutButton />
      </header>

      <div className="form-container">
        <h2 className="form-title">Login</h2>
        <form onSubmit={handleSubmit}>
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />

          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button type="submit" className="register-btn">Login</button>
          {message && <p className="note">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;


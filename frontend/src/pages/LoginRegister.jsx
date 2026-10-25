import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginRegister.css";
import LogoutButton from "../LogoutButton";

const LoginRegister = () => {
  const [role, setRole] = useState("buyer");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
      });

      setMessage(res.data.message);

      // ✅ Redirect based on role
      if (role === "seller") {
        navigate("/seller-dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setMessage(err.response?.data?.message || "Registration failed");
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
            <li><Link to="/login">Login</Link></li>
          </ul>
        </nav>
        <LogoutButton />
      </header>

      <div className="form-container">
        <h2 className="form-title">
          {role === "seller" ? "Seller Registration" : "Buyer Registration"}
        </h2>
        <form onSubmit={handleSubmit}>
          <label>Full Name</label>
          <input type="text" name="name" value={formData.name} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Password</label>
          <input type="password" name="password" value={formData.password} onChange={handleChange} required />

          <label>Confirm Password</label>
          <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />

          <label>User Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>

          <button type="submit" className="register-btn">Register</button>
          {message && <p className="note">{message}</p>}
        </form>
      </div>
    </div>
  );
};

export default LoginRegister;

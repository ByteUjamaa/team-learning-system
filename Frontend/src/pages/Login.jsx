import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // For now just mock login logic
    if (formData.username && formData.password) {
      setMessage("Login successful!");
      setTimeout(() => navigate("/dashboard"), 1000);
    } else {
      setMessage("Please enter username and password.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <form onSubmit={handleSubmit} style={{ padding: "2rem", background: "#fff", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", width: "350px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>TLMS Login</h2>

        <input
          type="text"
          name="username"
          placeholder="Username"
          value={formData.username}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
          style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }}
        />

        <button type="submit" style={{ width: "100%", padding: "0.6rem", background: "#4a90e2", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
          Login
        </button>

        {message && <p style={{ textAlign: "center", marginTop: "1rem" }}>{message}</p>}

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          Don't have an account?{" "}
          <a href="/register" style={{ color: "#50c878", fontWeight: "bold" }}>Register</a>
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <button type="button" onClick={() => navigate("/")} style={{ background: "transparent", color: "#4a90e2", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            ← Back to Home
          </button>
        </p>
      </form>
    </div>
  );
}

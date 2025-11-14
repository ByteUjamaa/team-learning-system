import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.username && formData.email && formData.password) {
      setMessage("Registration successful!");
      setTimeout(() => navigate("/login"), 1500);
    } else {
      setMessage("Please fill all fields.");
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", justifyContent: "center", alignItems: "center", background: "#f0f2f5" }}>
      <form onSubmit={handleSubmit} style={{ padding: "2rem", background: "#fff", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.1)", width: "350px" }}>
        <h2 style={{ textAlign: "center", marginBottom: "1rem" }}>TLMS Register</h2>

        <input type="text" name="username" placeholder="Username" value={formData.username} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} />

        <button type="submit" style={{ width: "100%", padding: "0.6rem", background: "#50c878", color: "#fff", border: "none", borderRadius: "5px", fontWeight: "bold" }}>
          Register
        </button>

        {message && <p style={{ textAlign: "center", marginTop: "1rem" }}>{message}</p>}

        <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.9rem" }}>
          Already have an account?{" "}
          <a href="/login" style={{ color: "#4a90e2", fontWeight: "bold" }}>Login</a>
        </p>

        <p style={{ textAlign: "center", marginTop: "1rem" }}>
          <button type="button" onClick={() => navigate("/")} style={{ background: "transparent", color: "#50c878", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            ← Back to Home
          </button>
        </p>
      </form>
    </div>
  );
}

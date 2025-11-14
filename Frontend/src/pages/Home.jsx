import React from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(135deg, #4a90e2, #50c878)",
        color: "#fff",
        fontFamily: "Arial, sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "1rem 2rem",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <h2 style={{ margin: 0, fontWeight: "bold" }}>TLMS</h2>
        <div>
          <button
            onClick={() => navigate("/")}
            style={navButtonStyle}
          >
            Home
          </button>
          <button
            onClick={() => navigate("/login")}
            style={navButtonStyle}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={navButtonStyle}
          >
            Register
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          padding: "2rem",
        }}
      >
        <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>
          Welcome to Team Learning Management System
        </h1>
        <p style={{ fontSize: "1.2rem", maxWidth: "600px" }}>
          Collaborate, Learn, and Grow together with your team.
          Manage your group projects, announcements, and progress — all in one place.
        </p>

        <div style={{ marginTop: "2rem" }}>
          <button
            onClick={() => navigate("/login")}
            style={mainButtonStyle}
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            style={mainButtonStyle}
          >
            Register
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer
        style={{
          textAlign: "center",
          padding: "1rem",
          background: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      >
        <p style={{ margin: 0 }}>© {new Date().getFullYear()} TLMS | Built for Collaborative Learning</p>
      </footer>
    </div>
  );
}

// 🔹 Reusable Styles
const navButtonStyle = {
  background: "transparent",
  color: "#fff",
  border: "1px solid #fff",
  borderRadius: "5px",
  padding: "0.5rem 1rem",
  marginLeft: "0.5rem",
  cursor: "pointer",
  transition: "0.3s",
};

const mainButtonStyle = {
  background: "#fff",
  color: "#4a90e2",
  border: "none",
  borderRadius: "8px",
  padding: "0.8rem 1.8rem",
  margin: "0.5rem",
  fontWeight: "bold",
  cursor: "pointer",
  transition: "0.3s ease",
};

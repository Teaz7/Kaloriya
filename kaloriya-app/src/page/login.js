import AuthLayout from "../layout/AuthLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Login successful!");

        // OPTIONAL: save user session
        localStorage.setItem("user", JSON.stringify(data.user));

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);

        // Clear fields
        setFormData({ username: "", password: "" });
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while logging in.");
    }
  };

  return (
    <AuthLayout>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          User Login
        </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem" }}>
          <label>Username</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <button type="submit" style={buttonStyle}>
          Login
        </button>

        {message && (
          <p style={{ marginTop: "1rem", color: "#2563eb", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </AuthLayout>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.6rem",
  marginTop: "0.3rem",
  borderRadius: "6px",
  border: "1px solid #cbd5e1",
  outline: "none",
};

const buttonStyle = {
  width: "100%",
  backgroundColor: "#2563eb",
  color: "white",
  padding: "0.7rem",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Login;

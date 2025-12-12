import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginLayout from "../layout/loginLayout";

const Login = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
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
      
      console.log("Login response:", data); // Debug log

      if (response.ok) {
        setMessage("Login successful!");

        // Save user session
        localStorage.setItem("user", JSON.stringify(data.user));
        console.log("Saved to localStorage:", data.user); // Debug log

        // Redirect to dashboard
        setTimeout(() => {
          navigate("/dashboard");
        }, 800);

        // Clear fields
        setFormData({ email: "", password: "" }); // FIXED: was username
      } else {
        setMessage(data.error || "Login failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while logging in.");
    }
  };

  return (
    <LoginLayout>
        <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#37715B", fontSize: "48px" }}>
          KALORIYA
        </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1rem", color: "#37715B" }}>
          <label>Email Address:</label>
          <input
            type="text"
            name="email"
            value={formData.email}  // FIXED: was formData.username
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "1.5rem", color: "#37715B" }}>
          <label>Password:</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <button type="submit" style={buttonStyle}>
            LOGIN
          </button>
        </div>

        {message && (
          <p style={{ marginTop: "1rem", color: "#2563eb", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </LoginLayout>
  );
};

const inputStyle = {
  width: "100%",
  padding: "0.4rem 0.2rem",
  marginTop: "0.3rem",
  borderRadius: "10px",
  border: "2px solid #37715B",
  outline: "none",
  color: "#37715B"
};

const buttonStyle = {
  width: "60%",
  backgroundColor: "#37715B",
  color: "white",
  padding: "0.7rem",
  border: "none",
  borderRadius: "7px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default Login;
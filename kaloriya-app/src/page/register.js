import AuthLayout from "../layout/AuthLayout";
import { useState } from "react";

const Register = () => {
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    age: "",
    gender: "",
    height: "",
    weight: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Registration successful!");
        setFormData({ fullname: "", email: "", age: "", gender: "", height: "", weight: "", password: "" });
      } else {
        setMessage(data.error || "Registration failed.");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("An error occurred while registering.");
    }
  };

  return (
    <AuthLayout>
      <h2 style={{ textAlign: "center", marginBottom: "1.5rem", color: "#37715B", fontSize: "36px" }}>
          REGISTRATION
        </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "0.5rem", color: "#37715B" }}>
          <label>Full name:</label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ marginBottom: "0.5rem", color: "#37715B" }}>
          <label>Email Address:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            style={inputStyle}
          />
        </div>

        <div style={{ color: "#37715B", width: "100%", display: "flex" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Age:</label>
            <input
              type="text"
              name="age"
              value={formData.age}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ width: "5%"}}></div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Gender:</label>
            <input
              type="text"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ color: "#37715B", width: "100%", display: "flex" }}>
          <div style={{ marginBottom: "0.5rem" }}>
            <label>Height:</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>

          <div style={{ width: "5%"}}></div>

          <div style={{ marginBottom: "0.5rem" }}>
            <label>Weight:</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              required
              style={inputStyle}
            />
          </div>
        </div>

        <div style={{ marginBottom: "0.5rem", color: "#37715B" }}>
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

        <div style={{ marginBottom: "1.5rem", color: "#37715B" }}>
          <label>Confirm Password:</label>
          <input
            type="password"
            required
            style={inputStyle}
          />
        </div>

        <div style={{ textAlign: "center" }}>
          <button type="submit" style={buttonStyle}>
            REGISTER
          </button>  
        </div>
        

        {message && (
          <p style={{ marginTop: "1rem", color: "#37715B", fontWeight: "bold" }}>
            {message}
          </p>
        )}
      </form>
    </AuthLayout>
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

export default Register;

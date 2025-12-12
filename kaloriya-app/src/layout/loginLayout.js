import { Link } from "react-router-dom";

const LoginLayout = ({ children }) => {
  return (
    <div
      style={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#37715B",
      }}
    >
      <div
        style={{
          width: "400px",
          backgroundColor: "white",
          borderRadius: "20px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          padding: "1rem 2rem",
        }}
      >
        

        {children}

        <p style={{ textAlign: "center", marginTop: "1.5rem" }}>
          Don't have an account yet?{" "}
          <Link to="/register" style={{ color: "#37715B", textDecoration: "none", fontWeight: "bold" }}>
            Signup here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginLayout;

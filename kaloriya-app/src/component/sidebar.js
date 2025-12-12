import {Link, NavLink} from "react-router-dom"

const Sidebar = () => {
    return (
        <aside
            style={{
                width: "180px",
                backgroundColor: "#37715B",
                color: "white",
                padding: "1rem",
                display: "flex",
                flexDirection: "column",
            }}  
        >
            <h3 style={{fontWeight: "bold", fontSize: "30px"}}>KALORIYA</h3>

            <div style={{backgroundColor: "white", height: "0.5vh", marginTop: "-2vh", marginBottom: "2vh"}}></div>

            <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
            <Link to="/" style={linkStyle}>Meal Planner</Link>
            <NavLink to="/bmi" style={linkStyle}>BMI Calculator</NavLink>
            <Link to="/" style={linkStyle}>Settings</Link>
            <Link to="/" style={linkStyle}>Logout</Link>
        </aside>
    )
}

const linkStyle = {
    color: "white",
    textDecoration: "none",
    marginLeft: "1rem",
    borderRadius: "8px",
    transition: "background 0.2s",
    marginBottom: "1.2rem"
};

export default Sidebar;
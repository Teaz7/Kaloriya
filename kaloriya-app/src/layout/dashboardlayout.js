import Sidebar from "../component/sidebar";


const DashboardLayout = ({ children }) => {
    return (
        <div style={{display: "flex", minHeight: "100vh"}}>
            <Sidebar/>
            <div style={{flex: 1, padding: "20px"}}>
                {children}
            </div>
        </div>
    );
};

export default DashboardLayout;
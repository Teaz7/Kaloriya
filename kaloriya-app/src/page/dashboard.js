import DashboardLayout from "../layout/dashboardlayout";
import React, { useState, useEffect } from 'react';


const Dashboard = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const days = ["SUNDAY","MONDAY","TUESDAY","WEDNESDAY","THURSDAY","FRIDAY","SATURDAY"];
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    const dayName = days[currentDateTime.getDay()].toUpperCase();
    const monthName = months[currentDateTime.getMonth()];
    const dayNumber = currentDateTime.getDate();

    const formattedTime = currentDateTime.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
        hour12: true
    });

    const formattedDate = `${dayName}, ${monthName}. ${dayNumber}`;

    return(
        <DashboardLayout>
            <div style={{width: "450px",}}>
                <div style={{display: "flex", gap: "1rem", color: "#37715B", fontSize: "16px"}}>
                    <h1>{formattedDate}</h1>
                    <h1>{formattedTime}</h1>
                </div>
                <div style={{backgroundColor: "#37715B", height: "0.5vh", marginBottom: "2vh"}}></div>
                <div style={{backgroundColor: "#37715B", height: "0.5vh", marginBottom: "2vh"}}></div>
            </div>
        </DashboardLayout>
    );
};

export default Dashboard;
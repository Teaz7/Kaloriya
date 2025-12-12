import { useState } from "react";
import DashboardLayout from "../layout/dashboardlayout";

const ApiTest = () => {

    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);

    const handleClick = async () => {
        try {
        const res = await fetch("http://localhost:5000/api/nutrition/ingredient", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ingredient: query }),
        });

        const data = await res.json();
        console.log(data);

        setResult(data);
        } catch (err) {
        console.error("Error fetching nutrition data:", err);
        }
    };

    return (
        <DashboardLayout>
            <input 
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Enter food"
            />
            <button onClick={handleClick}>Check Nutrition</button>
        </DashboardLayout>
    )
}

export default ApiTest;
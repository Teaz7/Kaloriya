import { useState } from "react";
import DashboardLayout from "../layout/dashboardlayout";

const ApiTest = () => {

    const [query, setQuery] = useState("");
    const [result, setResult] = useState(null);

    const handleClick = async () => {
        const res = await fetch(`http://localhost:5000/nutrition?food=${query}`);

        const text = await res.text();
        console.log(text);

        try {
        const data = JSON.parse(text);
        setResult(data);
        } catch (err) {
        console.error("JSON parse error:", err);
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
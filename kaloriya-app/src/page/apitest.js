import { useState } from "react";


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
      setResult(data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter food"
      />
      <button onClick={handleClick}>Check Nutrition</button>

      {result && <pre>{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
};

export default ApiTest;

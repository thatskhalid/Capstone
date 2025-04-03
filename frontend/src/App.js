import React, { useState } from "react";
import "./App.css"; // Import the CSS file

function App() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch("http://127.0.0.1:5000/check-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    const data = await response.json();
    setResult(data);
  };

  // Function to determine the CSS class for strength level
  const getStrengthClass = (strength) => {
    if (strength === "Weak") return "weak";
    if (strength === "Medium") return "medium";
    if (strength === "Strong") return "strong";
    return "";
  };

  return (
    <div className="container">
      <h1>Password Strength Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Check Strength</button>
      </form>

      {result && (
        <div className={`result-box ${getStrengthClass(result.strength)}`}>
          <h3>Results:</h3>
          <p><strong>Length:</strong> {result.length}</p>
          <p><strong>Entropy:</strong> {result.entropy.toFixed(2)}</p>
          <p><strong>Strength:</strong> {result.strength}</p>
        </div>
      )}
    </div>
  );
}

export default App;


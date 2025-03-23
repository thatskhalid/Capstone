import React, { useState } from "react";

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

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
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
        <div>
          <h3>Results:</h3>
          <p>Length: {result.length}</p>
          <p>Entropy: {result.entropy.toFixed(2)}</p>
          <p>Strength: <strong>{result.strength}</strong></p>
        </div>
      )}
    </div>
  );
}

export default App;

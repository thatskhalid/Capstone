import React, { useState } from "react";
import "./App.css"; // Import the CSS file

function App() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 🔹 New state

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
    if (strength === "Moderate") return "moderate";
    if (strength === "Strong") return "strong";
    return "";
  };

  return (
    <div className="container">
      <h1>Password Strength Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"} // 🔹 Toggle visibility
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* Show Password checkbox */}
        <label className="show-password">
          Show Password
          <input
            type="checkbox"
            checked={showPassword}
            onChange={() => setShowPassword(!showPassword)}
          />
        </label>

        <button type="submit" disabled={!password}>Check Strength</button>
      </form>

              {result && (
          <div className={`result-box ${getStrengthClass(result.strength)}`}>
            <h3>🔍 Results:</h3>
            <p><strong>🔢 Length:</strong> {result.length}</p>
            <p><strong>📊 Entropy:</strong> {result.entropy.toFixed(2)}</p>
            <p>
              <strong>💪 Strength:</strong>{" "}
              <span className="strength-label">{result.strength}</span>
            </p>
            <p>
              <strong>🛡️ Breach Status:</strong>{" "}
              {result.breached > 0 ? (
                <span className="breached">⚠️ Found in {result.breached} breaches</span>
              ) : (
                <span className="safe">✅ Not found in any breaches</span>
              )}
            </p>
          </div>
        )}
    </div>
  );
}

export default App;



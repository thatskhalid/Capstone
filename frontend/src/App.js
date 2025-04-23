import { useState, useEffect } from "react";
import "./App.css"; // Import the CSS file


function App() {
  const [password, setPassword] = useState("");
  const [result, setResult] = useState(null);
  const [showPassword, setShowPassword] = useState(false); // 🔹 New state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? "body-dark" : "";
  }, [darkMode]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null); // reset previous error
  
    try {
      const response = await fetch("http://127.0.0.1:5000/check-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
  
      if (!response.ok) {
        throw new Error("Server error");
      }
  
      const data = await response.json();
      setResult(data);
    } catch (err) {
      setError("Oops! Something went wrong. Please try again later.");
      setResult(null); // Clear previous result
    } finally {
      setLoading(false);
    }
  };
  

  // Function to determine the CSS class for strength level
  const getStrengthClass = (strength) => {
    if (strength === "Weak") return "weak";
    if (strength === "Moderate") return "moderate";
    if (strength === "Strong") return "strong";
    return "";
  };

  return (
    
    <div className={`container ${darkMode ? "dark" : ""}`}>


      <label className="dark-mode-toggle">
        🌙 Dark Mode
        <input
          type="checkbox"
          checked={darkMode}
          onChange={() => setDarkMode(!darkMode)}
        />
      </label>

      <h1>Password Strength Checker</h1>
      <form onSubmit={handleSubmit}>
        <input
          type={showPassword ? "text" : "password"} // 🔹 Toggle visibility
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

          <button
            type="button"
            className="copy-btn"
            onClick={() => navigator.clipboard.writeText(password)}
            disabled={!password}
          >
            📋 Copy
          </button>

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

      {loading && <p className="loading-text">🔄 Checking password...</p>}
      {error && <p className="error-text">{error}</p>}


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

              {result?.strength === "Weak" && (
                <div className="suggestion-box">
                  <h4>🛠️ Suggestions:</h4>
                  <ul>
                    <li>Use at least 12 characters</li>
                    <li>Mix uppercase, lowercase, numbers & symbols</li>
                    <li>Avoid using common words or repeated patterns</li>
                  </ul>
                </div>
              )}

            </p>
          </div>
        )}
    </div>
  );
}

export default App;



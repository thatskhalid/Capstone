# Khalid Mahmood
# Capstone Project
# Code Assistance from ChatGPT

import re
import math
from flask import Flask, request, jsonify

app = Flask(__name__)

def calculate_entropy(password):
    """Calculate password entropy based on character variety and length."""
    charset_sizes = {
        "lowercase": 26,
        "uppercase": 26,
        "digits": 10,
        "special": 32  # Approximate number of special characters
    }

    # Identify character sets used
    charsets_used = {
        "lowercase": bool(re.search(r'[a-z]', password)),
        "uppercase": bool(re.search(r'[A-Z]', password)),
        "digits": bool(re.search(r'\d', password)),
        "special": bool(re.search(r'[\W_]', password))
    }

    # Calculate total character set size
    total_charset = sum(size for key, size in charset_sizes.items() if charsets_used[key])

    # Shannon entropy formula
    if total_charset == 0:
        return 0
    entropy = len(password) * math.log2(total_charset)
    return round(entropy, 2)

def evaluate_password(password):
    """Evaluate password strength based on various factors."""
    length = len(password)
    has_lower = bool(re.search(r'[a-z]', password))
    has_upper = bool(re.search(r'[A-Z]', password))
    has_digit = bool(re.search(r'\d', password))
    has_special = bool(re.search(r'[\W_]', password))

    # Entropy calculation
    entropy = calculate_entropy(password)

    # Strength scoring
    strength_score = sum([has_lower, has_upper, has_digit, has_special]) + (1 if length >= 12 else 0)

    if strength_score < 3 or entropy < 28:
        strength = "Weak"
    elif strength_score == 3 or entropy < 35:
        strength = "Moderate"
    else:
        strength = "Strong"

    return {"length": length, "entropy": entropy, "strength": strength}

@app.route('/check-password', methods=['POST'])
def check_password():
    """API endpoint to check password strength."""
    data = request.get_json()
    password = data.get("password", "")

    if not password:
        return jsonify({"error": "No password provided"}), 400

    result = evaluate_password(password)
    return jsonify(result)

@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Password Strength Checker API! Use a POST request to /check-password"


if __name__ == '__main__':
    app.run(debug=True)


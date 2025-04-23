# Khalid Mahmood
# Capstone Project
# Code Assistance from ChatGPT

import re
import math
from flask import Flask, request, jsonify
from flask_cors import CORS
import hashlib
import requests
import os


app = Flask(__name__)
CORS(app)


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

def check_password_breach(password):
    sha1_password = hashlib.sha1(password.encode("utf-8")).hexdigest().upper()
    prefix = sha1_password[:5]
    suffix = sha1_password[5:]

    url = f"https://api.pwnedpasswords.com/range/{prefix}"
    response = requests.get(url)

    if response.status_code != 200:
        return "Error checking breach"

    hashes = (line.split(":") for line in response.text.splitlines())
    for hash_suffix, count in hashes:
        if hash_suffix == suffix:
            return int(count)  # Password was found 'count' times
    return 0  # Not found

@app.route('/check-password', methods=['POST'])
def check_password():
    data = request.get_json()
    password = data.get('password', '')

    evaluation = evaluate_password(password)
    breach_count = check_password_breach(password)

    return jsonify({
        'length': evaluation["length"],
        'entropy': evaluation["entropy"],
        'strength': evaluation["strength"],
        'breached': breach_count
    })



@app.route('/', methods=['GET'])
def home():
    return "Welcome to the Password Strength Checker API! Use a POST request to /check-password"


if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)


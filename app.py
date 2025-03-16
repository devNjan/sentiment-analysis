from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
from textblob import TextBlob
import logging

# Download required nltk resources
nltk.download("vader_lexicon")
nltk.download("punkt")

# Initialize Flask app
app = Flask(__name__, static_folder="static", template_folder="templates")

# Enable CORS (Allow requests from any origin)
CORS(app, resources={r"/analyze": {"origins": "*"}})

# Initialize sentiment analyzer
sia = SentimentIntensityAnalyzer()

# Configure logging (useful for debugging on Render)
logging.basicConfig(level=logging.INFO)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyze", methods=["POST"])
def analyze_sentiment():
    try:
        data = request.get_json()
        if not data or "text" not in data or not data["text"].strip():
            return jsonify({"error": "Invalid input, please provide text"}), 400

        text = data["text"]
        logging.info(f"Received text: {text}")

        # Sentiment Analysis
        blob = TextBlob(text)
        textblob_score = blob.sentiment.polarity
        vader_score = sia.polarity_scores(text)["compound"]

        # Determine sentiment
        sentiment = "Neutral 😐"
        if vader_score >= 0.05:
            sentiment = "Positive 😀"
        elif vader_score <= -0.05:
            sentiment = "Negative 😡"

        response_data = {
            "sentiment": sentiment,
            "textblob_score": round(textblob_score, 2),
            "vader_score": round(vader_score, 2),
        }

        logging.info(f"Response Data: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        logging.error(f"ERROR in analyze_sentiment: {str(e)}")
        return jsonify({"error": "Internal Server Error"}), 500

# Ensure the app runs on Render
if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=10000)

from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk
from textblob import TextBlob

nltk.download("vader_lexicon")

app = Flask(__name__, static_folder="static", template_folder="templates")

CORS(app, resources={r"/analyze": {"origins": "*"}})

sia = SentimentIntensityAnalyzer()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze_sentiment():
    try:
        data = request.get_json()
        if not data or 'text' not in data:
            return jsonify({"error": "Invalid input"}), 400

        text = data["text"]
        blob = TextBlob(text)
        textblob_score = blob.sentiment.polarity
        vader_score = sia.polarity_scores(text)
        compound_score = vader_score["compound"]

        sentiment = "Neutral 😐"
        if compound_score >= 0.05:
            sentiment = "Positive 😀"
        elif compound_score <= -0.05:
            sentiment = "Negative 😡"

        return jsonify({
            "sentiment": sentiment,
            "textblob_score": textblob_score,
            "vader_score": compound_score
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)


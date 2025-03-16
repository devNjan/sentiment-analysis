from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
import nltk
from nltk.sentiment import SentimentIntensityAnalyzer
from textblob import TextBlob

app = Flask(__name__)
CORS(app)

nltk.download("vader_lexicon")
sia = SentimentIntensityAnalyzer()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/analyze', methods=['POST'])
def analyze():
    text = request.form['text']

    # TextBlob Analysis
    blob = TextBlob(text)
    textblob_score = blob.sentiment.polarity

    # VADER Analysis
    vader_score = sia.polarity_scores(text)["compound"]

    if vader_score >= 0.05:
        sentiment = "Positive 😀"
    elif vader_score <= -0.05:
        sentiment = "Negative 😡"
    else:
        sentiment = "Neutral 😐"

    return jsonify({
        "sentiment": sentiment,
        "textblob_score": textblob_score,
        "vader_score": vader_score
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=10000)

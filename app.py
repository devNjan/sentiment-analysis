from flask import Flask, request, jsonify
from flask_cors import CORS
import matplotlib.pyplot as plt
import io
import base64
from textblob import TextBlob
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)
CORS(app)

def generate_graph(textblob_score, vader_score):
    """Generates a transparent, centered sentiment graph with high contrast red and blue colors."""
    plt.figure(figsize=(4, 3), dpi=120)

    labels = ["TextBlob", "VADER"]
    scores = [textblob_score, vader_score]
    colors = ["#FF3333", "#3399FF"]

    bars = plt.bar(labels, scores, color=colors, alpha=0.85, edgecolor="white", linewidth=1.2)
 
    for bar in bars:
        bar.set_linewidth(1.2) 
        bar.set_edgecolor("white")

    plt.axhline(0, color="white", linestyle="--", linewidth=1)
    plt.ylim(-1, 1)
    plt.xticks(fontsize=10, fontweight="bold", color="white")
    plt.yticks(fontsize=9, color="white")
    plt.ylabel("Sentiment Score", fontsize=10, fontweight="bold", color="white")
    plt.title("Sentiment Analysis", fontsize=12, fontweight="bold", color="#FF3333")
    plt.grid(axis="y", linestyle="--", alpha=0.3, color="white")

    plt.gca().patch.set_alpha(0)

    img_io = io.BytesIO()
    plt.savefig(img_io, format='png', bbox_inches="tight", transparent=True)
    plt.close()
    img_io.seek(0)
    return base64.b64encode(img_io.getvalue()).decode()


@app.route("/analyze", methods=["POST"])
def analyze_text():
    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({"error": "No text provided"}), 400

    textblob_score = TextBlob(text).sentiment.polarity
    vader_score = SentimentIntensityAnalyzer().polarity_scores(text)["compound"]

    graph_url = generate_graph(textblob_score, vader_score)

    return jsonify({
        "sentiment": "Positive" if vader_score > 0 else "Negative" if vader_score < 0 else "Neutral",
        "textblob_score": textblob_score,
        "vader_score": vader_score,
        "graph": f"data:image/png;base64,{graph_url}"
    })

if __name__ == "__main__":
    app.run(debug=True)

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("analyze-btn").addEventListener("click", analyzeSentiment);
});

function analyzeSentiment() {
    let text = document.getElementById("text-input").value.trim();

    if (text === "") {
        alert("Please enter some text for analysis.");
        return;
    }

    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text })
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("result-container").style.display = "block";
        document.getElementById("sentiment").innerHTML = `<strong>Sentiment:</strong> ${data.sentiment}`;
        document.getElementById("textblob-score").innerHTML = `<strong>TextBlob Score:</strong> ${data.textblob_score.toFixed(2)}`;
        document.getElementById("vader-score").innerHTML = `<strong>VADER Score:</strong> ${data.vader_score.toFixed(2)}`;
        document.getElementById("graph").src = data.graph;
    })
    .catch(error => {
        console.error("Error:", error);
        alert("Failed to analyze sentiment.");
    });
}


function updateChart(textblobScore, vaderScore) {
    const ctx = document.getElementById("sentimentChart").getContext("2d");
    if (window.sentimentChart) {
        window.sentimentChart.destroy();
    }
    window.sentimentChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["TextBlob Score", "VADER Score"],
            datasets: [{
                label: "Sentiment Scores",
                data: [textblobScore, vaderScore],
                backgroundColor: ["#ff758c", "#ff7eb3"]
            }]
        },
        options: { responsive: true }
    });
}
ddocument.addEventListener("DOMContentLoaded", () => {
    fetch("http://127.0.0.1:5000/empty_graph")
        .then(response => response.json())
        .then(data => {
            document.getElementById("resultGraph").src = data.graph;
        })
        .catch(error => console.error("Error loading empty graph:", error));
});

document.getElementById("analyzeBtn").addEventListener("click", () => {
    const text = document.getElementById("textInput").value.trim();
    if (text === "") {
        alert("Please enter some text.");
        return;
    }

    fetch("http://127.0.0.1:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: text }),
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("resultGraph").src = data.graph;
        document.getElementById("sentimentResult").textContent = `Sentiment: ${data.sentiment}`;
    })
    .catch(error => console.error("Error:", error));
});


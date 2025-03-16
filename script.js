document.addEventListener("DOMContentLoaded", function () {
    const analyzeButton = document.getElementById("analyze-btn");
    const inputField = document.getElementById("text-input");
    const resultDiv = document.getElementById("result");
    const ctx = document.getElementById("sentimentChart").getContext("2d");

    let sentimentChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: ["TextBlob Score", "VADER Score"],
            datasets: [{
                label: "Sentiment Score",
                data: [0, 0], // Default values
                backgroundColor: ["rgba(54, 162, 235, 0.8)", "rgba(255, 99, 132, 0.8)"],
                borderColor: ["rgba(54, 162, 235, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 3,
                borderRadius: 15
            }]
        },
        options: {
            animation: {
                duration: 1200,
                easing: "easeInOutExpo"
            },
            plugins: {
                legend: {
                    labels: {
                        color: "white",
                        font: { size: 14 }
                    }
                },
                tooltip: {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                    titleColor: "#fff",
                    bodyColor: "#fff",
                    borderColor: "rgba(255, 255, 255, 0.6)",
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    min: -1,
                    max: 1,
                    grid: {
                        color: "rgba(255, 255, 255, 0.2)",
                        borderDash: [5, 5] // Dashed lines for better visibility
                    },
                    ticks: { color: "white", font: { size: 14 } }
                },
                x: {
                    ticks: { color: "white", font: { size: 14 } }
                }
            }
        }
    });

    analyzeButton.addEventListener("click", function () {
        analyzeSentiment();
    });

    function analyzeSentiment() {
        const text = inputField.value.trim();

        if (text === "") {
            resultDiv.innerHTML = "<p style='color:red;'>Please enter text to analyze.</p>";
            return;
        }

        fetch("http://127.0.0.1:5000/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: `text=${encodeURIComponent(text)}`
        })
        .then(response => response.json())
        .then(data => {
            resultDiv.innerHTML = `
                <p><strong>Sentiment:</strong> ${data.sentiment}</p>
                <p><strong>TextBlob Score:</strong> ${data.textblob_score.toFixed(3)}</p>
                <p><strong>VADER Score:</strong> ${data.vader_score.toFixed(3)}</p>
            `;

            // ✅ Smooth Update of Graph Data
            sentimentChart.data.datasets[0].data = [data.textblob_score, data.vader_score];
            sentimentChart.update();
        })
        .catch(error => {
            console.error("Error:", error);
            resultDiv.innerHTML = "<p style='color:red;'>Error analyzing sentiment.</p>";
        });
    }
});


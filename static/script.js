async function analyzeSentiment() {
  const textInput = document.getElementById("textInput").value.trim();
  if (!textInput) {
      alert("Please enter some text!");
      return;
  }

  try {
      const response = await fetch("/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: textInput }),
      });

      if (!response.ok) {
          throw new Error(`Server error: ${response.status});
      }

      const data = await response.json();
      console.log("API Response:", data); // Debugging log

      if (data.error) {
          alert("Error: " + data.error);
          return;
      }

      if (typeof data.textblob_score === "undefined") {
          alert("Invalid API response. Check the backend logs.");
          return;
      }

      document.getElementById("result").innerHTML = `
          <p><strong>Sentiment:</strong> ${data.sentiment}</p>
          <p><strong>TextBlob Score:</strong> ${data.textblob_score.toFixed(2)}</p>
          <p><strong>VADER Score:</strong> ${data.vader_score.toFixed(2)}</p>
      `;

  } catch (error) {
      console.error("Request failed:", error);
      alert("Failed to connect to API!");
  }
}

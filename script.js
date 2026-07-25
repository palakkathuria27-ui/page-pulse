const button = document.getElementById("analyze-button");
const input = document.getElementById("url-input");
const result = document.getElementById("result");

button.addEventListener("click", async () => {
  const url = input.value.trim();

  if (!url) {
    result.innerHTML = "<p>Please enter a website URL.</p>";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ url }),
    });

    const data = await response.json();

    result.innerHTML = `
      <h3>Analysis Result</h3>
      <p><strong>HTTP Status:</strong> ${data.httpStatus}</p>
      <p><strong>Response Time:</strong> ${data.responseTime}</p>
      <p><strong>Page Title:</strong> ${data.pageTitle}</p>
      <p><strong>Meta Description:</strong> ${data.metaDescription}</p>
      <p><strong>H1 Count:</strong> ${data.h1Count}</p>
      <p><strong>Images Without Alt:</strong> ${data.imagesWithoutAlt}</p>
      <p><strong>Word Count:</strong> ${data.wordCount}</p>
    `;
  } catch (error) {
    result.innerHTML =
      "<p style='color:red;'>Error connecting to backend.</p>";
  }
});
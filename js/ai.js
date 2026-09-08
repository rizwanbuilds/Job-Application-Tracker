async function analyzeJob() {

    const jobDescription =
        document.getElementById("jobDescription").value.trim();

    const result =
        document.getElementById("aiResult");

    if (!jobDescription) {
        result.innerHTML = "<p>Please paste a job description.</p>";
        return;
    }

    result.innerHTML = "<p>🤖 AI is analyzing...</p>";

    try {

        const response = await fetch("/api/ai-match", {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                jobDescription
            })

        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        result.innerHTML = `
            <div class="ai-result">
                <h3>AI Job Match</h3>
                <pre>${data.result}</pre>
            </div>
        `;

    } catch (error) {

        result.innerHTML =
            `<p>AI error: ${error.message}</p>`;

    }
}
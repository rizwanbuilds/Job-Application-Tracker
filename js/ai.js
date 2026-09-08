async function analyzeJob() {

    const resumeFile =
        document.getElementById("resumeFile").files[0];

    const jobDescription =
        document.getElementById("jobDescription").value.trim();

    const result =
        document.getElementById("aiResult");

    if (!resumeFile) {
        result.innerHTML =
            "<p class='ai-error'>Please upload your resume PDF.</p>";
        return;
    }

    if (resumeFile.type !== "application/pdf") {
        result.innerHTML =
            "<p class='ai-error'>Please upload a PDF file.</p>";
        return;
    }

    if (!jobDescription) {
        result.innerHTML =
            "<p class='ai-error'>Please paste a job description.</p>";
        return;
    }

    result.innerHTML = `
        <div class="ai-loading">
            🤖 Reading your resume and analyzing the job...
        </div>
    `;

    const formData = new FormData();

    formData.append("resume", resumeFile);
    formData.append("jobDescription", jobDescription);

    try {

        const response = await fetch("/api/ai-match", {
            method: "POST",
            body: formData
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        result.innerHTML = `
            <div class="ai-result-card">

                <div class="ai-result-title">
                    <h3>🎯 AI Job Match Result</h3>
                </div>

                <pre>${data.result}</pre>

            </div>
        `;

    } catch (error) {

        result.innerHTML = `
            <p class="ai-error">
                AI error: ${error.message}
            </p>
        `;

    }
}
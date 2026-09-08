require("dotenv").config();

const express = require("express");
const fs = require("fs");
const path = require("path");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = 3000;

const FILE = path.join(__dirname, "jobs.json");
const FRONTEND = path.join(__dirname, "..");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json());
app.use(express.static(FRONTEND));


app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND, "index.html"));
});


app.get("/api/jobs", (req, res) => {

    const jobs =
        JSON.parse(fs.readFileSync(FILE, "utf8"));

    res.json(jobs);
});


app.post("/api/jobs", (req, res) => {

    const jobs =
        JSON.parse(fs.readFileSync(FILE, "utf8"));

    jobs.push(req.body);

    fs.writeFileSync(
        FILE,
        JSON.stringify(jobs, null, 2)
    );

    res.json({
        message: "Job saved successfully",
        job: req.body
    });
});


app.put("/api/jobs/:id", (req, res) => {

    const jobs =
        JSON.parse(fs.readFileSync(FILE, "utf8"));

    const index = jobs.findIndex(
        job => job.id === Number(req.params.id)
    );

    if (index === -1) {

        return res.status(404).json({
            message: "Job not found"
        });

    }

    jobs[index] = req.body;

    fs.writeFileSync(
        FILE,
        JSON.stringify(jobs, null, 2)
    );

    res.json({
        message: "Job updated successfully",
        job: req.body
    });
});


app.delete("/api/jobs/:id", (req, res) => {

    const jobs =
        JSON.parse(fs.readFileSync(FILE, "utf8"));

    const newJobs = jobs.filter(
        job => job.id !== Number(req.params.id)
    );

    fs.writeFileSync(
        FILE,
        JSON.stringify(newJobs, null, 2)
    );

    res.json({
        message: "Job deleted successfully"
    });
});


/* AI Job Match */

app.post("/api/ai-match", async (req, res) => {

    try {

        const { jobDescription } = req.body;

        if (!jobDescription) {

            return res.status(400).json({
                message: "Job description is required"
            });

        }

        const prompt = `
Analyze this job description and give a simple job match analysis.

Job Description:
${jobDescription}

Give the response in this format:

MATCH SCORE: XX%

STRONG SKILLS:
- skill 1
- skill 2
- skill 3

MISSING OR IMPROVE:
- skill 1
- skill 2
- skill 3

ADVICE:
Give 2-3 short sentences of useful advice.

Do not invent information about the candidate.
`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt
        });

        res.json({
            result: response.text
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "AI analysis failed. Check your API key and try again."
        });

    }
});


app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
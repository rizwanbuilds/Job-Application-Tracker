const express = require("express");
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");
const multer = require("multer");
const { PDFParse } = require("pdf-parse");
const { GoogleGenAI } = require("@google/genai");

dotenv.config();

const app = express();
const PORT = 3000;

const jobsFile = path.join(__dirname, "jobs.json");

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024
    }
});

app.use(express.json());

app.use(express.static(path.join(__dirname, "..")));


// =========================
// JOB APPLICATIONS
// =========================

function readJobs() {

    if (!fs.existsSync(jobsFile)) {
        return [];
    }

    const data = fs.readFileSync(jobsFile, "utf8");

    return data ? JSON.parse(data) : [];
}


function saveJobs(jobs) {

    fs.writeFileSync(
        jobsFile,
        JSON.stringify(jobs, null, 2)
    );
}


// GET ALL JOBS

app.get("/api/jobs", (req, res) => {

    const jobs = readJobs();

    res.json(jobs);
});


// ADD JOB

app.post("/api/jobs", (req, res) => {

    const jobs = readJobs();

    const job = {
        ...req.body,
        id: req.body.id || Date.now()
    };

    jobs.push(job);

    saveJobs(jobs);

    res.status(201).json(job);
});


// UPDATE JOB

app.put("/api/jobs/:id", (req, res) => {

    const jobs = readJobs();

    const id = Number(req.params.id);

    const index = jobs.findIndex(
        job => Number(job.id) === id
    );

    if (index === -1) {

        return res.status(404).json({
            message: "Application not found"
        });

    }

    jobs[index] = {
        ...jobs[index],
        ...req.body,
        id: jobs[index].id
    };

    saveJobs(jobs);

    res.json(jobs[index]);
});


// DELETE JOB

app.delete("/api/jobs/:id", (req, res) => {

    const jobs = readJobs();

    const id = Number(req.params.id);

    const updatedJobs = jobs.filter(
        job => Number(job.id) !== id
    );

    if (updatedJobs.length === jobs.length) {

        return res.status(404).json({
            message: "Application not found"
        });

    }

    saveJobs(updatedJobs);

    res.json({
        message: "Application deleted successfully"
    });
});


// =========================
// AI JOB MATCH
// =========================

app.post(
    "/api/ai-match",
    upload.single("resume"),
    async (req, res) => {

        try {

            const { jobDescription } = req.body;

            // Check resume

            if (!req.file) {

                return res.status(400).json({
                    message: "Resume PDF is required"
                });

            }


            // Check job description

            if (!jobDescription) {

                return res.status(400).json({
                    message: "Job description is required"
                });

            }


            // Check PDF

            if (req.file.mimetype !== "application/pdf") {

                return res.status(400).json({
                    message: "Please upload a PDF file"
                });

            }


            // =========================
            // READ RESUME PDF
            // =========================

            const parser = new PDFParse({
                data: req.file.buffer
            });

            const pdf = await parser.getText();

            await parser.destroy();

            const resumeText = pdf.text;


            if (!resumeText.trim()) {

                return res.status(400).json({
                    message:
                        "Could not extract text from this PDF. Please upload a text-based resume PDF."
                });

            }


            // =========================
            // AI PROMPT
            // =========================

            const prompt = `
You are an AI job matching assistant.

Compare the candidate's resume with the job description.

CANDIDATE RESUME:
${resumeText}

JOB DESCRIPTION:
${jobDescription}

Analyze how closely the candidate matches the job.

Use exactly this format:

MATCH SCORE: XX%

STRONG SKILLS:
- skill
- skill
- skill

MISSING OR IMPROVE:
- skill
- skill
- skill

MATCH SUMMARY:
Give 2-3 short sentences explaining why the candidate matches the job.

ADVICE:
Give 2-3 short sentences explaining what the candidate should improve.

IMPORTANT RULES:
- Only use information actually found in the candidate resume.
- Do not invent skills, projects, education or experience.
- Compare the resume directly with the job requirements.
- Give a realistic score between 0% and 100%.
- Consider both required skills and relevant experience/projects.
- Keep the response simple and easy to understand.
`;


            // =========================
            // GEMINI
            // =========================

            const response =
                await ai.models.generateContent({

                    model: "gemini-3.6-flash",

                    contents: prompt

                });


            res.json({
                result: response.text
            });

        } catch (error) {

            console.log("AI ERROR:", error);

            res.status(500).json({
                message:
                    "Resume analysis failed. Please try again."
            });

        }

    }
);


// =========================
// START SERVER
// =========================

app.listen(PORT, () => {

    console.log(
        `Server running at http://localhost:${PORT}`
    );

});
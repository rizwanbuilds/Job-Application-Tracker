const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

const FILE = path.join(__dirname, "jobs.json");
const FRONTEND = path.join(__dirname, "..");

app.use(express.json());
app.use(express.static(FRONTEND));

app.get("/", (req, res) => {
    res.sendFile(path.join(FRONTEND, "index.html"));
});

app.get("/api/jobs", (req, res) => {
    const jobs = JSON.parse(fs.readFileSync(FILE, "utf8"));
    res.json(jobs);
});

app.post("/api/jobs", (req, res) => {
    const jobs = JSON.parse(fs.readFileSync(FILE, "utf8"));

    jobs.push(req.body);

    fs.writeFileSync(FILE, JSON.stringify(jobs, null, 2));

    res.json({
        message: "Job saved successfully",
        job: req.body
    });
});

app.put("/api/jobs/:id", (req, res) => {
    const jobs = JSON.parse(fs.readFileSync(FILE, "utf8"));

    const index = jobs.findIndex(
        job => job.id === Number(req.params.id)
    );

    if (index === -1) {
        return res.status(404).json({
            message: "Job not found"
        });
    }

    jobs[index] = req.body;

    fs.writeFileSync(FILE, JSON.stringify(jobs, null, 2));

    res.json({
        message: "Job updated successfully",
        job: req.body
    });
});

app.delete("/api/jobs/:id", (req, res) => {
    const jobs = JSON.parse(fs.readFileSync(FILE, "utf8"));

    const newJobs = jobs.filter(
        job => job.id !== Number(req.params.id)
    );

    fs.writeFileSync(FILE, JSON.stringify(newJobs, null, 2));

    res.json({
        message: "Job deleted successfully"
    });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
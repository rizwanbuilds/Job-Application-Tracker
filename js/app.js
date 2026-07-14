const form = document.getElementById("jobForm");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const job = {
        id: Date.now(),

        company: document.getElementById("company").value,
        role: document.getElementById("role").value,
        platform: document.getElementById("platform").value,
        appliedDate: document.getElementById("appliedDate").value,
        status: document.getElementById("status").value,
        followUpDate: document.getElementById("followUpDate").value,
        resumeVersion: document.getElementById("resumeVersion").value,
        notes: document.getElementById("notes").value
    };

    let jobs = JSON.parse(localStorage.getItem("jobs")) || [];
    const duplicateJob = jobs.find(
        existingJob =>
            existingJob.company.toLowerCase() === job.company.toLowerCase() &&
            existingJob.role.toLowerCase() === job.role.toLowerCase()
    );
    
    if (duplicateJob) {
        alert(
            `You have already applied to ${job.company} for ${job.role}.`
        );
        return;
    }
    jobs.push(job);

    localStorage.setItem(
        "jobs",
        JSON.stringify(jobs)
    );

    alert("Application Saved Successfully!");

    form.reset();

    displayJobs();
});
displayJobs();
document
    .getElementById("statusFilter")
    .addEventListener(
        "change",
        displayJobs
    );
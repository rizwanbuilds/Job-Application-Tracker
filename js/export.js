function exportToCSV() {

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    if (jobs.length === 0) {
        alert("No data to export.");
        return;
    }

    const headers = [
        "Company",
        "Role",
        "Platform",
        "Applied Date",
        "Status",
        "Follow Up Date",
        "Resume Version",
        "Notes"
    ];

    let csv =
        headers.join(",") + "\n";

    jobs.forEach(job => {
        csv += [
            job.company,
            job.role,
            job.platform,
            job.appliedDate,
            job.status,
            job.followUpDate,
            job.resumeVersion,
            job.notes
        ].join(",") + "\n";
    });

    const blob =
        new Blob([csv],
        { type: "text/csv" });

    const url =
        window.URL.createObjectURL(blob);

    const a =
        document.createElement("a");

    a.href = url;
    a.download = "job_applications.csv";

    a.click();
}
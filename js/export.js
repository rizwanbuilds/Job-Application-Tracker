async function exportToCSV() {

    try {

        const response = await fetch("/api/jobs");
        const jobs = await response.json();

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

        const rows = jobs.map(job => [
            job.company,
            job.role,
            job.platform,
            job.appliedDate,
            job.status,
            job.followUpDate,
            job.resumeVersion,
            job.notes
        ].map(value =>
            `"${String(value || "").replace(/"/g, '""')}"`
        ).join(","));

        const csv = [
            headers.join(","),
            ...rows
        ].join("\n");

        const blob = new Blob(
            [csv],
            { type: "text/csv" }
        );

        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");

        a.href = url;
        a.download = "job_applications.csv";

        a.click();

        URL.revokeObjectURL(url);

    } catch (error) {

        alert("Could not export applications.");
        console.log(error);

    }
}
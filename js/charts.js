let statusChart;

function updateCharts() {

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    const applied =
        jobs.filter(job => job.status === "Applied").length;

    const assessment =
        jobs.filter(job => job.status === "Assessment").length;

    const interview =
        jobs.filter(job => job.status === "Interview").length;

    const offer =
        jobs.filter(job => job.status === "Offer").length;

    const rejected =
        jobs.filter(job => job.status === "Rejected").length;

    const ctx =
        document.getElementById("statusChart");

    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: [
                "Applied",
                "Assessment",
                "Interview",
                "Offer",
                "Rejected"
            ],
            datasets: [{
                label: "Applications",
                data: [
                    applied,
                    assessment,
                    interview,
                    offer,
                    rejected
                ]
            }]
        }
    });
}
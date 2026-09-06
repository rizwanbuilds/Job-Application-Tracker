let statusChart;

function updateCharts(jobs) {

    const statuses = [
        "Applied",
        "Assessment",
        "Interview",
        "Offer",
        "Rejected"
    ];

    const counts = statuses.map(
        status => jobs.filter(job => job.status === status).length
    );

    const ctx = document.getElementById("statusChart");

    if (statusChart) {
        statusChart.destroy();
    }

    statusChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: statuses,
            datasets: [{
                label: "Applications",
                data: counts
            }]
        }
    });
}
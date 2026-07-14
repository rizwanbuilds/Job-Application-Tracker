function updateDashboard() {

    const jobs =
        JSON.parse(localStorage.getItem("jobs")) || [];

    document.getElementById(
        "totalApplications"
    ).textContent = jobs.length;

    const interviews =
        jobs.filter(
            job => job.status === "Interview"
        ).length;

    document.getElementById(
        "totalInterviews"
    ).textContent = interviews;

    const offers =
        jobs.filter(
            job => job.status === "Offer"
        ).length;

    document.getElementById(
        "totalOffers"
    ).textContent = offers;

    const responses =
        jobs.filter(
            job =>
                job.status === "Interview" ||
                job.status === "Offer"
        ).length;

    const responseRate =
        jobs.length === 0
            ? 0
            : ((responses / jobs.length) * 100).toFixed(1);

    document.getElementById(
        "responseRate"
    ).textContent =
        responseRate + "%";
}
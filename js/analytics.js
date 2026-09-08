function updateDashboard(jobs) {

    document.getElementById("totalApplications").textContent =
        jobs.length;

    const interviews = jobs.filter(
        job => job.status === "Interview"
    ).length;

    document.getElementById("totalInterviews").textContent =
        interviews;

    const offers = jobs.filter(
        job => job.status === "Offer"
    ).length;

    document.getElementById("totalOffers").textContent =
        offers;

    const responses = jobs.filter(
        job =>
            job.status === "Interview" ||
            job.status === "Offer"
    ).length;

    const responseRate = jobs.length === 0
        ? 0
        : ((responses / jobs.length) * 100).toFixed(1);

    document.getElementById("responseRate").textContent =
        responseRate + "%";

    updateReminders(jobs);
}


function updateReminders(jobs) {

    const reminderList =
        document.getElementById("reminderList");

    const today =
        new Date().toISOString().split("T")[0];

    const reminders = jobs.filter(job =>
        job.followUpDate &&
        job.followUpDate <= today &&
        job.status !== "Rejected" &&
        job.status !== "Offer"
    );

    if (reminders.length === 0) {

        reminderList.innerHTML =
            "<p>No follow-ups due.</p>";

        return;
    }

    reminderList.innerHTML = reminders.map(job => {

        const overdue =
            job.followUpDate < today;

        return `
            <div class="reminder">
                <strong>${job.company}</strong>
                - ${job.role}
                <br>
                Follow-up: ${job.followUpDate}
                ${overdue ? " (Overdue)" : " (Today)"}
            </div>
        `;

    }).join("");
}
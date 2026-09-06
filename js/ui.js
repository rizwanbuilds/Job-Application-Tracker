let editingId = null;

let allJobs = [];


function displayJobs(jobs = allJobs) {

    allJobs = jobs;

    const tableBody =
        document.getElementById("jobTableBody");

    tableBody.innerHTML = "";


    const searchTerm =
        document.getElementById("searchInput")
            .value
            .toLowerCase();

    const selectedStatus =
        document.getElementById("statusFilter")
            .value;


    const filteredJobs = jobs.filter(job => {

        const matchesSearch =
            job.company.toLowerCase().includes(searchTerm) ||
            job.role.toLowerCase().includes(searchTerm);

        const matchesStatus =
            selectedStatus === "All" ||
            job.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });


    filteredJobs.forEach(job => {

        let statusClass = "";

        switch (job.status) {

            case "Applied":
                statusClass = "status-applied";
                break;

            case "Assessment":
                statusClass = "status-assessment";
                break;

            case "Interview":
                statusClass = "status-interview";
                break;

            case "Offer":
                statusClass = "status-offer";
                break;

            case "Rejected":
                statusClass = "status-rejected";
                break;
        }


        const row = `
            <tr>
                <td>${job.company}</td>

                <td>${job.role}</td>

                <td>
                    <span class="${statusClass}">
                        ${job.status}
                    </span>
                </td>

                <td>${job.platform}</td>

                <td>${job.appliedDate}</td>

                <td>

                    <button onclick="editJob(${job.id})">
                        Edit
                    </button>

                    <button onclick="deleteJob(${job.id})">
                        Delete
                    </button>

                </td>
            </tr>
        `;

        tableBody.innerHTML += row;
    });


    updateDashboard(jobs);

    updateCharts(jobs);
}


async function deleteJob(id) {

    if (!confirm("Delete this application?")) {
        return;
    }


    try {

        const response = await fetch(
            `/api/jobs/${id}`,
            {
                method: "DELETE"
            }
        );


        if (!response.ok) {
            throw new Error("Delete failed");
        }


        loadJobs();


    } catch (error) {

        alert("Could not delete application.");

        console.log(error);
    }
}


function editJob(id) {

    const job =
        allJobs.find(job => job.id === id);


    if (!job) {
        return;
    }


    document.getElementById("company").value =
        job.company;

    document.getElementById("role").value =
        job.role;

    document.getElementById("platform").value =
        job.platform;

    document.getElementById("appliedDate").value =
        job.appliedDate;

    document.getElementById("status").value =
        job.status;

    document.getElementById("followUpDate").value =
        job.followUpDate;

    document.getElementById("resumeVersion").value =
        job.resumeVersion;

    document.getElementById("notes").value =
        job.notes;


    editingId = id;


    document.querySelector("#jobForm button").textContent =
        "Update Application";


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
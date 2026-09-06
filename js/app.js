const form = document.getElementById("jobForm");

const API_URL = "/api/jobs";


async function loadJobs() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load applications");
        }

        const jobs = await response.json();

        displayJobs(jobs);

    } catch (error) {

        console.log("Backend connection failed:", error);

    }
}


form.addEventListener("submit", async function (e) {

    e.preventDefault();

    const job = {

        id: editingId || Date.now(),

        company:
            document.getElementById("company").value,

        role:
            document.getElementById("role").value,

        platform:
            document.getElementById("platform").value,

        appliedDate:
            document.getElementById("appliedDate").value,

        status:
            document.getElementById("status").value,

        followUpDate:
            document.getElementById("followUpDate").value,

        resumeVersion:
            document.getElementById("resumeVersion").value,

        notes:
            document.getElementById("notes").value
    };


    try {

        const url = editingId
            ? `${API_URL}/${editingId}`
            : API_URL;

        const method = editingId
            ? "PUT"
            : "POST";


        const response = await fetch(url, {

            method: method,

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(job)

        });


        if (!response.ok) {
            throw new Error("Failed to save application");
        }


        alert(
            editingId
                ? "Application Updated Successfully!"
                : "Application Saved Successfully!"
        );


        editingId = null;

        form.reset();


        document.querySelector("#jobForm button").textContent =
            "Add Application";


        loadJobs();


    } catch (error) {

        alert("Could not connect to backend.");

        console.log(error);

    }

});


document
    .getElementById("statusFilter")
    .addEventListener("change", loadJobs);


document
    .getElementById("searchInput")
    .addEventListener("input", loadJobs);


loadJobs();
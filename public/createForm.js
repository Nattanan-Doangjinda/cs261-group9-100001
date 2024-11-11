document.addEventListener("DOMContentLoaded", function () {
    const addSubject = document.getElementById("addSubject");
    const withDraw = document.getElementById("withDraw");
    const resign = document.getElementById("resign");
    const crossProgram = document.getElementById("crossProgram");

    const urlParams = new URLSearchParams(window.location.search);
    console.log(window.location.search)
    const userID = urlParams.get('id');

    if (userID) {
        document.getElementById("homepage-link").href += `?id=${userID}`;
        document.getElementById("createForm-link").href += `?id=${userID}`;
        document.getElementById("draft-link").href += `?id=${userID}`;
    }

    // Check if userID is available
    if (!userID) {
        console.warn("User ID is missing from URL parameters.");
        return;
    }

    if (addSubject) {
        addSubject.addEventListener("click", () => {
            window.location.href = `../views/request_add_subject.html?id=${userID}`;
        });
    }

    if (withDraw) {
        withDraw.addEventListener("click", () => {
            window.location.href = `../views/request_withdraw.html?id=${userID}`;
        });
    }

    if (resign) {
        resign.addEventListener("click", () => {
            window.location.href = `../views/resignation_form.html?id=${userID}`;
        });
    }

    if (crossProgram) {
        crossProgram.addEventListener("click", () => {
            window.location.href = `../views/register_cross_program.html?id=${userID}`;
        });
    }
});

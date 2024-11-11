const addSubject = document.getElementById("addSubject")
const withDraw = document.getElementById("withDraw")
const resign = document.getElementById("resign")
const crossProgram = document.getElementById("crossProgram")
const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get('userID');
// let requestFormId = localStorage.getItem("requestFormId");

addSubject.addEventListener("click" , () => {
    // window.location.href = "request_add_subject.html";
     window.location.href = `../views/request_add_subject.html?id=${userID}`
    // localStorage.setItem("editingExistingDraft", "true");
})

withDraw.addEventListener("click",() => {
    window.location.href = `../views/request_withdraw.html?id=${userID}`;
})

resign.addEventListener("click",() => {
    // window.location.href = "resignation_form.html";
    window.location.href = `../views/resignation_form.html?id=${userID}`;
})

crossProgram.addEventListener("click",() => {
    // window.location.href = "register_cross_program.html";
    window.location.href = `../views/register_cross_program.html?id=${userID}`;
})


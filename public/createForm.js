const addSubject = document.getElementById("addSubject")
const withDraw = document.getElementById("withDraw")
const resign = document.getElementById("resign")
const crossProgram = document.getElementById("crossProgram")
const userId = localStorage.getItem('userId');
let requestFormId = localStorage.getItem("requestFormId");

addSubject.addEventListener("click" , () => {
    window.location.href = "request_add_subject.html";
    // localStorage.setItem("editingExistingDraft", "true");
})

withDraw.addEventListener("click",() => {
    window.location.href = "request_withdraw.html";
})

resign.addEventListener("click",() => {
    window.location.href = "resignation_form.html";
})

crossProgram.addEventListener("click",() => {
    window.location.href = "request_cross_program.html";
})


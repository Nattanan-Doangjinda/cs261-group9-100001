const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get('id');
const draftForm = document.getElementById("draftForm")
var registerCross = "../views/modify_request_cross.html"
var requestAdd = "../views/modify_request_add.html"
var requestWithdraw = "../views/modify_request_withdrow.html"
var resignationForm = "../views/modify_resignation.html"

window.onload = async () => {
    const response = await fetch(`http://localhost:8000/user/draft/${userID}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    var drafts = await response.json()
    console.log(drafts)
    
    if (userID) {
        document.getElementById("homepage-link").href += `?id=${userID}`;
        document.getElementById("createForm-link").href += `?id=${userID}`;
        document.getElementById("draft-link").href += `?id=${userID}`;
    }
    if (!drafts || drafts.length === 0) {
        draftForm.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;
    }else{
        draftForm.innerHTML = "";   
        drafts.forEach((draft) => {
            if (!draft) {
                draftForm.innerHTML = `<p class="text">ไม่พบข้อมูล...<p>`; 
            }
            const wrapper = document.createElement("div");
            wrapper.classList.add("wrapper");
            var data = `<div class="wrapper">
                        <div class="textContainer">
                            <h1 class="text">แบบร่างเขียนคำร้อง${draft.type}</h1>
                            <h1 class="date">แก้ไขล่าสุดเมื่อ ${draft.date} น.</h1>
                        </div>
                        <div class="btnContainer">
                            <button class="btn1" onclick="adjustDraft('${draft.type}',${draft.requestFormId})">แก้ไข</button>
                            <button class="btn2" onclick="deleteDraft(${draft.requestFormId})">ยกเลิก</button>
                        </div>
                    </div>`
            draftForm.innerHTML += data;
        });   
    }
}

const deleteDraft = async (requestFormId) => {
    await fetch(`http://localhost:8000/user/${requestFormId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    })
    window.location.reload();
}
// console.log(drafts)
const adjustDraft = (type,requestFormId) => {
    if(type === "ขอจดทะเบียนเพิ่มวิชา"){
        ref = requestAdd
    } else if (type === "ขอถอนรายวิชา") {
        ref = requestWithdraw
    } else if (type === "ขอลาออก"){
        ref = resignationForm
    } else {
        ref = registerCross
    }
    // console.log(requestFormId)
    window.location.href= `${ref}?requestFormId=${requestFormId}`
}
const pendingDrop = document.querySelector('.pending-drop');
const approveDrop = document.querySelector('.approve-drop');
const rejectDrop = document.querySelector('.reject-drop');
const cancelBtn = document.querySelector('.cancel-btn');
const pendingStatusList = document.querySelector('.pending-container');
const approveStatusList = document.querySelector('.approve-container');
const rejectStatusList = document.querySelector('.reject-container');
var pendingContainer = document.querySelector('.pending-container')
var approveContainer = document.querySelector('.approve-container')
var rejectContainer = document.querySelector('.reject-container')
var registerCross = "modify_request_cross.html"
var requestAdd = "modify_request_add.html"
var requestWithdraw = "modify_request_withdrow.html"
var resignationForm = "modify_resignation.html"

pendingDrop.addEventListener('click' , () => {
    console.log("button is clicked")
    pendingStatusList.classList.toggle('hide-status');
});

approveDrop.addEventListener('click' , () => {
    console.log("button is clicked")
    approveStatusList.classList.toggle('hide-status');
});

rejectDrop.addEventListener('click' , () => {
    console.log("button is clicked")
    rejectStatusList.classList.toggle('hide-status');
});

var request = null


window.onload = async function() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');

    if (id) {
        document.getElementById("homepage-link").href += `?id=${id}`;
        document.getElementById("createForm-link").href += `?id=${id}`;
        document.getElementById("draft-link").href += `?id=${id}`;
    }

    const response = await fetch(`http://localhost:8000/user/published/${id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    })
    request = await response.json()
    console.log(request)

    pendingContainer.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;
    approveContainer.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;
    rejectContainer.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;

    var pendingtext = document.querySelector('.pending-text')
    request.forEach(item => {
        var data = null
        var ref = null
        pendingContainer.innerHTML = ``;
        approveContainer.innerHTML = ``;
        rejectContainer.innerHTML = ``;

        if(item.type === "ขอจดทะเบียนเพิ่มวิชา"){
            ref = requestAdd
        } else if (item.type === "ขอถอนรายวิชา") {
            ref = requestWithdraw
        } else if (item.type === "ขอลาออก"){
            ref = resignationForm
        } else {
            ref = registerCross
        }

        if(item.status === "รอดำเนินการ" ){
            data = `<div class="pending-status">
                <p class="pending-text">${item.type}</p>
                <div class="pending-btns">
                   <button class="edit-btn" onclick="window.location.href='${ref}?id=${item.requestFormId}'">แก้ไข</button>
                    <button class="cancel-btn" onclick="requestDel(${item.requestFormId})">ยกเลิก</button>
                </div>
                </div>`
            pendingContainer.innerHTML += data
        } if (item.status === "อนุมัติ"){
            data = `<div class="approve-status">
                    <p>${item.type}</p>
                    <button class="approve-btn">อนุมัติ</button>
                    </div>`
            approveContainer.innerHTML += data
        
        } if(item.status === "ปฏิเสธ") {
            data = `<div class="reject-status"><p>${item.type}</p><button class="reject-btn">ถูกปฏิเสธ</button></div>`
            rejectContainer.innerHTML += data
        }      
        
        if (pendingContainer.innerHTML == "") {
            pendingContainer.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;
        }
        if (approveContainer.innerHTML == "") {
            approveContainer.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;
        }
        if (rejectContainer.innerHTML == "") {
            rejectContainer.innerHTML = `<p class="text">ไม่พบข้อมูล...</p>`;
        }
    });
}

const requestDel = async (id) =>{
    await fetch(`http://localhost:8000/user/${id}`, {
        method: 'DELETE'
    })
    window.location.reload();
}

document.getElementById('logout').addEventListener('click' , () => {
    window.location.href = window.location.href = `../views/login.html`;
  })
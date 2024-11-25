const approveDrop = document.querySelector(".approve-drop");
const approveStatusList = document.querySelector(".approve-container");

// var registerCross = "modify_request_cross.html";
// var requestAdd = "modify_request_add.html";
// var requestWithdraw = "modify_request_withdrow.html";
// var resignationForm = "modify_resignation.html";
var requestForm = "request.html"

// Toggle the approve status list visibility
approveDrop.addEventListener("click", () => {
  console.log("Approve button is clicked");
  approveStatusList.classList.toggle("hide-status");
});

document.getElementById("accept-link").addEventListener("click" , () => {
  window.location.href = `../views/Accept.html`
})
document.getElementById("reject-link").addEventListener("click" , () => {
  window.location.href = `../views/Reject.html`
})

var request = null;

window.onload = async function () {
  const urlParams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");

  // Add the id to links if it's available
  if (id) {
    document.getElementById("teacherHomepage-link").href += `?id=${id}`;
    document.getElementById("accept-link").href += `?id=${id}`;
    document.getElementById("reject-link").href += `?id=${id}`;
  }

  // Fetch the data for the request
  const response = await fetch(`http://localhost:8000/employee/request/history`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  request = await response.json();
  console.log(request);

  // Loop through the data and append the approve statuses
  request.forEach((item) => {
    let ref = null;

    // Set the appropriate reference for each type of request
    // if (item.type === "ขอจดทะเบียนเพิ่มวิชา") {
    //   ref = requestAdd;
    // } else if (item.type === "ขอถอนรายวิชา") {
    //   ref = requestWithdraw;
    // } else if (item.type === "ขอลาออก") {
    //   ref = resignationForm;
    // } else {
    //   ref = registerCross;
    // }

    // Only append if the status is "อนุมัติ"
    if (item.status === "อนุมัติ") {
      // Format the approval time 

      const data = `<div class="approve-status-container">
                        <p class="approve-no-data"></p>  
                        <div class="approve-container">
                            <div class="approve-status">
                                <div class="approve-text">
                                    <i class="bx bxs-circle approve-status-color"></i>
                                    <div class="text-container">
                                        <p style="font-size: 25px">${item.type}</p> <!-- Dynamic type -->
                                        <p class="sub-text">อนุมัติเมื่อ: ${item.date} น.</p> 
                                    </div>
                                </div>
                                <button class="approve-btn" onclick="window.location.href='${requestForm}?id=${item.requestFormId}'">รายละเอียด</button>
                            </div>
                        </div>
                      </div>`;
      document.getElementById("approve-container").innerHTML += data;
    }
  });
};

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  window.location.href = `../views/login.html`;
});
const rejectDrop = document.querySelector(".reject-drop");
const rejectStatusList = document.querySelector(".reject-container");

// var registerCross = "modify_request_cross.html";
// var requestAdd = "modify_request_add.html";
// var requestWithdraw = "modify_request_withdrow.html";
// var resignationForm = "modify_resignation.html";
var requestForm = "request.html"

// Toggle the reject status list visibility
rejectDrop.addEventListener("click", () => {
  console.log("reject button is clicked");
  rejectStatusList.classList.toggle("hide-status");
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

  // Loop through the data and append the reject statuses
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

    // Only append if the status is "ปฏิเสธ"
    if (item.status === "ปฎิเสธ") {
      const data = `<div class="reject-status-container">
                      <p class="reject-no-data"></p>  
                      <div class="reject-container">
                          <div class="reject-status">
                              <div class="reject-text">
                                  <i class="bx bxs-circle reject-status-color"></i>
                                  <div class="text-container">
                                      <p style="font-size: 25px">${item.type}</p>
                                      <p class="sub-text">ปฏิเสธเมื่อ: ${item.date} น.</p> 
                                  </div>
                              </div>
                              <button class="reject-btn" onclick="window.location.href='${requestForm}?id=${item.requestFormId}'">รายละเอียด</button>
                          </div>
                      </div>
                    </div>`;
      document.getElementById("reject-container").innerHTML += data;
    }
  });
};

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  window.location.href = `../views/login.html`;
});
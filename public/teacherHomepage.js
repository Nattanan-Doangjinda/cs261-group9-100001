const teacherHomepageDrop = document.querySelector(".teacherHomepage-drop");
const teacherHomepageStatusList = document.querySelector(".teacherHomepage-container");

// var registerCross = "modify_request_cross.html";
// var requestAdd = "modify_request_add.html";
// var requestWithdraw = "modify_request_withdrow.html";
// var resignationForm = "modify_resignation.html";
var requestForm = "request.html"

// Toggle the teacherHomepage status list visibility
teacherHomepageDrop.addEventListener("click", () => {
  console.log("teacherHomepage button is clicked");
  teacherHomepageStatusList.classList.toggle("hide-status");
});

document.getElementById("teacherHomepage-link").addEventListener("click" , () => {
  window.location.href = `../views/TeacherHomepage.html.html`
})
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
  const response = await fetch(`http://localhost:8000/employee/request/`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  request = await response.json();
  console.log(request);

  // Loop through the data and append the teacherHomepage statuses
  request.forEach((item) => {
    let ref = null;

    // // Set the appropriate reference for each type of request
    // if (item.type === "ขอจดทะเบียนเพิ่มวิชา") {
    //   ref = requestAdd;
    // } else if (item.type === "ขอถอนรายวิชา") {
    //   ref = requestWithdraw;
    // } else if (item.type === "ขอลาออก") {
    //   ref = resignationForm;
    // } else {
    //   ref = registerCross;
    // }

    // Only append if the status is "รอดำเนินการ"
    if (item.status === "รอดำเนินการ") {
      // Format the pending time
      const data = `<div class="teacherHomepage-status-container">
                        <p class="teacherHomepage-no-data"></p>  
                        <div class="teacherHomepage-container">
                            <div class="teacherHomepage-status">
                                <div class="teacherHomepage-text">
                                    <i class="bx bxs-circle teacherHomepage-status-color"></i>
                                    <div class="text-container">
                                        <p style="font-size: 25px">${item.type}</p> <!-- Dynamic type -->
                                        <p class="sub-text">ส่งเมื่อ: ${item.date} น.</p> 
                                    </div>
                                </div>
                                <button class="teacherHomepage-btn" onclick="window.location.href='${requestForm}?id=${item.requestFormId}'">รายละเอียด</button>
                            </div>
                        </div>
                      </div>`;
     document.getElementById("teacherHomepage-container").innerHTML += data;
    }
  });
};

// Logout functionality
document.getElementById("logout").addEventListener("click", () => {
  window.location.href = `../views/teacherLogin.html`;
});
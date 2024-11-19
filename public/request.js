let userID;
window.onload = async function() {
  const urlParams = new URLSearchParams(window.location.search);
  const requestFormId = urlParams.get('id');
    const header = {
        "Content-Type": "application/json"
    };
    const url = "http://localhost:8000/user/request/"+requestFormId;
    const response = await fetch(url, {
        method: "GET",
        headers: header,
    });
    if (response.ok) {
        const data = await response.json();
      userID = data.userId;
        //ชื่อ
        const studentName = data.details.studentName;
        const nameParts = studentName.split(" ");
        const title = nameParts[0] || '';  
        const firstName = nameParts[1] || '';  
        const lastName = nameParts[2] || '';  
        
        //address
        const address =data.details.address;
        const addressParts = address.split(" ");
        const no = addressParts[0] || ''; 
        const sub_district = addressParts[1] || '';
        const district = addressParts[2] || '';
        const province = addressParts[3] || '';
        
        //term year
        const termYear = data.details.Semester;
        const term = termYear.split('/')[0];
        const year = termYear.split('/')[1];
        
        type= "เรื่อง "+data.type;
        document.getElementById('header').innerHTML = type;
        document.getElementById('title').value = title; 
        document.getElementById('first_name').value = firstName;
        document.getElementById('last_name').value = lastName;
        document.getElementById('student_id').value = data.details.studentId;
        document.getElementById('semester').value = data.details.year;
        document.getElementById('address').value = no;
        document.getElementById('sub_district').value = sub_district;
        document.getElementById('district').value = district;
        document.getElementById('province').value = province;
        document.getElementById('phone').value = data.details.contact;
        document.getElementById('guardian_phone').value = data.details.parentContactNumber;
        document.getElementById('advisor').value = data.details.advisor;
        document.getElementById('term').value = term;
        document.getElementById('year').value = year;
        document.getElementById('course_code').value = data.details.courseId;
        document.getElementById('course_name').value = data.details.courseName;
        document.getElementById('section').value = data.details.section;
        document.getElementById('reason').value = data.details.requestReason;
        updateLinks(userID);

    } else {
        console.log("Error:", response.status);
        alert("ไม่สามารถดึงข้อมูลได้");
    }
}

document.getElementById('approve').addEventListener('change', function() {
    var submitButton = document.getElementById('submit-button');
    if (this.checked) {  // ถ้า "อนุมัติคำร้อง" ถูกเลือก
        submitButton.classList.add('green');
        submitButton.classList.remove('red');
    } else {
        submitButton.classList.remove('green');
    }
});
document.getElementById('reject').addEventListener('change', function() {
    var reasonTextarea = document.getElementById('approve_reason');
    
    // ถ้าตัว checkbox "ปฏิเสธคำร้อง" ถูกเลือก ให้แสดง textarea
    if (this.checked) {
        reasonTextarea.style.display = 'block'; // แสดง textarea
        reasonTextarea.removeAttribute('readonly'); // ลบ readonly
    } else {
        reasonTextarea.style.display = 'none'; // ซ่อน textarea
        reasonTextarea.setAttribute('readonly', 'true'); // เพิ่ม readonly กลับเข้าไป
    }
});





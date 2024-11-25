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
        

        if (data.type == "ขอจดทะเบียนเพิ่มวิชา") {
            document.getElementById('purpose').innerHTML = "ประสงค์จะยื่นคำร้องเรื่อง จดทะเบียนล่าช้า / เพิ่มล้าช้า";
        }
        else if (data.type == "ขอถอนรายวิชา"){
            document.getElementById('purpose').innerHTML = "ประสงค์จะยื่นคำร้องเรื่อง ขอถอนวิชา/รายวิชา (Drop W)";
        }
        else if (data.type == "ขอลาออก"){
            document.getElementById('purpose').innerHTML = "ประสงค์จะยื่นคำร้องเรื่อง ขอลาออก";
        }
        else if (data.type == "จดทะเบียนวิชาข้ามหลักสูตร"){
            document.getElementById('purpose').innerHTML = "ประสงค์จะยื่นคำร้องเรื่อง ขอจดทะเบียนศึกษารายวิชาข้ามหลักสูตร";
        }
            
        var form1 = document.getElementById('form-1');
        var form2 = document.getElementById('form-2');

        if (data.type === "ขอลาออก") {
            form1.style.display = 'block';  // แสดง form 1
            form2.style.display = 'none';   // ซ่อน form 2
        } else {
            form1.style.display = 'none';   // ซ่อน form 1
            form2.style.display = 'block';  // แสดง form 2
        }

        var Approval = document.getElementById('Approval');
        var History = document.getElementById('History');
        var circle = document.getElementById('circle');
        console.log(data.status);
        if(data.status=="รอดำเนินการ"){
            Approval.style.display = 'block';  // แสดง Approval
            History.style.display = 'none';   // ซ่อน History
        }else{
            Approval.style.display = 'none';   // ซ่อน Approval
            History.style.display = 'block';  // แสดง History
            circle.style.display = 'none'; 
            if (data.status == "ปฏิเสธ"){
                circle.style.display = 'block'; 
                reason2 = "ปฏิเสธเนื่องจาก  "+data.reason;
                document.getElementById('reason2').innerHTML = reason2;
            }
        }

        
        //term year
        let term, year, termYear;
        console.log(data.details.sinceSemester);
        console.log(data.details.Semester);
        if (data.type == "ขอลาออก"){
            termYear = data.details.sinceSemester;
            term = termYear.split('/')[0];
            year = termYear.split('/')[1];            
            console.log(term);
            console.log(year);
            document.getElementById('term').value = term;
            document.getElementById('year').value = year;
        }
        else{
            termYear = data.details.Semester;
            term = termYear.split('/')[0];
            year = termYear.split('/')[1];
            console.log(term);
            console.log(year);
            document.getElementById('form-2').querySelector('#term').value = term;  // ตั้งค่า term ใน select ของ form-2
            document.getElementById('form-2').querySelector('#year').value = year;  // ตั้งค่า year ใน select ของ form-2
            document.getElementById('course_code').value = data.details.courseId;
            document.getElementById('course_name').value = data.details.courseName;
            document.getElementById('section').value = data.details.section
            
        } 

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
        document.getElementById('advisor').value = data.details.advisor;;
        document.getElementById('reason').value = data.details.requestReason;
        //updateLinks(userID);
        

    } else {
        console.log("Error:", response.status);
        alert("ไม่สามารถดึงข้อมูลได้");
    }

}

document.getElementById('approve').addEventListener('change', function() {
    var submitButton = document.getElementById('submit-button');
    var reasonTextarea = document.getElementById('approve_reason');
    if (this.checked) {  // ถ้า "อนุมัติคำร้อง" ถูกเลือก
        submitButton.classList.add('green');
        submitButton.classList.remove('red');
        reasonTextarea.style.display = 'none'; // ซ่อน textarea
        reasonTextarea.setAttribute('readonly', 'true'); // เพิ่ม readonly กลับเข้าไป
    } else {
        submitButton.classList.remove('green');
    }
});

document.getElementById('reject').addEventListener('change', function() {
    var submitButton = document.getElementById('submit-button');
    var reasonTextarea = document.getElementById('approve_reason');
    if (this.checked) {  // ถ้า "ปฏิเสธคำร้อง" ถูกเลือก
        submitButton.classList.add('red');
        submitButton.classList.remove('green');
        reasonTextarea.style.display = 'block'; // แสดง textarea
        reasonTextarea.removeAttribute('readonly'); // ลบ readonly
    } else {
        submitButton.classList.remove('red');
        reasonTextarea.style.display = 'none'; // ซ่อน textarea
        reasonTextarea.setAttribute('readonly', 'true'); // เพิ่ม readonly กลับเข้าไป
    }
});


function toggleCheckbox(selected) {
    const approveCheckbox = document.getElementById('approve');
    const rejectCheckbox = document.getElementById('reject');
    const approveReasonTextarea = document.getElementById('approve_reason');
    
    // หากเลือกอนุมัติ จะยกเลิกการเลือกปฏิเสธ
    if (selected === 'approve') {
      rejectCheckbox.checked = false;
      approveReasonTextarea.readOnly = true;
    }
    // หากเลือกปฏิเสธ จะยกเลิกการเลือกอนุมัติ
    if (selected === 'reject') {
      approveCheckbox.checked = false;
      approveReasonTextarea.readOnly = false;
    }
  }

  document.getElementById('submit-button').addEventListener('click', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const requestFormId = urlParams.get('id');
    const approveCheckbox = document.getElementById('approve');
    const rejectCheckbox = document.getElementById('reject');
    const rejectReasonTextarea = document.getElementById('approve_reason'); // ใช้ตัวแปรที่ถูกต้อง
    const Datefrom = getCurrentDateTime(); // ฟังก์ชันที่จะต้องมีการกำหนดไว้

    // ตรวจสอบการเลือกอนุมัติหรือปฏิเสธ
    if (approveCheckbox.checked) {
        const header = {
            "Content-Type": "application/json"
        };
        const body = JSON.stringify({
            "status": "อนุมัติ",
            "reason": "", // ส่งเหตุผลที่กรอกใน textarea
            "dateApprove": Datefrom,
        });

        const url = "http://localhost:8000/employee/request/" + requestFormId; 
        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: header,
                body: body,
            });

            if (response.ok) {
                alert('บันทึก: คำร้องได้รับการอนุมัติ');
                window.location.href = `../views/Accept.html`;
            } else {
                alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            }
        } catch (error) {
            alert('เกิดข้อผิดพลาด: ' + error.message);
        }
    } else if (rejectCheckbox.checked) {
        if (rejectReasonTextarea.value.trim() === '') { 
            alert('กรุณากรอกเหตุผลในการปฏิเสธคำร้อง');
        } else {
            const header = {
                "Content-Type": "application/json"
            };
            const body = JSON.stringify({
                "status": "ปฏิเสธ",
                "reason": rejectReasonTextarea.value,
                "dateApprove": Datefrom,
            });

            const url = "http://localhost:8000/employee/request/" + requestFormId; 
            try {
                const response = await fetch(url, {
                    method: "PUT",
                    headers: header,
                    body: body,
                });

                if (response.ok) {
                    alert('บันทึก: คำร้องถูกปฏิเสธพร้อมเหตุผล: ');
                    window.location.href = `../views/Reject.html`;
                } else {
                    alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
                }
            } catch (error) {
                alert('เกิดข้อผิดพลาด: ' + error.message);
            }
        }
    } else {
        alert('กรุณาเลือกอนุมัติหรือปฏิเสธคำร้อง');
    }
});

  function getCurrentDateTime() {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1;
    const year = currentDate.getFullYear();
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }

  document.getElementById('submit-button2').addEventListener('click', async () => {
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
        if(data.status === "ปฏิเสธ") {
            window.location.href = `../views/Reject.html`;
        }else{
            window.location.href = `../views/Accept.html`;
        }
    }
  });
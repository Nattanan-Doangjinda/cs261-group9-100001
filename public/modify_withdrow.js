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
        if ( data.state === "Published") {
          // ซ่อนปุ่ม "บันทึกแบบร่าง" หาก state คือ "Published"
          document.querySelector(".save-draft").style.display = "none";
      } else {
          // แสดงปุ่ม "บันทึกแบบร่าง" ในกรณีอื่นๆ
          document.querySelector(".save-draft").style.display = "inline-block";
      }
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

function updateLinks(userID) {
  if (userID) {
    document.getElementById("homepage-link").href += `?id=${userID}`;
    document.getElementById("createForm-link").href += `?id=${userID}`;
    document.getElementById("draft-link").href += `?id=${userID}`;
  }
}

document.addEventListener("DOMContentLoaded", async function(event)  {
  const urlParams = new URLSearchParams(window.location.search);
  const requestFormId = urlParams.get('id');
    const submitButton = document.querySelector('.submit');
    submitButton.addEventListener('click', function(event) {
      if (address.value === "") {
        address.value = "-";
      }
      if (sub_district.value === "") {
        sub_district.value = "-";
      }
      if (district.value === "") {
        district.value = "-";
      }
      if (province.value === "") {
        province.value = "-";
      }
        event.preventDefault();
        const form = document.querySelector('form');
          if (form.checkValidity()) {
            savedFormData(form);
          } else {
              alert('กรุณากรอกข้อมูลให้ครบทุกช่อง!');
          }
    });
  
    const saveDraftButton = document.querySelector('.save-draft');
    saveDraftButton.addEventListener('click', function(event) {
        event.preventDefault();
        saveDraft();
    });
  
    const cancelButton = document.querySelector('.cancel');
    cancelButton.addEventListener('click', function(event) {
      ReturnToHomepage()
    });
  
    async function savedFormData() {
      const savedData = new FormData(document.querySelector('form'));
      const formDataObj = formDataToJSON(savedData); 
      const Datefrom = getCurrentDateTime();
      console.log('ข้อมูลที่ถูกบันทึก:', formDataObj);
      const header = {
          "Content-Type": "application/json"
      };
  
      const body = JSON.stringify({
          "status": "รอดำเนินการ",
          "state": "Published",
          "type": "ขอถอนรายวิชา",
          "details": {
              "date" : Datefrom,
              "studentName": formDataObj.title+" "+formDataObj.first_name+" "+formDataObj.last_name,
              "studentId": formDataObj.student_id,
              "year": formDataObj.semester,
              "address": formDataObj.address + " " + formDataObj.sub_district + " " + formDataObj.district + " " + formDataObj.province,
              "contact": formDataObj.phone,
              "parentContactNumber": formDataObj.guardian_phone,
              "advisor": formDataObj.advisor,
              "sinceSemester": "",
              "Semester": formDataObj.term + "/" + formDataObj.year,
              "courseId": formDataObj.course_code,
              "courseName": formDataObj.course_name,
              "section": formDataObj.section,
              "requestReason": formDataObj.reason
          }
      });
  
      const url = "http://localhost:8000/user/"+requestFormId;
      const response = await fetch(url, {
          method: "PUT",
          headers: header,
          body: body,
      });
  
      if (response.ok) {
        showModal(); // แสดง pop-up เมื่อส่งฟอร์มสำเร็จ
      } else {
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
  }
  
  
    async function saveDraft() {
      const savedData = new FormData(document.querySelector('form'));
      const formDataObj = formDataToJSON(savedData); 
      const Datefrom = getCurrentDateTime();
      console.log('ข้อมูลที่ถูกบันทึก:', formDataObj);
      const header = {
          "Content-Type": "application/json"
      };
  
      const body = JSON.stringify({
          "status": "รอดำเนินการ",
          "state": "Draft",
          "type": "ขอถอนรายวิชา",
          "details": {
              "date" : Datefrom,
              "studentName": formDataObj.title+" "+formDataObj.first_name+" "+formDataObj.last_name,
              "studentId": formDataObj.student_id,
              "year": formDataObj.semester,
              "address": formDataObj.address + " " + formDataObj.district + " " + formDataObj.sub_district + " " + formDataObj.province,
              "contact": formDataObj.phone,
              "parentContactNumber": formDataObj.guardian_phone,
              "advisor": formDataObj.advisor,
              "sinceSemester": "",
              "Semester": formDataObj.term + "/" + formDataObj.year,
              "courseId": formDataObj.course_code,
              "courseName": formDataObj.course_name,
              "section": formDataObj.section,
              "requestReason": formDataObj.reason
          }
      });
  
      const url = "http://localhost:8000/user/"+requestFormId;
      const response = await fetch(url, {
          method: "PUT",
          headers: header,
          body: body,
      });
  
      if (response.ok) {
        showModal2(); // แสดง pop-up เมื่อส่งฟอร์มสำเร็จ
      } else {
        alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    }
  
    function ReturnToHomepage(){
      window.location.href = `../views/homepage.html?id=${userID}`;
    }
  
    function formDataToJSON(formData) {
      const obj = {};
      formData.forEach((value, key) => {
        obj[key] = value;
      });
      return obj;
    }
    
    function getCurrentDateTime() {
      const currentDate = new Date();
      const day = currentDate.getDate();
      const month = currentDate.getMonth() + 1; // เดือนเริ่มจาก 0
      const year = currentDate.getFullYear();
      const hours = String(currentDate.getHours()).padStart(2, '0');
      const minutes = String(currentDate.getMinutes()).padStart(2, '0');
      return `${day}/${month}/${year} ${hours}:${minutes}`;
    }
    
    const showModal = () => {
      document.getElementById('successModal').style.display = 'block';
    };
  
    const closeModal = () => {
      document.getElementById('successModal').style.display = 'none';
    };
  
    const closeModalButton = document.getElementById('closeModal'); 
    if (closeModalButton) {
      closeModalButton.addEventListener('click', function() {
        closeModal(); // เมื่อกดปุ่ม "ตกลง" ให้ปิด modal
        ReturnToHomepage();
      });
    }
    
  const showModal2 = () => {
    document.getElementById('successModal2').style.display = 'block';
  };

  const closeModal2 = () => {
    document.getElementById('successModal2').style.display = 'none';
  };

  const closeModalButton2 = document.getElementById('closeModal2'); 
  if (closeModalButton2) {
    closeModalButton2.addEventListener('click', function() {
      closeModal2(); // เมื่อกดปุ่ม "ตกลง" ให้ปิด modal
      ReturnToHomepage();
    });
  }

  });
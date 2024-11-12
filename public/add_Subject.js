document.addEventListener("DOMContentLoaded", async function(event) {
  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get('id');

  const submitButton = document.querySelector('.submit');

  submitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // ป้องกันการ reload หน้า

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

    const form = document.querySelector('form');
    if (form.checkValidity()) {
      await savedFormData(); // เรียกการบันทึกข้อมูล
    } else {
      alert('กรุณากรอกข้อมูลให้ครบทุกช่อง!');
    }
  });

  const saveDraftButton = document.querySelector('.save-draft');
  saveDraftButton.addEventListener('click', async function(event) {
    event.preventDefault(); // ป้องกันการ reload หน้า
    await saveDraft(); // เรียกการบันทึกแบบร่าง
  });

  const cancelButton = document.querySelector('.cancel');
  cancelButton.addEventListener('click', function(event) {
    ReturnToHomepage(); // เปลี่ยนหน้าเมื่อกดปุ่มยกเลิก
  });

  async function savedFormData() {
    const savedData = new FormData(document.querySelector('form'));
    const formDataObj = formDataToJSON(savedData);
    const Datefrom = getCurrentDateTime();

    const header = {
      "Content-Type": "application/json"
    };

    const body = JSON.stringify({
      "status": "รอดำเนินการ",
      "state": "Published",
      "type": "ขอจดทะเบยีนเพิ่มวิชา",
      "details": {
        "date": Datefrom,
        "studentName": formDataObj.title + " " + formDataObj.first_name + " " + formDataObj.last_name,
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

    const url = "http://localhost:8000/user/"+userID;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: body,
    });

    if (response.ok) {
      await showModal(); // แสดง pop-up เมื่อส่งฟอร์มสำเร็จ
      
    } else {
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
  }

  async function saveDraft() {
    const savedData = new FormData(document.querySelector('form'));
    const formDataObj = formDataToJSON(savedData);
    const Datefrom = getCurrentDateTime();

    const header = {
      "Content-Type": "application/json"
    };

    const body = JSON.stringify({
      "status": "รอดำเนินการ",
      "state": "Draft",
      "type": "ขอจดทะเบยีนเพิ่มวิชา",
      "details": {
        "date": Datefrom,
        "studentName": formDataObj.title + " " + formDataObj.first_name + " " + formDataObj.last_name,
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

    const url = "http://localhost:8000/user/"+userID;
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: body,
    });

    if (response.ok) {
      await showModal2(); // แสดง pop-up เมื่อบันทึกสำเร็จ
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึกแบบร่าง');
    }
  }

  function ReturnToHomepage() {
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
    const month = currentDate.getMonth() + 1;
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

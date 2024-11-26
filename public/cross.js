document.addEventListener("DOMContentLoaded", async function(event) {
  const urlParams = new URLSearchParams(window.location.search);
  const userID = urlParams.get('id');

  if (userID) {
    document.getElementById("homepage-link").href += `?id=${userID}`;
    document.getElementById("createForm-link").href += `?id=${userID}`;
    document.getElementById("draft-link").href += `?id=${userID}`;
}

window.onload = async function() {
  const data = localStorage.getItem("DataForShare");
  const responseData = JSON.parse(data);
  console.log(responseData);

  const studentName = responseData.nameTh;
  const nameParts = studentName.split(" ");
  const firstName = nameParts[0] || '';  
  const lastName = nameParts[1] || '';  
  
  document.getElementById('first_name').value = firstName;
  document.getElementById('last_name').value = lastName;
  department = responseData.department;
  console.log(department);
  department = department.replace("ภาควิชา", ""); // ลบคำว่า "ภาควิชา"
  console.log(department);
  department = "สาขาวิชา " + department;
  console.log(department);
  document.getElementById('department').innerHTML = department;
  document.getElementById('student_id').value = responseData.username;
}

  const submitButton = document.querySelector('.submit');

  submitButton.addEventListener('click', async function(event) {
    event.preventDefault(); // ป้องกันการ reload หน้า

    if(title.value.trim() === "") {
      title.classList.add('error');
    }else{
      title.classList.remove('error');
    }
    if(first_name.value.trim() === ""){
      first_name.classList.add('error');
    }else{
      first_name.classList.remove('error');
    }
    if(last_name.value.trim() === ""){
      last_name.classList.add('error');
    }else{
      last_name.classList.remove('error');
    }
    if(student_id.value.trim() === ""){
      student_id.classList.add('error');
    }else{
      student_id.classList.remove('error');
    }
    if(semester.value.trim() === ""){
      semester.classList.add('error');
    }else{
      semester.classList.remove('error');
    }
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
    if(phone.value.trim() === ""){
      phone.classList.add('error');
    }else{
      phone.classList.remove('error');
    }
    if(guardian_phone.value.trim() === ""){
      guardian_phone.classList.add('error');
    }else{
      guardian_phone.classList.remove('error');
    }
    if(advisor.value.trim() === ""){
      advisor.classList.add('error');
    }else{
      advisor.classList.remove('error');
    }
    if(term.value.trim() === ""){
      term.classList.add('error');
    }else{
      term.classList.remove('error');
    }
    if(year.value.trim() === ""){
      year.classList.add('error');
    }else{
      year.classList.remove('error');
    }
    if(course_code.value.trim() === ""){
      course_code.classList.add('error');
    }else{
      course_code.classList.remove('error');
    }
    if(course_name.value.trim() === ""){
      course_name.classList.add('error');
    }else{
      course_name.classList.remove('error');
    }
    if(section.value.trim() === ""){
      section.classList.add('error');
    }else{
      section.classList.remove('error');
    }
    if(reason.value.trim() === ""){
      reason.classList.add('error');
    }else{
      reason.classList.remove('error');
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
      "type": "จดทะเบียนวิชาข้ามหลักสูตร",
      "reason": "",
      "dateApprove": "",
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
      showModal(); // แสดง pop-up เมื่อส่งฟอร์มสำเร็จ
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
      "type": "จดทะเบียนวิชาข้ามหลักสูตร",
      "reason": "",
      "dateApprove": "",
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
      showModal2(); // แสดง pop-up เมื่อบันทึกสำเร็จ
    } else {
      alert('เกิดข้อผิดพลาดในการบันทึกแบบร่าง');
    }
  }

  function ReturnToHomepage() {
    window.location.href = `../views/homepage.html?id=${userID}`;
  }

  function ReturnToDraft() {
    window.location.href = `../views/Draft.html?id=${userID}`;
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
      ReturnToDraft();
    });
  }
});


document.getElementById('logout').addEventListener('click' , () => {
  window.location.href = window.location.href = `../views/login.html`;
})
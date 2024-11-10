// ฟังก์ชันเพื่อส่งข้อมูลฟอร์มไปยัง API
// ฟังก์ชันนี้จะทำการส่งข้อมูลจากฟอร์มไปยัง API ของเซิร์ฟเวอร์ เมื่อผู้ใช้กดส่งฟอร์ม
const submitForm = async () => {
  const form = document.getElementById('register-cross-program-form');
  
  // ดึงข้อมูลจากฟอร์ม และสร้างวัตถุ `formData` เพื่อส่งข้อมูล
  const formData = {
    type: "ขอจดทะเบียนเพิ่มวิชา", // ประเภทคำร้องคือการจดทะเบียนวิชาข้ามหลักสูตร
    details: {
      status: "รอดำเนินการ", // สถานะคำร้อง
      state: "Submitted", // เปลี่ยนจาก "Draft" เป็น "Submitted" เมื่อส่งข้อมูล
      date: new Date().toISOString(), // วัน/เดือน/ปี (ISO format: yyyy-mm-ddT00:00:00Z)
      studentName: `${document.getElementById('title').value} ${document.getElementById('first_name').value} ${document.getElementById('last_name').value}`,
      studentId: document.getElementById('student_id').value,
      semester: document.getElementById('semester').value,
      address: document.getElementById('address').value,
      district: document.getElementById('district').value,
      subDistrict: document.getElementById('sub_district').value,
      province: document.getElementById('province').value,
      contact: document.getElementById('phone').value,
      parentContactNumber: document.getElementById('guardian_phone').value,
      advisor: document.getElementById('advisor').value,
      sinceSemester: "", // Set to empty unless it's a "ลาออก" request
      Semester: `${document.getElementById('year').value}/${document.getElementById('term').value}`, // Combine Year and Term
      courseId: document.getElementById('course_code').value,
      courseName: document.getElementById('course_name').value,
      section: document.getElementById('section').value,
      requestReason: document.getElementById('reason_for_request').value
    }
  };

  // แปลงข้อมูลเป็น JSON เพื่อส่งไปยัง API
  const jsonData = JSON.stringify(formData);
  const userId = localStorage.getItem('userId');

  // เช็คการล็อกอินของผู้ใช้
  if (!userId) {
    alert('กรุณาล็อกอินก่อน');
    return;
  }

  try {
    // แสดง spinner ระหว่างส่งคำขอ
    document.getElementById('loading-spinner').style.display = 'block'; // Show loading spinner

    // ส่งคำขอ POST ไปยัง API เพื่อบันทึกข้อมูล
    const response = await fetch(`http://localhost:8000/user/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: jsonData
    });

    // ซ่อน spinner เมื่อคำขอเสร็จสิ้น
    document.getElementById('loading-spinner').style.display = 'none'; // Hide loading spinner

    // รับผลลัพธ์จาก API และแสดงผลการส่งข้อมูล
    const result = await response.json();
    if (result.message === "Insert success") {
      alert('ส่งคำร้องขอจดทะเบียนวิชาข้ามหลักสูตรสำเร็จ');
      form.reset(); // รีเซ็ตฟอร์ม
      window.location.href = '../views/homepage.html'; // เปลี่ยนหน้าไปที่ homepage
    } else {
      alert('ส่งคำร้องไม่สำเร็จ');
    }
  } catch (error) {
    console.error('Error:', error);
    alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    document.getElementById('loading-spinner').style.display = 'none'; // Hide loading spinner on error
  }
};

// ฟังก์ชันบันทึกแบบร่างในฐานข้อมูลผ่าน backend API
// ฟังก์ชันนี้จะบันทึกข้อมูลฟอร์มเป็นแบบร่าง โดยไม่ส่งข้อมูลไปยัง API จนกว่าจะยืนยัน
const saveDraft = async () => {
  const draftData = {
    title: document.getElementById('title').value,
    first_name: document.getElementById('first_name').value,
    last_name: document.getElementById('last_name').value,
    student_id: document.getElementById('student_id').value,
    semester: document.getElementById('semester').value,
    address: document.getElementById('address').value,
    district: document.getElementById('district').value,
    sub_district: document.getElementById('sub_district').value,
    province: document.getElementById('province').value,
    phone: document.getElementById('phone').value, 
    guardian_phone: document.getElementById('guardian_phone').value, 
    advisor: document.getElementById('advisor').value,
    pre_year: document.getElementById('year').value,
    term: document.getElementById('term').value,
    course_code: document.getElementById('course_code').value,
    course_name: document.getElementById('course_name').value,
    section: document.getElementById('section').value,
    reason: document.getElementById('reason_for_request').value
  };

  const userId = localStorage.getItem('userId');
  // เช็คการล็อกอินของผู้ใช้
  if (!userId) {
      alert('กรุณาล็อกอินก่อน');
      return;
  }

  try {
      // ส่งข้อมูลไปยัง API เพื่อบันทึกแบบร่าง
      const response = await fetch(`http://localhost:8000/draft/user/${userId}`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(draftData)
      });

      // รับผลลัพธ์จาก API และแสดงผลการบันทึกแบบร่าง
      const result = await response.json();
      if (result.message === "Draft saved successfully") {
          alert('บันทึกแบบร่างสำเร็จ');
      } else {
          alert('ไม่สามารถบันทึกแบบร่างได้');
      }
  } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการบันทึกแบบร่าง');
  }
};

// ฟังก์ชันยกเลิกการกรอก
// ฟังก์ชันนี้จะรีเซ็ตฟอร์มและนำผู้ใช้ไปยังหน้า homepage
const cancelForm = () => {
  const form = document.getElementById('register-cross-program-form');
  form.reset(); // รีเซ็ตข้อมูลในฟอร์ม
  window.location.href = '../views/homepage.html'; // เปลี่ยนหน้าไปที่ homepage
};

// ฟังก์ชันล้างแบบร่าง
// ฟังก์ชันนี้จะลบข้อมูลแบบร่างที่เก็บไว้ใน localStorage
const clearDraft = () => {
  localStorage.removeItem('draft'); // ลบข้อมูลจาก localStorage
  alert('ล้างแบบร่างสำเร็จ');
};

// เพิ่ม Event Listeners สำหรับการจับการคลิกของปุ่มต่างๆ
// เมื่อผู้ใช้คลิกปุ่ม submit จะเรียกฟังก์ชัน submitForm
document.getElementById('submit-form').addEventListener('click', async () => {
  document.getElementById('loading-spinner').style.display = 'block'; // แสดง spinner เมื่อผู้ใช้คลิก submit
  await submitForm();
  document.getElementById('loading-spinner').style.display = 'none'; // ซ่อน spinner หลังจากการส่งข้อมูล
});
// เมื่อผู้ใช้คลิกปุ่ม save draft จะเรียกฟังก์ชัน saveDraft
document.querySelector('.save-draft').addEventListener('click', saveDraft);
// เมื่อผู้ใช้คลิกปุ่ม cancel จะเรียกฟังก์ชัน cancelForm
document.querySelector('.cancel').addEventListener('click', cancelForm);

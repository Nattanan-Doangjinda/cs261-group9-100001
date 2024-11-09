// ฟังก์ชันเพื่อส่งข้อมูลฟอร์มลาออกไปยัง API
const submitForm = async () => {
    const form = document.getElementById('resignation-form');
    
    // ดึงข้อมูลจากฟอร์ม
    const formData = {
      type: "resign", // ประเภทฟอร์มลาออก
      details: {
        status: "รอดำเนินการ",
        date: new Date().toLocaleDateString(),
        studentName: `${document.getElementById('title').value} ${document.getElementById('first_name').value} ${document.getElementById('last_name').value}`,
        studentId: document.getElementById('student_id').value,
        year: document.getElementById('semester').value,
        address: document.getElementById('address').value,
        district: document.getElementById('district').value,
        subDistrict: document.getElementById('sub_district').value,
        province: document.getElementById('province').value,
        contact: document.getElementById('phone').value,
        parentContactNumber: document.getElementById('guardian_phone').value,
        advisor: document.getElementById('advisor').value,
        sinceSemester: document.getElementById('pre_year').value,
        semester: `${document.getElementById('year').value}/${document.getElementById('term').value}`,
        courseId: document.getElementById('course_code').value,
        courseName: document.getElementById('course_name').value,
        section: document.getElementById('section').value,
        requestReason: document.getElementById('reason').value
      }
    };
  
    const jsonData = JSON.stringify(formData);
    const userId = localStorage.getItem('userId'); 
  
    if (!userId) {
      alert('กรุณาล็อกอินก่อน');
      return;
    }
  
    try {
      const response = await fetch(`http://localhost:8000/user/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: jsonData
      });
  
      const result = await response.json();
      if (result.message === "Insert success") {
        alert('ส่งฟอร์มขอลาออกสำเร็จ');
        form.reset();
        window.location.href = '../views/homepage.html';
      } else {
        alert('ส่งฟอร์มไม่สำเร็จ');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('เกิดข้อผิดพลาดในการส่งข้อมูล');
    }
};

// ฟังก์ชันบันทึกแบบร่างในฐานข้อมูลผ่าน backend API
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
      pre_year: document.getElementById('pre_year').value,
      year: document.getElementById('year').value,
      term: document.getElementById('term').value,
      course_code: document.getElementById('course_code').value,
      course_name: document.getElementById('course_name').value,
      section: document.getElementById('section').value,
      reason: document.getElementById('reason').value
    };

    const userId = localStorage.getItem('userId');
    if (!userId) {
        alert('กรุณาล็อกอินก่อน');
        return;
    }

    try {
        const response = await fetch(`http://localhost:8000/draft/user/${userId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(draftData)
        });

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
const cancelForm = () => {
    const form = document.getElementById('resignation-form');
    form.reset();
    window.location.href = '../views/homepage.html';
};

// ฟังก์ชันล้างแบบร่าง
const clearDraft = () => {
    localStorage.removeItem('draft');
    alert('ล้างแบบร่างสำเร็จ');
};

// เพิ่ม Event Listeners
document.getElementById('submit-form').addEventListener('click', submitForm);
document.querySelector('.save-draft').addEventListener('click', saveDraft);
document.querySelector('.cancel').addEventListener('click', cancelForm);

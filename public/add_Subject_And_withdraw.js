document.addEventListener("DOMContentLoaded", function() {
  // การใช้งานฟังก์ชันเมื่อกดปุ่ม "ส่ง"
  const submitButton = document.querySelector('.submit');
  submitButton.addEventListener('click', function(event) {
      event.preventDefault(); // ป้องกันไม่ให้ฟอร์มถูกส่งไป
      const form = document.querySelector('form');
        if (form.checkValidity()) {
          saveFormData();
          ReturnToHomepage()
        } else {
            // ถ้าฟอร์มไม่ถูกต้อง (กรอกข้อมูลไม่ครบ)
            alert('กรุณากรอกข้อมูลให้ครบทุกช่อง!');
        }
  });

  // การใช้งานฟังก์ชันเมื่อกดปุ่ม "บันทึกแบบร่าง"
  const saveDraftButton = document.querySelector('.save-draft');
  saveDraftButton.addEventListener('click', function(event) {
      event.preventDefault(); // ป้องกันไม่ให้ฟอร์มถูกส่งไป
      // ฟังก์ชัน Draft ที่จะทำงานเมื่อกด "บันทึกแบบร่าง"
      saveDraft();
      ReturnToHomepage()
  });

  // การใช้งานฟังก์ชันเมื่อกดปุ่ม "ยกเลิก"
  const cancelButton = document.querySelector('.cancel');
  cancelButton.addEventListener('click', function(event) {
    ReturnToHomepage()
  });

  function saveFormData() {
      const formData = new FormData(document.querySelector('form'));
      console.log('ข้อมูลที่ถูกบันทึก:', formData);
      
      alert('ข้อมูลถูกส่งเรียบร้อย');
  }

  // ฟังก์ชันสำหรับบันทึกแบบร่าง
  function saveDraft() {
      const formData = new FormData(document.querySelector('form'));
      console.log('บันทึกแบบร่าง:', formData);
      // บันทึกลงใน localStorage หรือเซิร์ฟเวอร์สำหรับการบันทึกแบบร่าง
      alert('ข้อมูลถูกบันทึกเป็นแบบร่าง');
  }

  function ReturnToHomepage(){
    window.location.href = '../views/homepage.html'; 
  }
});

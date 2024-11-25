const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-message');

let errors = [];


const submit = async () => {
    const employeeInput = {
        'username': 'employee',
        'type': 'employee',
        'nameTh': '',
        'nameEn': '',
    }
    console.log(usernameInput.value)

    if(usernameInput.value === '' || passwordInput.value === ''){
        errorMsg.innerText = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
        usernameInput.parentElement.classList.add('incorrect');
        passwordInput.parentElement.classList.add('incorrect');
        
    } else {
        try {
            const response = await fetch("http://localhost:8000/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeInput)
            })
            window.location.href = "../views/teacherHomepage.html";
            console.log('login success');
        } catch(error) {
            console.log(error);
        }
    }
    
}
const allInputs = [usernameInput, passwordInput];

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect');
            errorMsg.innerText = '';
        }
    })
})
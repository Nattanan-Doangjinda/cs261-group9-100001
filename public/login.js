// const { response } = require("express");
'use strict';

const usernameInput = document.getElementById('username-input');
const passwordInput = document.getElementById('password-input');
const errorMsg = document.getElementById('error-message');

const apiUrl = "https://restapi.tu.ac.th/api/v1/auth/Ad/verify";
const apiToken = "TUa102b22222c092b0a4d8880665add4bfc4cd74b48ef7b7e2d657e126b6faaf63148ead8e7ce823d2587ec03686d3da84";

let errors = [];

const submit = async () => {
    const userInput = {
        UserName: usernameInput.value,
        PassWord: passwordInput.value
    };

    try {
        const response = await fetch("https://restapi.tu.ac.th/api/v1/auth/Ad/verify", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                "Application-Key": `${apiToken}`
            },
            body: JSON.stringify(userInput)
        });
        const responseData = await response.json();

        const data = {
            'username': responseData.username,
            'type': responseData.type,
            'nameTh': responseData.displayname_th,
            'nameEn': responseData.displayname_en
        }
        // handleResponse(response, responseData)
        if (response.ok && responseData.username) {
            
            const userIdResponse = await fetch("http://localhost:8000/user", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body:JSON.stringify(data)
            })
            const userId = await userIdResponse.json()
            console.log(userId.userId)
            window.location.href = `../views/homepage.html?id=${userId.userId}`
        } else {
            errorMsg.innerText = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
            usernameInput.parentElement.classList.add('incorrect');
            passwordInput.parentElement.classList.add('incorrect');
        }
        
    } catch (error){
        console.log(error)
    } 
}

// function handleResponse(response, responseData){
//     errors = formValidation(usernameInput.value, passwordInput.value, response.ok, responseData);

//     if(errors.length > 0){
//         errorMsg.innerText = errors.join('. ');
//         // e.preventDefault();
//     }
// }

// function formValidation(username, password, status, responseData){
//     let errors = [];

//     if(!status){
//         errors.push('Users or Password Invalid!');
//         usernameInput.parentElement.classList.add('incorrect');
//     }

//     if(username === '' || username == null){
//         errors.push('Username is required');
//         usernameInput.parentElement.classList.add('incorrect');
//     }

//     if(password === '' || password == null){
//         errors.push('Password is required');
//         passwordInput.parentElement.classList.add('incorrect');
//     }

//     if (responseData && username !== responseData.username) {
//         errors.push('Username does not match');
//     }

//     return errors;
// }

const allInputs = [usernameInput, passwordInput];

allInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(input.parentElement.classList.contains('incorrect')){
            input.parentElement.classList.remove('incorrect');
            errorMsg.innerText = '';
        }
    })
})
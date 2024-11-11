// const { response } = require("express");


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

        const data = JSON.stringify({
            studentId: responseData.username
        })
        const userIdResponse = await fetch("http://localhost:8000/user", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: data
        })
        const userId = await userIdResponse.json()
       window.location.href = `../views/homepage.html?id=${userId.userId}`
    } catch (error){

    } 
}

function handleResponse(responseJS){
    errors = formValidation(usernameInput.value, passwordInput.value, responseJS.status);

    if(errors.length > 0){
        errorMsg.innerText = errors.join('. ');
        e.preventDefault();
    } else {
        // app.get()
    }
}

function formValidation(username, password, status){
    let errors = [];

    if(!status){
        errors.push('Users or Password Invalid!');
        usernameInput.parentElement.classList.add('incorrect');
    }

    if(username === '' || username == null){
        errors.push('Username is required');
        usernameInput.parentElement.classList.add('incorrect');
    }

    if(password === '' || password == null){
        errors.push('Password is required');
        passwordInput.parentElement.classList.add('incorrect');
    }

    return errors;
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
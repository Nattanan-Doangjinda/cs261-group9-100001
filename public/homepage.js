const pendingDrop = document.querySelector('.pending-drop');
const approveDrop = document.querySelector('.approve-drop');
const rejectDrop = document.querySelector('.reject-drop');
const cancelBtn = document.querySelector('.cancel-btn');
const pendingStatusList = document.querySelector('.pending-container');
const approveStatusList = document.querySelector('.approve-container');
const rejectStatusList = document.querySelector('.reject-container');

pendingDrop.addEventListener('click' , () => {
    console.log("button is clicked")
    pendingStatusList.classList.toggle('hide-status');
});

approveDrop.addEventListener('click' , () => {
    console.log("button is clicked")
    approveStatusList.classList.toggle('hide-status');
});

rejectDrop.addEventListener('click' , () => {
    console.log("button is clicked")
    rejectStatusList.classList.toggle('hide-status');
});

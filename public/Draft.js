const draftForm = document.getElementById("draftForm");
const requestFormId = localStorage.getItem("requestFormId");
const urlParams = new URLSearchParams(window.location.search);
const userID = urlParams.get('userID');
const time = localStorage.getItem('time')
const Hour = localStorage.getItem('Hour')
const Minute = localStorage.getItem('Minute')

async function loadAllDrafts(adjustKey) {
    const drafts = JSON.parse(localStorage.getItem("drafts")) || [];

    if (drafts.length === 0) {
        draftForm.innerHTML = '<p>ไม่พบข้อมูล...</p>';
        return;
    }

    draftForm.innerHTML = "";
    drafts.forEach((draft, index) => {
        const wrapper = document.createElement("div");
        wrapper.classList.add("wrapper");
        wrapper.setAttribute("data-draft-index", index);

        const textContainer = document.createElement("div");
        textContainer.classList.add("textContainer");
        wrapper.appendChild(textContainer);

        const text = document.createElement("h1");
        text.classList.add("text");
        text.innerText = draft.title;
        textContainer.appendChild(text);

        const date = document.createElement("h1");
        date.classList.add("date");
        date.innerText = draft.date;
        textContainer.appendChild(date);

        const btnContainer = document.createElement("div");
        btnContainer.classList.add("btnContainer");
        wrapper.appendChild(btnContainer);

        const editButton = document.createElement("button");
        editButton.classList.add("btn1");
        editButton.innerText = "แก้ไข";
        btnContainer.appendChild(editButton);

        const deleteButton = document.createElement("button");
        deleteButton.classList.add("btn2");
        deleteButton.innerText = "ยกเลิก";
        btnContainer.appendChild(deleteButton);

        draftForm.appendChild(wrapper);

        deleteButton.addEventListener("click", async () => {
            drafts.splice(index, 1);
            localStorage.setItem("drafts", JSON.stringify(drafts));

            if (draft.requestFormId) {
                try {
                    await fetch(`http://localhost:8000/user/${draft.requestFormId}`, {
                        method: 'DELETE',
                        headers: { 'Content-Type': 'application/json' }
                    });
                } catch (error) {
                    console.error('Error deleting draft:', error);
                    alert('Failed to delete draft.');
                }
            }

            wrapper.remove();
            if (draftForm.children.length === 0) {
                draftForm.innerHTML = '<p>ไม่พบข้อมูล...</p>';
            }
        });

        editButton.addEventListener("click", async () => {
            try {
                const adjustFile = await fetch(`http://localhost:8000/user/draft/${draft.requestFormId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' }
                });
                const file = await adjustFile.json();
                
                // เก็บข้อมูลที่จำเป็นลง localStorage
                localStorage.setItem("adjustFile", JSON.stringify(file));
                localStorage.setItem("currentEditDraftIndex", index);
                localStorage.setItem("requestFormId", draft.requestFormId);
                
                // กำหนดการ redirect ตาม type ของฟอร์ม
                const formType = file.type; // เช็คประเภทฟอร์มจากข้อมูลที่ได้จาก API
                console.log(file)
                let redirectUrl;
                
                switch (formType) {
                    case "crossProgram_course":
                        redirectUrl = "request_cross_program.html";
                        break;
                    case "resign_course":
                        redirectUrl = "resignation_form.html";
                        break;
                    case "addSubject_course":
                        redirectUrl = "request_add_subject.html";
                        break;
                    case "withDraw_course":
                        redirectUrl = "request_withdraw.html";
                        break;
                    default:
                        console.warn("Unknown form type:", formType);
                        alert("ไม่พบประเภทแบบฟอร์มที่ถูกต้อง");
                        return;
                }
                
                window.location.href = redirectUrl;
            } catch (error) {
                console.error('Error fetching adjust file:', error);
                alert('ไม่สามารถโหลดแบบร่างได้');
            }
        });
    });
}

function createDraft(title, sessionKey, adjustKey) {
    if (sessionStorage.getItem(sessionKey) === "true") {
        sessionStorage.removeItem(sessionKey);

        const drafts = JSON.parse(localStorage.getItem("drafts")) || [];
        const existingDraftIndex = drafts.findIndex(draft => draft.requestFormId === requestFormId);

        if (existingDraftIndex === -1) {
            const dateNow = new Date();
            const formattedDate = `แก้ไขล่าสุดเมื่อ ${String(dateNow.getDate())}/${String(dateNow.getMonth() + 1)}/${dateNow.getFullYear()} ${String(dateNow.getHours()).padStart(2, '0')}:${String(dateNow.getMinutes()).padStart(2, '0')} น.`;

            const draftContent = {
                title: title,
                date: formattedDate,
                adjustKey: adjustKey,
                requestFormId: requestFormId
            };

            drafts.push(draftContent);
        } else {
            const dateNow = new Date();
            const formattedDate = `แก้ไขล่าสุดเมื่อ ${String(dateNow.getDate())}/${String(dateNow.getMonth() + 1)}/${dateNow.getFullYear()} ${String(dateNow.getHours()).padStart(2, '0')}:${String(dateNow.getMinutes()).padStart(2, '0')} น.`;
            
            drafts[existingDraftIndex] = {
                ...drafts[existingDraftIndex],
                title: title,
                date: formattedDate
            };
        }

        localStorage.setItem("drafts", JSON.stringify(drafts));
        loadAllDrafts(adjustKey);
    }
}

// Example usage
createDraft("แบบร่างเขียนคำร้องจดทะเบียนข้ามโครงการ", "buttonRegisterCross", "adjustCrossProgram");
createDraft("แบบร่างเขียนคำร้องขอลาออก", "buttonResign", "adjustResign");
createDraft("แบบร่างเขียนคำร้องจดทะเบียนล่าช้า", "buttonAddSubject", "adjustAddSubject");
createDraft("แบบร่างเขียนคำร้องถอนรายวิชา", "buttonWithDraw", "adjustWithDraw");
const guestbookBtn = document.getElementById('guestbookbtn');
const body = document.body;

const getMessages = async () => {
    const url = 'https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages';

    const response = await fetch(url);
    if(!response.ok){
        throw new Error('서버 응답 오류');
    }
    const result = await response.json();

    const orderedDate = result.sort((a, b) => a.time._seconds - b.time._seconds)

    return orderedDate;
}

const postMessages = async (name, message) => {
    const url = 'https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages';

    const data = {
        name : name,
        message : message
    }
    const req = {
        method : 'POST',
        // mode: "no-cors",
        headers: {
            // "Content-Type": "application/json",
            "Content-Type": "text/plain",

        },
        referrerPolicy: "no-referrer",
        body : JSON.stringify(data)
    };

    try {
        const response = await fetch(url, req);
        
        if(!response.ok){
            throw new Error('서버 응답 실패');
        }
        
        const result = await response.text();

        return result;

    }catch(error){
        console.log(error)
    }
    
}

const delMessages = async (name) => {
    const url = `https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages/${name}`;

    const req = {
        method : 'DELETE',
        referrerPolicy: "no-referrer",
    };

    try {
        const response = await fetch(url, req);

        if(!response.ok){
            throw new Error('서버 응답 실패');
        }
        
        const result = await response.text();

        return result;

    }catch(error){
        console.log(error)
    }
}

const insertGuestbookHtml = () => {
    const temp_html = `
        <div class="guestbook-modal">
            <div class="guestbook-inner">
                <div class="guestbook-contents">
                </div>
                <div class="sumbit-area">
                    <input id="guestbook-name" type="text" placeholder="이름 입력"></input>
                    <input id="guestbook-input" type="text" placeholder="내용 입력"></input>
                    <button id="guestbook-sumbit">제출</button>
                </div>
            </div>
        </div>`;

    body.insertAdjacentHTML('afterbegin', temp_html);
}

const messagesToHtml = (messages) => {
    const mapped = messages.map((e,i) => {
        const temp_html = `
            <div class='messagebox'>
                <p>
                    <span>${e.message}</span>
                    <span>from ${e.name}</span>
                    <span id='delete'>x</span>
                </p>
            </div>`
        return temp_html;
    })
    const joind = mapped.join('');
    return joind;
}

const drawMessages = async () => {
    const messages = await getMessages();
    const messagesHtml = messagesToHtml(messages);

    const parent = document.querySelector('.guestbook-contents');
    if(parent) {
        parent.innerHTML = '';  // 기존 내용을 모두 비우기
        parent.insertAdjacentHTML('beforeend', messagesHtml)
    }
}

const handleGuestBtnClick = async (event) => {
    const messages = await getMessages();

    insertGuestbookHtml();
    
    await drawMessages();

    const messageInput = document.getElementById('guestbook-input');
    const nameInput = document.getElementById('guestbook-name');
    const submitBtn = document.getElementById('guestbook-sumbit');
    const modal = document.querySelector('.guestbook-modal');
    let delBtns = document.querySelectorAll('#delete');

    if(modal) modal.addEventListener('click', (e) => {
        if(e.target === e.currentTarget){
            e.currentTarget.remove();
        }
    })

    let messageValue = '';
    let nameValue = '';

    const getInputValue = event => messageValue = event.target.value;
    const getNameValue = event => nameValue = event.target.value;

    const addDelListener = () => {
        delBtns = document.querySelectorAll('#delete');
        if(delBtns){ 
            delBtns.forEach((e, i) => {
                e.addEventListener('click', (event) => handledelete(event, i));
            })
        }
    }

    const handledelete = async (event, index) => {
        const newMessages = await getMessages();
        const name = newMessages[index].name;
        const result = await delMessages(name);
        console.log('지우기 성공');
        await drawMessages();
        addDelListener();
    }

    const handleSumbit = async () => {
        if(nameValue.length < 1) {
            alert('이름을 먼저 입력하세요.');
            return;
        }else if(messageValue.length < 1){
            alert('메시지를 입력하세요.');
            return;
        }

        const result = await postMessages(nameValue, messageValue);
        await drawMessages();

        addDelListener();
    } 

    if(messageInput) messageInput.addEventListener('input', getInputValue);
    if(nameInput) nameInput.addEventListener('input', getNameValue);
    if(submitBtn) submitBtn.addEventListener('click', handleSumbit);

    addDelListener();
}

guestbookBtn.addEventListener('click', handleGuestBtnClick);
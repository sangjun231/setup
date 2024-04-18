// 방명록 버튼 선택 
const guestbookBtn = document.getElementById('guestbookbtn');
// 바디 선택(모달을 바디에 붙일예정)
const body = document.body;

// 모든 메시지 가져오는 ajax 함수(get)
const getMessages = async () => {
    const url = 'https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages';
    // fetch GET
    const response = await fetch(url);
    // 응답이 not ok 면 에러 쓰로우
    if(!response.ok){
        throw new Error('서버 응답 오류');
    }
    // 요청 본문 파싱
    const result = await response.json();
    // 파싱된 결과 time 프로퍼티로 정렬
    const orderedDate = result.sort((a, b) => a.time._seconds - b.time._seconds)
    // 정렬된 결과 리턴
    return orderedDate;
}

// 새 메시지 등록하는 ajax 함수(post)
// name 은 사용자가 입력한 이름
// message 는 사용자가 입력한 메시지
const postMessages = async (name, message) => {
    const url = 'https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages';
    // 요청 본문 데이터
    const data = {
        name : name,
        message : message
    }
    // 리퀘스트 객체 설정
    const req = {
        method : 'POST',
        headers: {
            // cors 문제를 방지하기 위해 text/plain 으로 그냥 사용
            // "Content-Type": "application/json",
            "Content-Type": "text/plain",
        },
        referrerPolicy: "no-referrer",
        // 요청 본문 stringify
        body : JSON.stringify(data)
    };

    try {
        // fetch POST
        const response = await fetch(url, req);
        // 응답이 not ok 면 에러 쓰로우
        if(!response.ok){
            throw new Error('서버 응답 실패');
        }
        // 결과 본문 .text(firebase 에 새로 create 된 문서의 id 를 알려주긴함...)
        const result = await response.text();
        // 결과 본문 리턴
        return result;

    }catch(error){
        console.log(error)
    }
}

// 메시지 삭제 ajax 함수
// name 은 삭제하고자 하는 게시물의 게시자
const delMessages = async (name) => {
    const url = `https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages/${name}`;
    // 리퀘스트 객체 설정
    const req = {
        method : 'DELETE',
        referrerPolicy: "no-referrer",
    };

    try {
        // fetch DELETE
        const response = await fetch(url, req);
        // 응답이 not ok 면 에러 쓰로우
        if(!response.ok){
            throw new Error('서버 응답 실패');
        }
        // 결과 본문 .text(아무 응답 없음...)
        const result = await response.text();
        // 결과 리턴
        return result;

    }catch(error){
        console.log(error)
    }
}

// 방명록 버튼 클릭시 바디 바로 아래에 모달 엘리먼트들 추가하는 함수
const insertGuestbookHtml = () => {
    const temp_html = `
        <div class="guestbook-modal">
            <div class="guestbook-inner">
                <div class="guestbook-contents">
                </div>
                <div class="submit-area">
                    <input id="guestbook-name" type="text" placeholder="이름 입력"></input>
                    <input id="guestbook-input" type="text" placeholder="내용 입력"></input>
                    <button id="guestbook-submit">제출</button>
                </div>
            </div>
        </div>`;

    body.insertAdjacentHTML('afterbegin', temp_html);
}

// 메시지들 반복 돌려서 html 로 반환하는 함수
// messages 는 GET 요청 날려서 받은 모든 메시지 배열넣어줘야 함
const messagesToHtml = (messages) => {
    // messages로 map 돌려서 데이터바인딩 후 html 리턴
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
    // 콤마 없이 조인
    const joined = mapped.join('');
    return joined;
}

// 메시지를 추가하거나 삭제할때마다 모든 기존 메시지 지우고 새로 삽입하는 함수
const drawMessages = async () => {
    // GET 요청 날려서 모든 메시지 가져오고
    const messages = await getMessages();
    // 가져온 메시지로 반복돌려서 html 만들고
    const messagesHtml = messagesToHtml(messages);

    // 그려야 하는 div 선택
    const parent = document.querySelector('.guestbook-contents');
    // 해당 div !null 이면
    if(parent) {
        // 기존 내용을 모두 비우기
        parent.innerHTML = '';  
        // 새 내용 추가하기
        parent.insertAdjacentHTML('beforeend', messagesHtml)
    }
}


// 불러오는 동안 로더를 보여주기 위한 함수
// drawOrRemove는 그릴지 지울지 스트링타입
const drawLoaders = (drawOrRemove) => {
    // 로더 dom
    const loader = `<div class='loader-wrapper'><span class="loader"></span><div>`;
    // 그려야 하는 div 선택
    const parent = document.querySelector(".guestbook-contents");
    // 해당 div !null 이면
    if (parent) {
        if (drawOrRemove === "draw") {
            // 기존 내용을 모두 비우기
            parent.innerHTML = "";
            // 로더 추가하기
            parent.insertAdjacentHTML("beforeend", loader);
        } else {
            // 기존 내용을 모두 비우기
            parent.innerHTML = "";
        }
    }
};

// 메인 함수 ~~! 방명록버튼 클릭시 실행되고 위에서 만든 함수들을 사용하여 대부분의 기능 실행 
const handleGuestBtnClick = async (event) => {
    // 기본 모달 엘리먼츠 삽입
    insertGuestbookHtml();
    // 로더 삽입
    drawLoaders("draw");
    // 메시지 가져오고 삽입하고
    await drawMessages();

    // 찾아야 하는 요소들 탐색 및 저장
    const messageInput = document.getElementById("guestbook-input");
    const nameInput = document.getElementById("guestbook-name");
    const submitBtn = document.getElementById("guestbook-submit");
    const modal = document.querySelector(".guestbook-modal");
    let delBtns = document.querySelectorAll("#delete");

    // 콘텐츠 외부를 클릭하면 모달 자체가 사라지게(x버튼 없이 외부 클릭으로 사라지게끔)
    if (modal)
        modal.addEventListener("click", (e) => {
            if (e.target === e.currentTarget) {
                e.currentTarget.remove();
            }
        });

    // 사용자가 input 에 입력한 값을 담을 변수들
    let messageValue = "";
    let nameValue = "";
    // 수정인지 판단할 이전 이름 값 저장 변수
    let beforeName = "";
    // 해당 변수에 입력 값을 저장하는 함수
    const handleMessageInput = (event) => (messageValue = event.target.value);
    const handleNameInput = (event) => (nameValue = event.target.value);

    // 게시물 삭제 함수
    // index는 삭제할 게시물의 index 임
    const handledelete = async (event, index) => {
        // 삭제시 마다 새로 메시지 GET
        const newMessages = await getMessages();
        // GET한 배열에서 파라미터로 받은 index 를 찾아서 name 프로퍼티를 name 변수에 할당
        const name = newMessages[index].name;
        // DELETE 요청 실행
        const result = await delMessages(name);
        console.log("지우기 성공");
        // 삭제 성공 후 다시 메시지 리페인트
        await drawMessages();
    };

    // 모든 x(게시물 삭제)버튼을 선택하고, 반복하여 클릭 이벤트 삭제 함수 등록
    const addDelListener = () => {
        delBtns = document.querySelectorAll("#delete");
        if (delBtns) {
            delBtns.forEach((e, i) => {
                e.addEventListener("click", (event) => handledelete(event, i));
            });
        }
    };

    // 제출 버튼 클릭시 실행되는 함수
    const handlesubmit = async (name) => {
        // 이름이나 메시지를 입력하지 않으면 경고띄우고 얼리 리턴
        if (name.length < 1) {
            alert("이름을 먼저 입력하세요.");
            return;
        } else if (messageValue.length < 1) {
            alert("메시지를 입력하세요.");
            return;
        } else if (beforeName === name) {
            if (
                confirm(
                    "작성자명이 동일하면 메시지 내용이 수정됩니다, 계속하시겠습니까?"
                )
            ) {
                console.log("수정모드");
            } else {
                alert("다시 확인해주세요");
                return;
            }
        }
        // POST 요청 함수 실행(입력한 이름과 내용 전달)
        const result = await postMessages(nameValue, messageValue);
        console.log(result);
        // 제출 성공시 다시 메시지 리페인트
        await drawMessages();
        // 삭제버튼들 이벤트 리스너 재등록
        addDelListener();
        // 수정 상황을 대비해 flag 변수에 기존이름 할당
        beforeName = name;
    };

    // 메시지 input 이벤트 리스너
    if (messageInput)
        messageInput.addEventListener("input", handleMessageInput);
    // 이름 input 이벤트 리스너
    if (nameInput) nameInput.addEventListener("input", handleNameInput);
    // 제출 버튼 이벤트 리스너
    if (submitBtn) submitBtn.addEventListener("click", () => handleSumbit(nameValue));

    // 삭제 버튼들 이벤트 리스너 최초 등록
    addDelListener();
}

// 방명록 버튼 이벤트 리스너(클릭시 이모든 것들이 실행됨...)
guestbookBtn.addEventListener('click', handleGuestBtnClick);
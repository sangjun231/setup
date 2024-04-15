const guestbookBtn = document.getElementById('guestbookbtn');
const body = document.body;

function getMessages() {
    // 여기에 코드를 입력하세요
    const url = 'https://asia-northeast3-sparta-526f1.cloudfunctions.net/memberAPI/api/messages';

    fetch(url)
        .then(res => res.json())
        .then(data => {

            console.log(data);
            // const rows = data.RealtimeCityAir.row;
            // rows.forEach(element => {
            //     let gu_name = element['MSRSTE_NM'];
            //     let gu_mise = element['IDEX_MVL'];

            //     let temp_html = ``;
            //     if(gu_mise > 40){
            //         temp_html = `<li class="bad">${gu_name} : ${gu_mise}</li>`;
            //     }else{
            //         temp_html = `<li>${gu_name} : ${gu_mise}</li>`;
            //     }

            // });
        });
}

const handleGuestBtnClick = (event) => {

    /** ============== make HTML elements ================ */
    // const modalMainDiv = document.createElement('div');
    //     modalMainDiv.setAttribute('class', 'guestbook-modal');

    const temp_html = `
        <div class="guestbook-modal">
            <div class="guestbook-main">
                <div class="card-body">
                    테스트
                </div>
            </div>
            <div class="sumbit-area">
                <input type="text" placeholder="여기에 입력하세요"></input>
                <button id="guestbook-sumbit">제출</button>
            </div>
        </div>`;

    body.insertAdjacentHTML('afterbegin', temp_html);


    getMessages();
}

guestbookBtn.addEventListener('click', handleGuestBtnClick);
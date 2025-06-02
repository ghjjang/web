// 태어난 날짜 설정 (예: 2000년 1월 1일)
const birthDate = new Date('2004-10-18');

// 날짜 계산 함수
function updateDaysSinceBirth() {
    const today = new Date(); // 오늘 날짜
    const timeDifference = today - birthDate; // 밀리초 단위 차이
    const daysSinceBirth = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // 일 단위로 변환

    // HTML에 결과 업데이트
    document.getElementById('days-since-birth').textContent = daysSinceBirth;
}

// 페이지 로드 시 함수 실행
updateDaysSinceBirth();

// 날짜 설정 
const dischargeDate = new Date('2025-12-23T00:00:00');

// 남은 시간 계산 함수
function updateTimeUntilDischarge() {
    const now = new Date(); // 현재 시간
    const timeDifference = dischargeDate - now; // 밀리초 단위 차이

    if (timeDifference <= 0) {
        //  날짜가 지났을 경우
        document.getElementById('time-until-discharge').textContent = 'D-day!!!';
        clearInterval(timer); // 타이머 중지
        return;
    }

    // 시간 단위로 변환
    const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

    // HTML에 결과 업데이트
    document.getElementById('time-until-discharge').textContent = 
        `${days} 일 ${hours} 시간 ${minutes} 분 ${seconds} 초`;
}

// 1초마다 업데이트
const timer = setInterval(updateTimeUntilDischarge, 1000);

// 페이지 로드 시 즉시 실행
updateTimeUntilDischarge();

// 요소 선택
const container = document.querySelector('.container');
const letterL = document.querySelector('.hero h2 span:nth-child(1)'); // 첫 번째 span (L)
const letterH1 = document.querySelector('.hero h2 span:nth-child(2)'); // 두 번째 span (H)
const letterH2 = document.querySelector('.hero h2 span:nth-child(3)'); // 세 번째 span (H)

// 배경색 변경 함수
function changeBackground(color) {
    container.style.backgroundColor = color;
}

// 이벤트 리스너 추가
letterL.addEventListener('mouseenter', () => changeBackground('#ffd1dc')); // 파스텔 핑크
letterH1.addEventListener('mouseenter', () => changeBackground('#c1e1c1')); // 파스텔 그린
letterH2.addEventListener('mouseenter', () => changeBackground('#add8e6')); // 파스텔 블루

// 마우스가 떠났을 때 기본 배경색으로 복원
[letterL, letterH1, letterH2].forEach(letter => {
    letter.addEventListener('mouseleave', () => changeBackground('#161616')); // 기본 배경색
});

// footer 클릭 시 계산 및 토글 함수
const footer = document.querySelector('footer');
const timeUntilDischargeElement = document.getElementById('time-until-discharge');
let isShowingDaysSinceStart = false; // 현재 상태를 저장하는 변수

footer.addEventListener('click', () => {
    if (!isShowingDaysSinceStart) {
        const startDate = new Date('2024-06-24'); // 시작 날짜
        const now = new Date(); // 현재 날짜
        const timeDifference = now - startDate; // 밀리초 단위 차이
        const daysSinceStart = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // 일 단위로 변환

        // 메시지 업데이트
        timeUntilDischargeElement.textContent = `입대 후 ${daysSinceStart}일 했습니다.`;
        isShowingDaysSinceStart = true; // 상태 변경
    } else {
        // 원래 남은 일수로 복원
        updateTimeUntilDischarge(); // 남은 시간 업데이트 함수 호출
        isShowingDaysSinceStart = false; // 상태 변경
    }
});
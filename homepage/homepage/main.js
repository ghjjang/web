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
        // 날짜가 지났을 경우
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

// 페이지 로드 시 즉시 실행
updateTimeUntilDischarge();

document.querySelectorAll('.hero h2 span').forEach((span, index) => {
    span.addEventListener('mouseenter', () => {
        const container = document.querySelector('.container');
        if (index === 0) {
            container.style.backgroundColor = '#9cc7e0'; // 첫 번째 L 호버 시
        } else if (index === 1) {
            container.style.backgroundColor = '#a8d4c8'; // 첫 번째 H 호버 시
        } else if (index === 2) {
            container.style.backgroundColor = '#c8aed8'; // 두 번째 H 호버 시
        }
    });

    span.addEventListener('mouseleave', () => {
        const container = document.querySelector('.container');
        container.style.backgroundColor = '#131313'; // 기본 배경색으로 복원
    });
});

// 상태를 저장할 변수 추가
let isShowingElapsedDays = false;
let timer; // 타이머를 제어하기 위해 변수로 선언

// 입대일 설정
const enlistmentDate = new Date('2024-06-24'); // 입대일을 설정

// footer 클릭 이벤트 수정
document.getElementById('time-until-discharge').addEventListener('click', () => {
    const timeElement = document.getElementById('time-until-discharge');

    // 텍스트 서서히 사라지기 (페이드 아웃)
    timeElement.style.transition = 'opacity 0.5s ease'; // 부드러운 전환
    timeElement.style.opacity = 0; // 투명하게 설정

    setTimeout(() => {
        // 텍스트 변경
        const now = new Date();
        const timeDifference = now - enlistmentDate; // 입대일부터 현재까지의 시간 차이
        const daysSinceEnlistment = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // 일 단위로 변환

        if (isShowingElapsedDays) {
            // 남은 시간 표시로 전환
            timer = setInterval(updateTimeUntilDischarge, 1000); // 타이머 재개
            updateTimeUntilDischarge(); // 즉시 실행
        } else {
            // 입대일 기준으로 지금까지 몇 일 했는지 표시
            clearInterval(timer); // 타이머 중지
            timeElement.textContent = `D + ${daysSinceEnlistment} 일`;
        }

        // 상태 토글
        isShowingElapsedDays = !isShowingElapsedDays;

        // 텍스트 서서히 나타나기 (페이드 인)
        timeElement.style.opacity = 1; // 불투명하게 설정
    }, 200); 
});

// 1초마다 업데이트
timer = setInterval(updateTimeUntilDischarge, 1000);
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
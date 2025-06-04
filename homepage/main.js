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
        stopTimer(); // 타이머 중지
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

let timer; // 타이머를 전역 변수로 선언
let isShowingDaysSinceStart = false; // 현재 상태를 저장하는 변수

function startTimer() {
    timer = setInterval(updateTimeUntilDischarge, 1000); // 타이머 시작
}

function stopTimer() {
    clearInterval(timer); // 타이머 중지
}

// 페이지 로드 시 타이머 시작
startTimer();

// 요소 선택
const section1 = document.querySelector('.section');
const letterL = document.querySelector('.section .hero h2 span:nth-child(1)');
const letterH1 = document.querySelector('.section .hero h2 span:nth-child(2)');
const letterH2 = document.querySelector('.section .hero h2 span:nth-child(3)');

let currentBackgroundColor = getComputedStyle(section1).backgroundColor;
const defaultBackground = currentBackgroundColor;

// 배경색 변경 함수
function changeBackground(color) {
    section1.style.backgroundColor = color;
    currentBackgroundColor = color;
    localStorage.setItem('section1BgColor', color);
    console.log('현재 배경색:', currentBackgroundColor);
}

// 글자에 따른 색상 반환 함수
function getColorByLetter(letter) {
    if (letter === letterL) return '#ffd1dc';
    if (letter === letterH1) return '#c1e1c1';
    if (letter === letterH2) return '#add8e6';
    return currentBackgroundColor;
}

// 이벤트 바인딩 함수
function bindLetterEvents(letters) {
    letters.forEach(letter => {
        // 더블클릭: 기본 배경색 복원
        letter.addEventListener('dblclick', () => changeBackground(defaultBackground));

        // 클릭: 배경색 변경
        letter.addEventListener('click', (event) => {
            const color = getColorByLetter(event.target);
            changeBackground(color);
        });

        // 호버: 배경색 잠시 덮어씌우기
        letter.addEventListener('mouseenter', (event) => {
            section1.style.backgroundColor = getColorByLetter(event.target);
        });
        letter.addEventListener('mouseleave', () => {
            section1.style.backgroundColor = currentBackgroundColor;
        });
    });
}

// 한 번에 이벤트 바인딩
bindLetterEvents([letterL, letterH1, letterH2]);

// footer 클릭 시 계산 및 토글 함수
const footer = document.querySelector('footer');
const timeUntilDischargeElement = document.getElementById('time-until-discharge');

footer.addEventListener('click', () => {
    if (!isShowingDaysSinceStart) {
        const startDate = new Date('2024-06-24'); // 시작 날짜
        const now = new Date(); // 현재 날짜
        const timeDifference = now - startDate; // 밀리초 단위 차이
        const daysSinceStart = Math.floor(timeDifference / (1000 * 60 * 60 * 24)); // 일 단위로 변환

        // 메시지 업데이트
        timeUntilDischargeElement.textContent = `D + ${daysSinceStart}`;
        isShowingDaysSinceStart = true; // 상태 변경
        stopTimer(); // 타이머 중지
    } else {
        // 원래 남은 일수로 복원
        isShowingDaysSinceStart = false; // 상태 변경
        updateTimeUntilDischarge(); // 남은 시간 업데이트 함수 호출
        startTimer(); // 타이머 재시작
    }
});


/*섹션 나누기*/
// 섹션 나누기 및 스크롤 이벤트 처리
const sections = document.querySelectorAll('.section');
let currentSection = 0;
let isScrolling = false;

// 섹션 스크롤 함수
function scrollToSection(index) {
  if (index >= 0 && index < sections.length) {
    isScrolling = true;
    sections[index].scrollIntoView({ behavior: 'smooth' });
    currentSection = index;
    setTimeout(() => isScrolling = false, 800);
  }
}

// 마우스 휠 이벤트
window.addEventListener('wheel', (e) => {
  if (isScrolling) return;
  if (e.deltaY > 0) {
    scrollToSection(currentSection + 1);
  } else if (e.deltaY < 0) {
    scrollToSection(currentSection - 1);
  }
});

// 키보드 방향키 이벤트
window.addEventListener('keydown', (e) => {
  if (isScrolling) return;
  if (e.key === 'ArrowDown') {
    scrollToSection(currentSection + 1);
  } else if (e.key === 'ArrowUp') {
    scrollToSection(currentSection - 1);
  }
});

// 스크롤 상단(첫 섹션)으로 이동 함수
function scrollToTop() {
  scrollToSection(0);
}

window.addEventListener('DOMContentLoaded', function() {
  const audio = document.getElementById('bgm');
  // 자동재생 시도
  audio.play().catch(() => {
    // 실패하면 사용자 상호작용 시 재생
    const startAudio = () => {
      audio.play();
      window.removeEventListener('click', startAudio);
      window.removeEventListener('keydown', startAudio);
    };
    window.addEventListener('click', startAudio);
    window.addEventListener('keydown', startAudio);
  });
});



//fotter에 있는걸 hero 부분이랑 합치고 fotter부분에 audio 넣기
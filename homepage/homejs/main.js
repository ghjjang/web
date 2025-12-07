import { showToast } from './toast.js';
import { startBirthCounter, startDischargeTimer } from './dateTimer.js';
import { setupSectionScroll } from './scroll.js';
import { setupSlider } from './slider.js';
import { setupMusicPlayer } from './music.js';
import { DATES, LEAVES, MILITARY_MESSAGES, COLORS, UI } from './config.js';
import { getRemainingServiceDays } from './serviceCalculator.js';

// 오프라인 지원 설정
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => console.log('ServiceWorker 등록 성공:', registration.scope))
      .catch(error => console.error('ServiceWorker 등록 실패:', error));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // 로딩 상태 표시
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '로딩 중...';
  document.body.appendChild(loader);

  try {
    // 🎂 생일로부터 지난 일수 표시
    startBirthCounter(DATES.BIRTH_DATE);

    // 🎖️ 전역일 카운터 시작
    const DISCHARGE_DATE = new Date(DATES.DISCHARGE_DATE);
    const stopDischarge = startDischargeTimer(DISCHARGE_DATE);

  const scrollApi = setupSectionScroll();
  const sliderApi = setupSlider();
  const musicApi = setupMusicPlayer();

  // 💬 비례형 랜덤 문구 세트
  const militaryMessages = [
    (n, h) => `🍚 전역까지 식사를 ${n * 3}번만 하면 돼!`,
    (n, h) => `☀️ 아침 점호 ${n}번만 더 하면 끝이야!`,
    (n, h) => `🧼 샤워 ${n}번만 더 하면 민간인이다!`,
    (n, h) => `📅 주말 ${Math.ceil(n / 7)}번만 더 기다리면 된다!`,
    (n, h) => `🧭 ${n}일만 더 지나면 나도 민간인!`,
    (n, h) => `🎒 ${n-1}번만 더 일어나면 자유다!`,
    (n, h) => `🎖️ 전역까지 ${n}일(${h}시간) 남았다! `,
    (n, h) => `🍜 밥 ${n * 3}번만 더 먹으면 민간인이다.`,
    (n, h) => `⏰ 전역까지 ${h}시간 남았다. 잠깐 눈 붙이면 하루 간다.`,
    (n, h) => `🛏️ 전역까지 ${Math.ceil(n-1)}번만 더 자면 민간인이다.`,
    (n, h) => `💤 앞으로 ${Math.ceil(n*8)}시간 더 자면된다.`,
    (n, h) => `🎯 ${h}시간만 더 참으면 군생활도 추억이 된다.`,
    (n, h) => `🔥 ${h}시간 남았다. 지금 이 시간도 다시 안 온다.`,
  ];

  // ============================================================
  // 🏕️ 남은 군생활 계산 (휴가 제외)
  // ============================================================
  const leaves = [
    { start: "2025-11-29", end: "2025-12-05" }, // 휴가
    { start: "2025-12-08", end: "2025-12-19" }, // 휴가
    { start: "2025-11-08", end: "2025-11-09" }, // 외박
  ];

  function getRemainingServiceDays(dischargeDate, leaves = []) {
    const today = new Date();
    const dayMs = 1000 * 60 * 60 * 24;

    // 남은 전체 일수
    const totalRemainingDays = Math.ceil((dischargeDate - today) / dayMs);
 
    let upcomingLeaveDays = 0;
    let isOnLeaveToday = false;

    for (const leave of leaves) {
      const leaveStart = new Date(leave.start);
      const leaveEnd = new Date(leave.end);

      // 오늘이 휴가 중인지 체크
      if (today >= leaveStart && today <= leaveEnd) isOnLeaveToday = true;

      // 이미 지난 휴가 제외
      if (leaveEnd < today) continue;

      const effectiveStart = leaveStart < today ? today : leaveStart;
      const effectiveEnd = leaveEnd > dischargeDate ? dischargeDate : leaveEnd;

      if (effectiveStart > dischargeDate) continue;

      const diff = Math.ceil((effectiveEnd - effectiveStart) / dayMs) + 1;
      upcomingLeaveDays += diff;
    }

    let remainingServiceDays = Math.max(0, totalRemainingDays - upcomingLeaveDays);

    // 오늘이 휴가 중이면 하루는 줄이지 않음
    if (isOnLeaveToday) remainingServiceDays += 1;

    const remainingHours = remainingServiceDays * 24;

    return { totalRemainingDays, upcomingLeaveDays, remainingServiceDays, remainingHours, isOnLeaveToday };
  }

  // ============================================================
  // 🏠 HOME 버튼 동작 (싱글: 맨 위로 / 더블: 랜덤 문구)
  // ============================================================
  const homeButtons = document.querySelectorAll('.HOME');
  homeButtons.forEach(homeButton => {
    let clickTimer = null;
    homeButton.addEventListener('click', () => {
      if (clickTimer) {
        // double click
        clearTimeout(clickTimer);
        clickTimer = null;

        const { remainingServiceDays, remainingHours } = getRemainingServiceDays(DISCHARGE_DATE, leaves);

        if (remainingServiceDays <= 0) {
          showToast("🎉 전역 축하합니다! 이제 민간인입니다 🇰🇷");
        } else {
          const fn = militaryMessages[Math.floor(Math.random() * militaryMessages.length)];
          showToast(fn(remainingServiceDays, remainingHours));
        }

      } else {
        // single click
        clickTimer = setTimeout(() => {
          clickTimer = null;
          if (scrollApi && scrollApi.scrollToTop) scrollApi.scrollToTop();
        }, 250);
      }
    });
  });

  // ============================================================
  // ⚙️ Footer 클릭 시 D+ / 전역일 카운트 토글
  // ============================================================
  const footer = document.querySelector('footer');
  const timeUntilEl = document.getElementById('time-until-discharge');
  let isShowingDaysSinceStart = false;

  footer?.addEventListener('click', () => {
    if (!timeUntilEl) return;
    if (!isShowingDaysSinceStart) {
      const startDate = new Date(2024, 5, 24);
      const now = new Date();
      const diff = now - startDate;
      const daysSinceStart = Math.floor(diff / (1000 * 60 * 60 * 24));
      timeUntilEl.textContent = `D + ${daysSinceStart}`;
      isShowingDaysSinceStart = true;
      if (typeof stopDischarge === 'function') stopDischarge();
    } else {
      isShowingDaysSinceStart = false;
      startDischargeTimer(DISCHARGE_DATE);
    }
  });

  // ============================================================
  // 🎵 음악 컨트롤 및 색상 기억
  // ============================================================
    window.nextTrack = () => musicApi?.nextTrack?.();
    window.prevTrack = () => musicApi?.prevTrack?.();
    window.audioPlay = () => musicApi?.audioEl?.play?.();
    window.audioPause = () => musicApi?.audioEl?.pause?.();

    const section1 = document.getElementById('section1');
    const savedBg = localStorage.getItem('section1BgColor');
    if (section1 && savedBg) section1.style.backgroundColor = savedBg;

    const hero = section1?.querySelector('.hero');
    if (hero) {
      const spans = Array.from(hero.querySelectorAll('h2 span'));
      spans.forEach((span, idx) => span.dataset.letterIndex = String(idx));

      function getColorByIndex(i) {
        if (i === 0) return COLORS.PINK;
        if (i === 1) return COLORS.GREEN;
        if (i === 2) return COLORS.BLUE;
        return window.getComputedStyle(section1).backgroundColor;
      }

      spans.forEach(span => {
        span.addEventListener('dblclick', () => {
          const defaultBg = getComputedStyle(section1).backgroundColor;
          section1.style.backgroundColor = defaultBg;
          localStorage.removeItem('section1BgColor');
        });

        span.addEventListener('click', (e) => {
          const idx = Number(e.target.dataset.letterIndex);
          const color = getColorByIndex(idx);
          section1.style.backgroundColor = color;
          localStorage.setItem('section1BgColor', color);
        });

        span.addEventListener('mouseenter', (e) => {
          const idx = Number(e.target.dataset.letterIndex);
          section1.style.backgroundColor = getColorByIndex(idx);
        });
        span.addEventListener('mouseleave', () => {
          const saved = localStorage.getItem('section1BgColor') || getComputedStyle(section1).backgroundColor;
          section1.style.backgroundColor = saved;
        });
      });
    }
  } catch (error) {
    console.error('페이지 초기화 중 오류 발생:', error);
    showToast('페이지 로딩 중 문제가 발생했습니다. 새로고침을 해주세요.');
  } finally {
    // 로딩 상태 제거
    document.body.removeChild(loader);
  }
});

// config.js
export const DATES = {
  BIRTH_DATE: '2004-10-18',
  DISCHARGE_DATE: '2025-12-23T00:00:00',
  SERVICE_START_DATE: '2024-05-24',
};

export const LEAVES = [
  { start: "2025-11-29", end: "2025-12-05" }, // 휴가
  { start: "2025-12-08", end: "2025-12-19" }, // 휴가
  { start: "2025-11-08", end: "2025-11-09" }, // 외박
];

export const MILITARY_MESSAGES = [
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

export const COLORS = {
  PINK: '#ffd1dc',
  GREEN: '#c1e1c1',
  BLUE: '#add8e6',
};

export const UI = {
  DOUBLE_CLICK_DELAY: 250,
};
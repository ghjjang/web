// serviceCalculator.js

/**
 * 남은 군 복무 일수를 계산합니다.
 * @param {Date} dischargeDate - 전역일
 * @param {Array} leaves - 휴가 정보 배열
 * @returns {Object} 계산된 복무 정보
 */
export function getRemainingServiceDays(dischargeDate, leaves = []) {
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

  return { 
    totalRemainingDays, 
    upcomingLeaveDays, 
    remainingServiceDays, 
    remainingHours, 
    isOnLeaveToday 
  };
}
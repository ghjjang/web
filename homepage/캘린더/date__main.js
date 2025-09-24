const modal = document.createElement('div');
// =========================
// 캘린더 및 일정 관리 JS
// =========================

// 일정 데이터 저장 및 불러오기 (배열로 변경: [{title, start, end, color}])
function getSchedules() {
  // localStorage에서 일정 데이터 불러오기
  return JSON.parse(localStorage.getItem('schedules_v2') || '[]');
}
function saveSchedules(schedules) {
  // localStorage에 일정 데이터 저장
  localStorage.setItem('schedules_v2', JSON.stringify(schedules));
}

function makeCalendar(date) {
  // 오늘/선택 날짜 일정 리스트 패널 렌더링 (기본: 오늘)
  renderScheduleListPanel();
  // 달력 렌더링 함수: 전달받은 날짜 기준으로 달력 표를 만듦
  const today = new Date();
  // 오늘 날짜 객체
  const currentYear = date.getFullYear();
  const currentMonth = date.getMonth();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
  const schedules = getSchedules();

  // 달력에 표시할 주(week) 배열 생성

  // table 구조로 tbody 생성
  let weeks = [];
  let week = [];
  let dayNum = 1;
  let startDay = (firstDay + 6) % 7; // 월요일 시작(0:월~6:일)
  // 첫 주 빈칸
  for (let i = 0; i < startDay; i++) week.push(null);
  while (dayNum <= lastDay) {
    week.push(dayNum);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
    dayNum++;
  }
  // 마지막 주 빈칸
  if (week.length > 0) {
    while (week.length < 7) week.push(null);
    weeks.push(week);
  }

  // tbody HTML 생성
  let tbodyHtml = '';
  // 공휴일 예시(확장 가능, 필요시 추가)
  const holidays = [
    '2025-01-01' // 신정 
    , '2025-01-20' // 설날 연휴
    , '2025-01-21' // 설날 연휴
    , '2025-01-22' // 설날 연휴
    , '2025-02-11' // 대체공휴일
    , '2025-03-24' // 석가탄신일
    , '2025-05-01' // 근로자의 날
    , '2025-03-01' // 삼일절
    , '2025-05-05' // 어린이날
    , '2025-06-06' // 현충일
    , '2025-08-15' // 광복절
    , '2025-10-03' // 개천절
    , '2025-10-09' // 한글날
    , '2025-12-25' // 성탄절
    , '2025-09-17' // 추석 연휴
    , '2025-09-18' // 추석 연휴
    , '2025-09-19' // 추석 연휴
    , '2025-09-22' // 대체공휴일
    , '2025-12-31' // 임시공휴일
    // 추가 공휴일이나 임의 지정일은 여기에 계속 추가 가능
    // 'YYYY-MM-DD' 형식으로 추가 가능
  ];
  // 각 주/요일별로 셀(td) 생성
  weeks.forEach((weekArr, weekIdx) => {
    tbodyHtml += '<tr>';
    weekArr.forEach((d, i) => {
      if (d === null) {
        // 빈칸(해당 월이 아닌 날짜)
        tbodyHtml += '<td class="day day--disabled"></td>';
      } else {
        // 실제 날짜 셀
  // YYYY-MM-DD 형식의 날짜 문자열 생성
  const dateStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  // 오늘 날짜인지 여부
  let isToday = (today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === d);
  // 요일별 클래스(sun, sat, weekday)
  let dayNumClass = '';
        if (i === 0) dayNumClass = 'sun';
        else if (i === 6) dayNumClass = 'sat';
        else dayNumClass = 'weekday';
  if (holidays.includes(dateStr)) dayNumClass += ' h-day'; // 공휴일 표시
        if (isToday) dayNumClass += ' today';
  // 일정이 있는 날에 제목+종료일 표기, 배경색 적용
        let scheduleHtml = '';
  // 해당 날짜에 일정이 있으면 표시
  schedules.forEach((sch) => {
          const toDateStr = (dt) => {
            const dObj = new Date(dt);
            return dObj.getFullYear() + '-' + String(dObj.getMonth()+1).padStart(2,'0') + '-' + String(dObj.getDate()).padStart(2,'0');
          };
          const startStr = toDateStr(sch.start);
          const endObj = new Date(sch.end);
          const curStr = `${currentYear}-${String(currentMonth+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
          if (curStr === startStr) {
            let endLabel = '';
            if (endObj.getFullYear() === currentYear && endObj.getMonth() === currentMonth) {
              endLabel = `(~${endObj.getDate()})`;
            } else {
              endLabel = `(~${sch.end})`;
            }
            scheduleHtml = `<span class="schedule-end-date" style="background:${sch.color};color:#222;padding:2px 8px 2px 8px;border-radius:6px;display:inline-block;margin-top:4px;margin-left:8px;cursor:pointer;min-width:80px;">${sch.title} ${endLabel}</span>`;
          }
        });
  // 날짜 셀(td)에 data-date 속성 부여, 일정 있으면 함께 표시
  tbodyHtml += `<td class="day${isToday ? ' day--today' : ''}" data-date="${dateStr}"><span class="day-num${dayNumClass ? ' ' + dayNumClass : ''}">${d}</span>${scheduleHtml}</td>`;
      }
    });
  tbodyHtml += '</tr>'; // 한 주 끝
  });
  // 달력 tbody에 HTML 삽입
  document.getElementById('calendar-tbody').innerHTML = tbodyHtml;
  // 월/연도 라벨 갱신
  document.querySelector('.month-label').innerText = `${currentMonth+1}월`;
  document.querySelector('.year-label').innerText = `${currentYear}`;

  // 일정 입력(추가) 이벤트 바인딩
  setTimeout(() => {
    document.querySelectorAll('.day').forEach(dayEl => {
      if (!dayEl.classList.contains('day--disabled')) {
        // 날짜 셀 클릭 시 일정 입력 모달 + 일정 리스트 패널 날짜 변경
        dayEl.onclick = function(e) {
          e.stopPropagation();
          const dateKey = this.getAttribute('data-date');
          showScheduleInputModal(dateKey);
          renderScheduleListPanel(dateKey);
        };
        // 날짜 셀 마우스 클릭 시 일정 리스트 패널 날짜 변경만(우클릭 등)
        dayEl.oncontextmenu = function(e) {
          e.preventDefault();
          const dateKey = this.getAttribute('data-date');
          renderScheduleListPanel(dateKey);
        };
      } else {
        dayEl.onclick = null;
        dayEl.oncontextmenu = null;
      }
    });
  // 일정 span 클릭 시 수정 모달 표시
    document.querySelectorAll('.schedule-end-date').forEach(endEl => {
      endEl.style.cursor = 'pointer';
      endEl.onclick = function(e) {
        // 일정 정보 찾고, 수정 모달 표시
        e.stopPropagation();
        // 일정 정보 찾기
        const parent = this.closest('.day');
        if (!parent) return;
        const dateKey = parent.getAttribute('data-date');
        // 해당 날짜에 시작하는 일정 찾기
        const schedules = getSchedules();
        const schIdx = schedules.findIndex(sch => {
          const dObj = new Date(sch.start);
          const y = dObj.getFullYear();
          const m = String(dObj.getMonth()+1).padStart(2,'0');
          const day = String(dObj.getDate()).padStart(2,'0');
          return `${y}-${m}-${day}` === dateKey;
        });
        if (schIdx === -1) return;
        showScheduleEditModal(schIdx);
      };
    });
  }, 0);
// 일정 수정 모달
function showScheduleEditModal(idx) {
// 일정 수정 모달 생성 및 동작
  const schedules = getSchedules();
  const sch = schedules[idx];
  if (!sch) return;

  const colors = [
    '#FFCDD2', // 연한 레드
    '#FFB6C1', // 연한 핑크
    '#FFA07A', // 연한 오렌지
    '#FFFFE0', // 연한 옐로우
    '#98FB98', // 연한 그린
    '#AFEEEE', // 연한 시안
    '#DDA0DD', // 연한 바이올렛
    '#D3D3D3'  // 연한 그레이
  ];

  const modal = document.createElement('div');
  modal.id = 'schedule-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 style="margin-top:0" >일정 수정</h3>
      <label><input type="text" id="sch-title-edit" style="width:90%" maxlength="20" value="${sch.title}"></label><br><br>
      <div style="display: flex; gap: 12px; align-items: center;">
        <label>시작 <br>
          <input id="sch-start-edit" type="date" value="${sch.start}">
        </label> &nbsp; &nbsp;
        <label>종료 <br>
          <input id="sch-end-edit" type="date" value="${sch.end}">
        </label>
      </div>
      <br>
      <div>
        ${colors.map((c,i)=>`
          <label style="margin-right:8px;cursor:pointer;">
            <input type="radio" name="sch-color" value="${c}" ${(sch.color === c) ? 'checked' : ''} style="display:none;">
            <span class="color-dot" style="background:${c};"></span>
          </label>
        `).join('')}
      </div><br>
      <div style="margin-top:16px;text-align:right;">
        <button id="sch-delete-edit" class="modal-btn delete">삭제</button>
        <button id="sch-save-edit" class="modal-btn save">저장</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // 엔터키로 저장 (모달 append 후에만 바인딩)
  modal.querySelector('.modal-content').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('sch-save-edit').click();
    }
  });
  document.getElementById('sch-save-edit').onclick = () => {
    const title = document.getElementById('sch-title-edit').value.trim();
    const start = document.getElementById('sch-start-edit').value;
    const end = document.getElementById('sch-end-edit').value;
    const color = document.querySelector('input[name="sch-color"]:checked').value;
    if (!title) { alert('제목을 입력하세요.'); return; }
    if (!start || !end) { alert('시작/종료 날짜를 입력하세요.'); return; }
    if (start > end) { alert('종료일이 시작일보다 빠를 수 없습니다.'); return; }
    schedules[idx] = { ...sch, title, start, end, color };
    saveSchedules(schedules);
    modal.remove();
    makeCalendar(currentDate);
  };
  document.getElementById('sch-delete-edit').onclick = () => {
    if (confirm('정말로 이 일정을 삭제하시겠습니까?')) {
      schedules.splice(idx, 1);
      saveSchedules(schedules);
      modal.remove();
      makeCalendar(currentDate);
    }
  };
}
}

// 일정 입력 모달 생성
function showScheduleInputModal(startDateStr) {
// 일정 입력(추가) 모달 생성 및 동작
  // 모달이 이미 있으면 제거
  const old = document.getElementById('schedule-modal');
  if (old) old.remove();

  const colors = [
    '#FFCDD2', // 연한 레드
    '#FFB6C1', // 연한 핑크
    '#FFA07A', // 연한 오렌지
    '#FFFFE0', // 연한 옐로우
    '#98FB98', // 연한 그린
    '#AFEEEE', // 연한 시안
    '#DDA0DD', // 연한 바이올렛
    '#D3D3D3'  // 연한 그레이
  ];
  const modal = document.createElement('div');
  modal.id = 'schedule-modal';
  modal.className = 'modal-overlay';
  modal.innerHTML = `
    <div class="modal-content">
      <h3 style="margin-top:0" >일정 입력</h3>
      <label><input type="text" placeholder="일정 제목" id="sch-title" style="width:90%" maxlength="20"></label><br><br>
    
      <div style="display: flex; gap: 12px; align-items: center;">
        <label>시작 <br>
          <input id="sch-start" type="date" value="${startDateStr}">
        </label> &nbsp; &nbsp;
        <label>종료 <br>
          <input id="sch-end" type="date" value="${startDateStr}">
        </label>
      </div>
      <br>
      <div>
        ${colors.map((c,i)=>`
          <label style="margin-right:8px;cursor:pointer;">
            <input type="radio" name="sch-color" value="${c}" ${i===0?'checked':''} style="display:none;">
            <span class="color-dot" style="background:${c};"></span>
          </label>
        `).join('')}
      </div>
      <br>
      <div style="margin-top:16px;text-align:right;">
        <button id="sch-cancel" class="modal-btn delete" style="background:#aaa;">취소</button>
        <button id="sch-save" class="modal-btn save">저장</button>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  // 엔터키로 저장 (모달 append 후에만 바인딩)
  modal.querySelector('.modal-content').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('sch-save').click();
    }
  });
  document.getElementById('sch-cancel').onclick = () => modal.remove();
  document.getElementById('sch-save').onclick = () => {
    const title = document.getElementById('sch-title').value.trim();
    const start = document.getElementById('sch-start').value;
    const end = document.getElementById('sch-end').value;
    const color = document.querySelector('input[name="sch-color"]:checked').value;
    if (!title) { alert('제목을 입력하세요.'); return; }
    if (!start || !end) { alert('시작/종료 날짜를 입력하세요.'); return; }
    if (start > end) { alert('종료일이 시작일보다 빠를 수 없습니다.'); return; }
    // 일정 저장
    const schedules = getSchedules();
    schedules.push({ title, start, end, color });
    saveSchedules(schedules);
    modal.remove();
    makeCalendar(currentDate);
  };
}

// 미니 달력(이전/다음달) 간단 안내 텍스트 렌더링 (JS에서 실제 달력 렌더링 가능)
function renderMiniCalendars(currentDate) {
// 미니 달력(이전/다음달) 렌더링
  // 미니 달력 렌더 함수
  function miniCalHTML(date, label) {
    const today = new Date();
    const y = date.getFullYear();
    const m = date.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const lastDay = new Date(y, m + 1, 0).getDate();
    // 월요일 시작(0:월~6:일)로 맞추기
    let startDay = (firstDay + 6) % 7;
    let weeks = [];
    let week = [];
    let dayNum = 1;
    for (let i = 0; i < startDay; i++) week.push(null);
    while (dayNum <= lastDay) {
      week.push(dayNum);
      if (week.length === 7) { weeks.push(week); week = []; }
      dayNum++;
    }
    if (week.length > 0) { while (week.length < 7) week.push(null); weeks.push(week); }
    // 헤더(월/연도)
    let html = `<div style="text-align:center;font-weight:600;font-size:16px;margin-bottom:2px;">${y}. ${m+1}</div>`;
    html += '<table style="width:100%;font-size:13px;table-layout:fixed;border-collapse:collapse;">';
    html += '<thead><tr>';
    ['일','월','화','수','목','금','토'].forEach((d,i)=>{
      let c = i===0?'#e53935':i===6?'#1976d2':'#888';
      html += `<th style="color:${c};font-weight:500;padding:2px 0;">${d}</th>`;
    });
    html += '</tr></thead><tbody>';
    weeks.forEach(weekArr => {
      html += '<tr>';
      weekArr.forEach((d,i)=>{
        if(d===null) html+='<td></td>';
        else {
          let isToday = (today.getFullYear()===y && today.getMonth()===m && today.getDate()===d);
          let c = i===0?'#e53935':i===6?'#1976d2':'#222';
          let bg = isToday? 'background:#e3f2fd;border-radius:6px;border:1.5px solid #2196f3;':'background:none;';
          html += `<td style="text-align:center;padding:2px 0;color:${c};${bg}font-weight:${isToday?'bold':'normal'};">${d}</td>`;
        }
      });
      html += '</tr>';
    });
    html += '</tbody></table>';
    return html;
  }
  // 이전달, 다음달 객체
  const prev = new Date(currentDate.getFullYear(), currentDate.getMonth()-1, 1);
  const next = new Date(currentDate.getFullYear(), currentDate.getMonth()+1, 1);
  document.getElementById('mini-prev').innerHTML = miniCalHTML(prev, '이전달');
  document.getElementById('mini-next').innerHTML = miniCalHTML(next, '다음달');
}

// 초기 날짜 상태
let currentDate = new Date();
function renderAndBindCalendar() {
// 달력 및 미니달력 렌더링, 월 이동 버튼 이벤트 바인딩
  makeCalendar(currentDate);
  renderMiniCalendars(currentDate);
  // 월 이동 버튼 이벤트 항상 재연결
  document.querySelector('.prevDay').onclick = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    renderAndBindCalendar();
  };
  document.querySelector('.nextDay').onclick = () => {
    currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    renderAndBindCalendar();
  };
}

// DOMContentLoaded: DOM이 완전히 준비된 후 달력 렌더링 시작
document.addEventListener('DOMContentLoaded', function() {
  renderAndBindCalendar();
});


// 오늘 날짜 강조 및 색상 선택 스타일 추가
const style = document.createElement('style');
style.innerHTML = `
.day--today { background: #e3f2fd !important; border: 2px solid #2196f3; color: #1565c0 !important; }
.day .day-num { font-weight: bold; }
.schedule-text { font-size: 13px; color: #333; margin-top: 4px; word-break: break-all; }
.color-dot {
  display: inline-block;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 2px solid #bbb;
  vertical-align: middle;
  position: relative;
  transition: border 0.2s;
}
input[type="radio"][name="sch-color"]:checked + .color-dot {
  border: 3px solid #333;
}
`;
document.head.appendChild(style);

  // 엔터키로 저장 (모달 append 후 실행)
  setTimeout(() => {
    modal.querySelectorAll('input').forEach(input => {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('sch-save-edit').click();
        }
      });
    });
  }, 0);
  // 엔터키로 저장 (모달 append 후 실행)
  setTimeout(() => {
    modal.querySelectorAll('input').forEach(input => {
      input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
          document.getElementById('sch-save').click();
        }
      });
    });
  }, 0);

  // 색상 범례(legend) 렌더링
function renderScheduleLegend() {
  const legend = document.getElementById('schedule-legend');
  if (!legend) return;
  // 색상별 의미(예시)
  const colorMap = [
    { color: '#FFCDD2', label: '휴가/개인' },
    { color: '#FFB6C1', label: '기념일' },
    { color: '#FFA07A', label: '업무' },
    { color: '#FFFFE0', label: '중요' },
    { color: '#98FB98', label: '미팅' },
    { color: '#AFEEEE', label: '학습' },
    { color: '#DDA0DD', label: '기타' },
    { color: '#D3D3D3', label: '기타' }
  ];
  legend.innerHTML = colorMap.map(item =>
    `<span style="display:inline-flex;align-items:center;gap:4px;font-size:13px;">
      <span style="display:inline-block;width:14px;height:14px;background:${item.color};
      border-radius:50%;border:1px solid #bbb;"></span>${item.label}
    </span>`
  ).join('');
}
// 오늘/선택 날짜 일정 리스트 패널 렌더링
function renderScheduleListPanel(selectedDateStr = null) {
  renderScheduleLegend();
  const schedules = getSchedules();
  let targetDate;
  if (selectedDateStr) {
    targetDate = selectedDateStr;
  } else {
    const today = new Date();
    const y = today.getFullYear();
    const m = String(today.getMonth()+1).padStart(2,'0');
    const d = String(today.getDate()).padStart(2,'0');
    targetDate = `${y}-${m}-${d}`;
  }
  const list = schedules.filter(sch => {
    // 시작~종료일 범위 내에 targetDate가 포함되는 일정도 표시
    const start = new Date(sch.start);
    const end = new Date(sch.end);
    const t = new Date(targetDate);
    return t >= start && t <= end;
  });
  const ul = document.getElementById('schedule-list-ul');
  if (!ul) return;
  ul.innerHTML = '';
  if (list.length === 0) {
    ul.innerHTML = '<li style="color:#aaa;">일정이 없습니다.</li>';
    return;
  }
  list.forEach(sch => {
    const li = document.createElement('li');
    li.style.marginBottom = '8px';
    li.innerHTML = `<span style="display:inline-block;width:14px;height:14px;background:${sch.color};border-radius:50%;margin-right:8px;vertical-align:middle;"></span><b>${sch.title}</b> <span style="font-size:12px;color:#888;">(${sch.start}~${sch.end})</span>`;
    ul.appendChild(li);
  });
}
// 상단 +일정 추가 버튼 클릭 시 일정 입력 모달 표시
document.addEventListener('DOMContentLoaded', function() {
  const addBtn = document.getElementById('add-schedule-btn');
  if (addBtn) {
    addBtn.addEventListener('click', function() {
      // 오늘 날짜를 기본값으로 전달
      const today = new Date();
      const y = today.getFullYear();
      const m = String(today.getMonth()+1).padStart(2,'0');
      const d = String(today.getDate()).padStart(2,'0');
      showScheduleInputModal(`${y}-${m}-${d}`);
    });
  }
});
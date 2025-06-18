// stack_search.js
// 태그 관련해서는 stack_tag_manager.js(해쉬태크) 보기
import { getCurrentConfig } from '../config/fuelcellSelector.js'; 
import { fetchRedisDataAndUpdate } from './search_updateEIS.js'; 
import { errorCodeMapping } from '../bop/bopSensorLabelingData.js';
import { loadAndDisplayDiagnosisData } from './stack_diagnosis_log.js';

export let currentPage = 1;
let itemsPerPage = 100; // 기본값
let currentSearchConditions = {};
let totalRows = 0; //필터링 된 데이터의 총 수를 저장할 변수
let totalRowsFiltered = 0; //필터링 된 데이터의 총 수를 저장할 변수
let currentPageContext = "all"; // 'all', 'search', 'bookmark' (페이지 컨텍스트 추적 기능)
let currentBookmarkId = null; 
export let isInitializingCheckboxes = false; // 체크박스 초기화 상태 추적 플래그 변수
let type='SIN';
let typeSelector; // sin인지 pulse인지 그래프종류 두개
let checkedItems = new Set();
const currentDate = new Date();
const formattedDate = currentDate.toISOString().slice(0, 19).replace("T", " ");
///////////////////////////////////////////////////////////////////////////////////////////////////
// 날짜 함수
function setDefaultDates() {
  const now = new Date();
  const startOfFixedYear = new Date(2023, 0, 1, 0, 0); // 2023년 1월 1일 0시 0분
  const endOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59); // 오늘의 자정

  // From 날짜 설정 (2023년 1월 1일 0시 0분)
  dateSelects.from.year.value = startOfFixedYear.getFullYear();
  dateSelects.from.month.value = '01';
  dateSelects.from.day.value = '01';
  dateSelects.from.hour.value = '00';
  dateSelects.from.minute.value = '00';

  // To 날짜 설정 (오늘의 자정 23:59:59)
  dateSelects.to.year.value = endOfToday.getFullYear();
  dateSelects.to.month.value = (endOfToday.getMonth() + 1).toString().padStart(2, '0');
  dateSelects.to.day.value = endOfToday.getDate().toString().padStart(2, '0');
  dateSelects.to.hour.value = '23';
  dateSelects.to.minute.value = '59';

  // 날짜 표시 업데이트
  updateDisplayValue();
}


function initializeDateSelection() {
  // 연도 옵션 생성 (현재 연도부터 5년 전까지)
  function populateYears(yearSelect) {
    const currentYear = new Date().getFullYear();
    yearSelect.innerHTML = '';
    for(let year = currentYear; year >= currentYear - 4; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearSelect.appendChild(option);
    }
  }

  // 월 옵션 생성 (1-12월)
  function populateMonths(monthSelect) {
    monthSelect.innerHTML = '';
    for(let month = 1; month <= 12; month++) {
      const option = document.createElement('option');
      const monthStr = month.toString().padStart(2, '0');
      option.value = monthStr;
      option.textContent = monthStr; 
      monthSelect.appendChild(option);
    }
  }

  // 일 옵션 생성
  function populateDays(daySelect, year, month) {
    const daysInMonth = new Date(year, month, 0).getDate();
    daySelect.innerHTML = '';
    for(let day = 1; day <= daysInMonth; day++) {
      const option = document.createElement('option');
      const dayStr = day.toString().padStart(2, '0');
      option.value = dayStr;
      option.textContent = dayStr;
      daySelect.appendChild(option);
    }
  }

  // 시간 옵션 생성 (0-23시)
  function populateHours(hourSelect) {
    hourSelect.innerHTML = '';
    for(let hour = 0; hour < 24; hour++) {
      const option = document.createElement('option');
      const hourStr = hour.toString().padStart(2, '0');
      option.value = hourStr;
      option.textContent = hourStr;
      hourSelect.appendChild(option);
    }
  }

  // 분 옵션 생성 (0-59분)
  function populateMinutes(minuteSelect) {
    minuteSelect.innerHTML = '';
    for(let minute = 0; minute < 60; minute++) {
      const option = document.createElement('option');
      const minuteStr = minute.toString().padStart(2, '0');
      option.value = minuteStr;
      option.textContent = minuteStr;
      minuteSelect.appendChild(option);
    }
  }

  // 모든 select 초기화 및 이벤트 리스너 설정
  ['from', 'to'].forEach(type => {
    populateYears(dateSelects[type].year);
    populateMonths(dateSelects[type].month);
    populateHours(dateSelects[type].hour);
    populateMinutes(dateSelects[type].minute);

    // 월 변경 시 일 수 업데이트
    dateSelects[type].month.addEventListener('change', () => {
      populateDays(
        dateSelects[type].day,
        dateSelects[type].year.value,
        dateSelects[type].month.value
      );
      updateDisplayValue();
    });

    // 연도 변경 시에도 일 수 업데이트
    dateSelects[type].year.addEventListener('change', () => {
      populateDays(
        dateSelects[type].day,
        dateSelects[type].year.value,
        dateSelects[type].month.value
      );
      updateDisplayValue();
    });

    // 다른 select 변경 시 표시값 업데이트
    Object.values(dateSelects[type]).forEach(select => {
      select.addEventListener('change', updateDisplayValue);
    });

    // 초기 일(day) 옵션 생성
    populateDays(
      dateSelects[type].day,
      dateSelects[type].year.value || new Date().getFullYear(),
      dateSelects[type].month.value || '01'
    );
  });

  // 초기 날짜 설정 호출
  setDefaultDates();
}

  // select 요소들 가져오기
  const dateSelects = {
    from: {
      year: document.getElementById('fromYear'),
      month: document.getElementById('fromMonth'),
      day: document.getElementById('fromDay'),
      hour: document.getElementById('fromHour'),
      minute: document.getElementById('fromMin')
    },
    to: {
      year: document.getElementById('toYear'),
      month: document.getElementById('toMonth'),
      day: document.getElementById('toDay'),
      hour: document.getElementById('toHour'),
      minute: document.getElementById('toMin')
    }
  };

  // 날짜 표시 업데이트(<input id="date-time-range-value" onfocus="switchInput('#date-time-range-input');setFocusToFromYear();" >)
  function updateDisplayValue() {
    const fromDate = new Date(
      dateSelects.from.year.value,
      parseInt(dateSelects.from.month.value) - 1,
      dateSelects.from.day.value,
      dateSelects.from.hour.value,
      dateSelects.from.minute.value
    );

    const toDate = new Date(
      dateSelects.to.year.value,
      parseInt(dateSelects.to.month.value) - 1,
      dateSelects.to.day.value,
      dateSelects.to.hour.value,
      dateSelects.to.minute.value
    );

    const formatDate = (date) => {
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const hour = date.getHours().toString().padStart(2, '0');
      const minute = date.getMinutes().toString().padStart(2, '0');
      return `${year}.${month}.${day} ${hour}:${minute}`;
    };

    document.getElementById('date-time-range-value').value = 
      `${formatDate(fromDate)} ~ ${formatDate(toDate)}`;
  }


// MySQL datetime 형식으로 변환하는 함수를 수정
function formatDateForSearch(date) {
  // 로컬 시간을 그대로 사용하도록 수정
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  const seconds = date.getSeconds().toString().padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 검색 날짜 범위를 가져오는 함수도 수정
function getSearchDateRange() {
  // console.log('dateSelects:', dateSelects);

  const fromDate = new Date(
    dateSelects.from.year.value,
    parseInt(dateSelects.from.month.value) - 1,
    dateSelects.from.day.value,
    dateSelects.from.hour.value,
    dateSelects.from.minute.value
  );

  const toDate = new Date(
    dateSelects.to.year.value,
    parseInt(dateSelects.to.month.value) - 1,
    dateSelects.to.day.value,
    dateSelects.to.hour.value,
    dateSelects.to.minute.value
  );

  return { fromDate, toDate };  // startDate, endDate가 아닌 fromDate, toDate로 반환
}

/////////////////////////////////////////////////////////////////////////////
// 스택선택에 따른 데이터 변동
document.addEventListener('fuelcellChanged', async function(e) {
  try {
      // URL 파라미터 확인
      const urlParams = new URLSearchParams(window.location.search);
      const plant = urlParams.get('plant');
      const fuelcell = urlParams.get('fuelcell');

      if (!plant || !fuelcell) {
          console.warn('필요한 URL 파라미터가 없습니다:', { plant, fuelcell });
          return;
      }

      // 현재 페이지 컨텍스트에 따라 적절한 함수를 호출
      if (currentPageContext === 'search') {
          const conditions = { ...currentSearchConditions, plant, fuelcell };
          await searchWithData(conditions);
      } else if (currentPageContext === 'bookmark' && currentBookmarkId) {
          await filterDataByBookmark(currentBookmarkId);
      } else {
          await searchWithData({ plant, fuelcell });
      }
      
      await getBookmarkTabs(); // 북마크 탭 다시 로드
      
  } catch (error) {
      console.error('데이터 업데이트 중 오류:', error);
  }
});

document.querySelector('#group-select').addEventListener('change', async (e) => {
  try {
    const newGroup = e.target.value;
    // URL 파라미터도 group으로 갱신
    const url = new URL(window.location.href);
    url.searchParams.set('group', newGroup);
    window.history.replaceState({}, '', url);

    // 필요한 경우 plant, fuelcell도 같이 처리

    // 북마크 탭 다시 로드
    await getBookmarkTabs();

    // 필요하다면, 다른 데이터 갱신 함수도 호출
  } catch (err) {
    console.error('그룹 변경 처리 오류:', err);
  }
});


export async function initializeSearch() {
  await initializeDateSelection();  // 날짜 선택 초기화
  setDefaultDates(); // setDefaultDates 호출하여 날짜 설정

  // 설정된 날짜로 검색 조건 생성
  const { fromDate, toDate } = getSearchDateRange();
  const initialSearchConditions = {
    "start-date": formatDateForSearch(fromDate),
    "end-date": formatDateForSearch(toDate)
  };

  // 현재 검색 조건 업데이트
  currentSearchConditions = initialSearchConditions;

  // 북마크 탭 가져오기
  getBookmarkTabs();

  // 체크박스 초기화
  initCheckboxStateAndSelectAll(false);

  // 마지막에 한 번만 데이터 로드, type전달
  return searchWithData(currentSearchConditions, 1, type);
}

// function handleDeleteItems() {
//   const selectedItems = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked');
//   if (selectedItems.length === 0) {
//       alert('삭제할 항목을 선택해주세요.');
//       return;
//   }

//   if (!confirm(`선택한 ${selectedItems.length}개의 항목을 삭제하시겠습니까?`)) {
//       return;
//   }

//   if (currentPageContext === 'all' || currentPageContext === 'search') {
//       deleteSelectedItems(selectedItems);
//   } else if (currentPageContext === 'bookmark') {
//       const activeTab = document.querySelector(".tab-item a.active");
//       if (!activeTab) {
//           alert("활성화된 탭이 없습니다.");
//           return;
//       }
//       const bookmarkId = activeTab.getAttribute("data-bookmark-id");
//       deleteBookmarkItems(bookmarkId, selectedItems);
//   }
// }

////////////////////////////////////////////////////////////////////////////
// 페이지 초기화 함수
function initializeSearchConditions() {
  if (document.referrer && new URL(document.referrer).pathname !== window.location.pathname) {
    sessionStorage.removeItem('searchConditions');
    currentSearchConditions = {};
    resetSearchConditions(); // 기존 함수 활용
  }
}

// 타입 선택기 설정 함수
function setupTypeSelector(typeSelector) {
  type = typeSelector.value;
  typeSelector.addEventListener('change', function() {
    type = this.value;
    searchWithData(currentSearchConditions);
  });
}

// 이벤트 리스너 설정 함수
function setupEventListeners() {
  // fuelcellConfig가 로드되지 않았다면 대기
  if (!window.isFuelcellConfigLoaded) {
    console.log('연료전지 설정 로드 대기 중...');
    document.addEventListener('fuelcellConfigLoaded', () => {
      setupEventListeners();
    }, { once: true });
    return;
  }

  console.log('이벤트 리스너 설정 시작');

  // 삭제 버튼 이벤트 리스너
  const deleteButton = document.getElementById('delete-db-in-bmk');
  if (deleteButton) {
    deleteButton.addEventListener('click', handleDeleteItems);
    console.log('삭제 버튼 이벤트 리스너 설정 완료');
  }

  // 업로드 폼 이벤트 리스너
  const uploadForm = document.getElementById('uploadForm');
  if (uploadForm) {
    uploadForm.addEventListener('submit', handleFileUpload);
    console.log('업로드 폼 이벤트 리스너 설정 완료');
  }

  // 업로드 버튼 이벤트 리스너
  const uploadButton = document.getElementById('uploadButton');
  if (uploadButton) {
    uploadButton.addEventListener('click', function(e) {
      e.preventDefault();
      handleFileUpload(e);
    });
    console.log('업로드 버튼 이벤트 리스너 설정 완료');
  }

  // 테이블 관련 이벤트 리스너
  const tableBody = document.getElementById('stack_search_table');
  if (tableBody) {
    dateCellClickHandler(tableBody);
    setupSelectAllCheckbox();
    console.log('테이블 이벤트 리스너 설정 완료');
  }

  console.log('모든 이벤트 리스너 설정 완료');
}

// 초기 데이터 로드 함수
async function loadInitialData() {
  try {
    // fuelcellConfig가 로드될 때까지 대기
    let retryCount = 0;
    while (!window.fuelcellConfig && retryCount < 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      retryCount++;
    }
    
    if (!window.fuelcellConfig) {
      throw new Error('fuelcellConfig를 로드할 수 없습니다');
    }

    const currentConfig = await getCurrentConfig();
    if (currentConfig) {
      await initializeSearch();
      updateSearchFields(type);
      
      // 여기에 체크박스 초기화 코드 추가
      initCheckboxStateAndSelectAll(false);
      
      // URL 파라미터가 있으면 데이터 로드
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.has('plant') && urlParams.has('fuelcell')) {
        // 데이터 로드 트리거
        searchWithData({}, 1, type);
      }
    }
  } catch (error) {
    console.error('데이터 로드 중 오류 발생:', error);
    throw error;
  }
}

// DOM 로딩 시 모든 이벤트 리스너를 설정하고 "항목 삭제" 버튼 상태를 초기화하는 함수 호출
document.addEventListener("DOMContentLoaded", async function () {
  try {
    // fuelcellConfig가 로드될 때까지 대기
    await new Promise((resolve) => {
      if (window.isFuelcellConfigLoaded) {
        resolve();
      } else {
        document.addEventListener('fuelcellConfigLoaded', resolve, { once: true });
      }
    });

    // 검색 조건 초기화
    initializeSearchConditions();

    const tableBody = document.querySelector('#stack_search_table');
    const typeSelector = document.getElementById('sin-pulse-select');
	// >>> 250327 hjkim - init_select_tag
	// function init_select_tag(el) {
	// 	let opts = el.querySelectorAll("option");
	// 	opts[1].textContent = opts[1].textContent.toUpperCase(); // 대문자로 정정
	// 	let new_opt = document.createElement("option");
	// 	new_opt.value = "NPULSE";
	// 	new_opt.setAttribute("data-i18n", "stack.npulse");
	// 	new_opt.textContent = "NPULSE";
	// 	el.append(new_opt);
	// }
	// init_select_tag(typeSelector);
	// // <<< 250327 hjkim - init_select_tag
  //   type = typeSelector.value;  // 초기값 설정

    // 기본 설정 초기화
    await initializeDateSelection();
    dateCellClickHandler(tableBody);
    initializeTypeSelector(typeSelector);

    // sin/pulse 선택 변경 이벤트 리스너
    setupTypeSelector(typeSelector);

    // 이벤트 리스너 설정
    setupEventListeners();

    // 초기 데이터 로드
    await loadInitialData();

    // 체크박스 초기화 플래그 설정
    isInitializingCheckboxes = true;

    // 체크박스 초기화
    initCheckboxStateAndSelectAll(false);
    isInitializingCheckboxes = false;

    // 파일 업로드 성공 이벤트 리스너 추가
    document.addEventListener('fileUploadSuccess', function() {
        // 현재 검색 조건으로 데이터 새로고침
        if (currentPageContext === 'bookmark' && currentBookmarkId) {
            filterDataByBookmark(currentBookmarkId);
        } else {
            searchWithData(currentSearchConditions);
        }
    });
  } catch (error) {
    console.error('초기화 중 오류 발생:', error);
  }
});

// 페이지 이동 감지를 위한 이벤트 리스너
window.addEventListener('beforeunload', function(){
  // 현재 URL을 sessionStorage에 저장
 sessionStorage.setItem('lastPage', window.location.pathname);
})

function initializeTypeSelector(typeSelector) {
  // localStorage에서 저장된 값을 가져와 초기값 설정
  const savedValue = localStorage.getItem('selectedType');
  if (savedValue) {
    typeSelector.value = savedValue;
  }

  //초기 테이블 및 검색 필드 업데이트
  type = typeSelector.value; // 전역  type 변수 설정
  updateTable(type); // 테이블 조회
  updateSearchFields(type); //상세검색
  updateEisOptions(type); // Stack EIS Analysis 그래프의 그래프명 변경함수

  // sin/pulse 선택이 변경될 때 localStorage에 저장하고 테이블 업데이트
  typeSelector.addEventListener('change', function() {
    const selectedValue = this.value;
    type = selectedValue; // 전역 type변수 어벧이트
    localStorage.setItem('selectedType', selectedValue); // 선택한 값을 localStorage에 저장
    
    // 테이블 초기화 및 업데이트
    updateTable(selectedValue);
    updateSearchFields(selectedValue);
    updateEisOptions(selectedValue);
    resetSearchConditions();   // 검색 조건 초기화
    initCheckboxStateAndSelectAll(false); // 체크박스 초기화
    // 새로운 타입으로 데이터 검색
    searchWithData({}, 1, selectedValue);
  });
}

// Stack EIS Analysis 그래프 명 업데이트 함수
function updateEisOptions(selectedType) {
  const eisSelector = document.getElementById('eis_select_title');
  const pulseCheckBox = document.getElementById('view-mode-switch');
  // >>> 250327 hjkim - Added NPULSE >>> 250403 jhkim - Added CALIB
  if (selectedType === 'PULSE' || selectedType === 'NPULSE') {
    eisSelector.innerHTML = ` <option value="2" >Bode plot</option>
      <option value="3" selected>CPI</option>
    `;
    pulseCheckBox.style.display = 'flex';
  } else if (selectedType === 'SIN' || selectedType === 'CALIB'){
    eisSelector.innerHTML = `
    <option value="1" selected data-i18n="stack.stack_state">스택상태</option>
    <option value="2">Bode plot</option>
   `;
    pulseCheckBox.style.display = 'none';
  }
  
  // i18next 처리 수정
  if (window.i18next) {
    const element = eisSelector.querySelector('[data-i18n]');
    if (element) {
      i18next.reloadResources().then(() => {
        i18next.loadNamespaces().then(() => {
          element.innerHTML = i18next.t('stack.stack_state');
        });
      });
    }
  }
  showHide(eisSelector);
}


function updateTable(value) {
  // 전역 type 변수 업데이트 추가
  type= value; 

  const table = document.querySelector('#dynamic-table');
  const tableHead = document.querySelector('#dynamic-table thead');
  const searchDetail = document.querySelector('#dynamic-search-detail');  // 상세검색 tbody
  const tableBody = document.querySelector('#dynamic-table tbody'); // 실제 데이터 들어갈 tbody
  
  // 항목에 따라 css 변경
  if (value === 'PULSE' || value === 'NPULSE') {
    table.className = 'table table-fixed table-striped pulse'
  } else if (value === 'SIN' || value === 'CALIB') {
    table.className = 'table table-fixed table-striped'
  }

  tableHead.innerHTML = ''; // 기존 헤더 초기화
  tableBody.innerHTML = ''; // 기존 본문 초기화

     // 상세검색 tbody 내용 설정
     searchDetail.innerHTML = `
     <tr class="filter-sw">
         <td onclick="swFilterPanel();">↕상세검색</td>
     </tr>

     <tr class="filter-label">
         <td style="text-align: right !important;padding-right: 17px !important;">초과</td>
         <td><input type="radio" name="a01" id="o01" class="search-condition"><label for="o01">&gt;</label></td>
         <td><input type="radio" name="a02" id="o02" class="search-condition"><label for="o02">&gt;</label></td>
         <td><input type="radio" name="a03" id="o03" class="search-condition"><label for="o03">&gt;</label></td>
         <td><input type="radio" name="a04" id="o04" class="search-condition"><label for="o04">&gt;</label></td>
         <td><input type="radio" name="a05" id="o05" class="search-condition"><label for="o05">&gt;</label></td>
         <td></td>
         <td></td>
     </tr>

     <tr class="filter-input">
         <td style="text-align: right !important;padding-right: 10px !important;">
             <button class="btn-of mx-1 search_reset" id="stack_reset_btn">초기화</button>
         </td>
         <td class="common-field"><input type="number" name="hzfrom" id="input-from" class="search-condition"></td>
         <td class="common-field"><input type="number" name="hzto" id="input-to" class="search-condition"></td>
         <td class="sin-field"><input type="number" name="m-l" id="input-m-l" class="search-condition"></td>
         <td class="sin-field"><input type="number" name="x1" id="input-x1" class="search-condition"></td>
         <td class="sin-field"><input type="number" name="x2" id="input-x2" class="search-condition"></td>
         <td><input type="text" name="merr" id="input-err" class="search-condition"></td>
         <td><input type="text" name="bigo" id="input-bigo" class="search-condition"></td>
         <td><button class="stk-sch-btn btn-of w-25 float-end" style="width: 100% !important;">검색</button></td>
     </tr>

     <tr class="filter-label">
         <td style="text-align: right !important;padding-right: 17px !important;">미만</td>
         <td><input type="radio" name="a01" id="u01" class="search-condition"><label for="u01">&lt;</label></td>
         <td><input type="radio" name="a02" id="u02" class="search-condition"><label for="u02">&lt;</label></td>
         <td><input type="radio" name="a03" id="u03" class="search-condition"><label for="u03">&lt;</label></td>
         <td><input type="radio" name="a04" id="u04" class="search-condition"><label for="u04">&lt;</label></td>
         <td><input type="radio" name="a05" id="u05" class="search-condition"><label for="u05">&lt;</label></td>
         <td></td>
         <td></td>
     </tr>
 `;

  if (value === 'SIN') {
    tableHead.innerHTML = `
      <tr>
        <th><input type="checkbox" id="search-all-checkbox"></th>
        <th>시간</th>
        <th>From</th>
        <th>To</th>
        <th>M-L</th>
        <th>x1</th>
        <th>Err</th>
        <th>Note</th>
      </tr>
    `;
    // SIN 데이터 렌더링 로직 추가
    fetchDataAndRender('SIN');
  } else if (value === 'PULSE') {
    tableHead.innerHTML = `
      <tr>
        <th><input type="checkbox" id="search-all-checkbox"></th>
        <th>시간</th>
        <th>Hz</th>
        <th>peak</th>
        <th>RISE</th>
        <th>APEX</th>
        <th>DIFF</th>
        <th>DEG</th>
        <th>RATE</th>
        <th>Err</th>
        <th>Note</th>
      </tr>
    `;
    // PULSE 데이터 렌더링 로직 추가
    fetchDataAndRender('PULSE');
  } else if (value === 'NPULSE') {
    tableHead.innerHTML = `
      <tr>
        <th><input type="checkbox" id="search-all-checkbox"></th>
        <th>시간</th>
        <th>Hz</th>
        <th>peak</th>
        <th>RISE</th>
        <th>APEX</th>
        <th>DIFF</th>
        <th>DEG</th>
        <th>RATE</th>
        <th>Err</th>
        <th>Note</th>
      </tr>
    `;
    // NPULSE 데이터 렌더링 로직 추가
    fetchDataAndRender('NPULSE');
  } else if (value === 'CALIB') {
    tableHead.innerHTML = `
      <tr>
        <th><input type="checkbox" id="search-all-checkbox"></th>
        <th>시간</th>
        <th>From</th>
        <th>To</th>
        <th>M-L</th>
        <th>x1</th>
        <th>Err</th>
        <th>Note</th>
      </tr>
    `;
    // CALIB 데이터 렌더링 로직 추가
    fetchDataAndRender('CALIB');
  }
}

function fetchDataAndRender(type) {
  const conditions = JSON.parse(sessionStorage.getItem('searchConditions')) || {};
  const currentConfig = getCurrentConfig();
  const { powerplant_id, fuelcell_id } = currentConfig; // 필요한 ID들을 구조분해할당

  // 검색 조건에 plant_id와 fuelcell_id 추가
  const searchParams = {
    ...conditions,
    powerplant_id,
    fuelcell_id
  };

  fetchData(searchParams, 1, null, type)
    .then(response => {
      console.log(`Fetched ${type} data:`, response.data);
      displayResults(response.data, 1, response.totalRows, type);
    })
    .catch(error => {
      console.error(`Error fetching ${type} data:`, error);
    });
}


// sin, pulse, npulse, calib 인지에 따라 상세검색 내용 변경
function updateSearchFields(type) {
  console.log("updateSearchFields 호출됨 - 타입:", type);
  const commonFields = document.querySelectorAll('.common-field');
  const sinFields = document.querySelectorAll('.sin-field');
  const pulseFields = document.querySelectorAll('.pulse-field');
  const npulseFields = document.querySelectorAll('.npulse-field');
  const calibFields = document.querySelectorAll('.calib-field');
  const allCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][name="search-checkbox"]'
  );
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = false; // 체크 해제
  });
  // 공통 필드는 항상 표시
  commonFields.forEach(field => field.style.display = '');

  if (type === 'SIN') {
    sinFields.forEach(field => field.style.display = '');
    pulseFields.forEach(field => field.style.display = 'none');
    npulseFields.forEach(field => field.style.display = 'none');
    calibFields.forEach(field => field.style.display = 'none');
  } else if (type === 'PULSE') {
    sinFields.forEach(field => field.style.display = 'none');
    pulseFields.forEach(field => field.style.display = '');
    npulseFields.forEach(field => field.style.display = 'none');
    calibFields.forEach(field => field.style.display = 'none');
  } else if (type === 'NPULSE') {
    sinFields.forEach(field => field.style.display = 'none');
    pulseFields.forEach(field => field.style.display = 'none');
    npulseFields.forEach(field => field.style.display = '');
    calibFields.forEach(field => field.style.display = 'none');
  } else if (type === 'CALIB') {
    sinFields.forEach(field => field.style.display = 'none');
    pulseFields.forEach(field => field.style.display = 'none');
    npulseFields.forEach(field => field.style.display = 'none');
    calibFields.forEach(field => field.style.display = '');
  }
}
 

  // 기타 초기화 및 이벤트 리스너 설정
  const chkbox = document.querySelectorAll(".tab-list input[type=checkbox]");
  const dbEdit = document.querySelectorAll(".tab-list a.db-edit");
  const dbEditValue = document.querySelectorAll(".tab-list a.db-edit span");
  const dbEditActive = document.querySelectorAll(".tab-list div.db-edit");
  const dbEditInput = document.querySelectorAll(".tab-list div.db-edit input");
  const dbEditSelect = document.querySelectorAll(".tab-list div.db-edit select");

  dbEdit.forEach((e, i) =>
    e.addEventListener("dblclick", function () {
      chkbox.forEach((e) => {
        e.disabled = false;
      });
      dbEdit[i].classList.toggle("d-none");
      dbEditActive[i].classList.toggle("d-none");
      dbEditInput[i].value = dbEditValue[i].innerText;
      const colorValue = dbEditSelect[i].value;
      dbEditSelect[i].style.color = getColorCode(colorValue);
      dbEditInput[i].focus();
    })
  );

  dbEditInput.forEach((input, i) =>
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        dbEditValue[i].innerText = dbEditInput[i].value;
        updateBookmark(
          dbEdit[i].parentElement.getAttribute("data-bookmark-id"), // ID를 가져오는 방법 변경
          dbEditInput[i].value,
          dbEditSelect[i].value
        );
        dbEdit[i].classList.toggle("d-none");
        dbEditActive[i].classList.toggle("d-none");
        chkbox.forEach((e) => {
          e.disabled = false;
        });
      }
    })
  );

  dbEditSelect.forEach((select, i) =>
    select.addEventListener("change", function () {
      const selectedColorCode = getColorCode(select.value);
      select.style.color = selectedColorCode;
      updateBookmark(
        dbEdit[i].parentElement.getAttribute("data-bookmark-id"), // ID를 가져오는 방법 변경
        dbEditInput[i].value,
        select.value
      );
    })
  );

  const tbody = document.querySelector("#stack_search_table");
  const graphButton = document.getElementById("graph-btn");
  const addButton = document.getElementById("add-bmk-btn");
  const stackDataMngHeadElement = document.getElementById("stack-data-mng-head");
  const bookmarkTabContainer = document.getElementById("bookmark-tab");
  const checkboxes = document.querySelectorAll('input[name="viewMode"]');
  const rangeBtn = document.getElementById("rangeSelectBtn");

 // PULSE, NPULSE 체크박스 단일 체크, overlay 체크 시 범위 설정 보이기
checkboxes.forEach((cb) => {
  cb.addEventListener('change', (e) => {
    if (e.target.checked) {
      checkboxes.forEach((other) => {
        if (other !== e.target) other.checked = false;
      });
    } else {
      e.target.checked = true;
    }
    const isOverlaySelected = document.querySelector('input[name="viewMode"][value="overlay"]').checked;
    rangeBtn.style.display = isOverlaySelected ? 'flex' : 'none';
  });
});

 // '스택 데이터 관리' 클릭 시 이벤트 리스너
if (stackDataMngHeadElement) {
  stackDataMngHeadElement.addEventListener("click", function () {
    currentPageContext = 'all';
    searchWithData({}); // 전체 데이터 로드
  });
}

// 북마크 탭 클릭 시 이벤트 리스너
if (bookmarkTabContainer) {
  bookmarkTabContainer.addEventListener("click", function (event) {
    const target = event.target.closest("a");
    if (target && target.classList.contains("tab-item")) {
      document
        .querySelectorAll(".tab-item a")
        .forEach((tab) => tab.classList.remove("active"));
      target.classList.add("active");

      const bookmarkId = target.getAttribute("data-bookmark-id");
      if (bookmarkId) {
        currentPageContext = 'bookmark';
        currentBookmarkId = bookmarkId;
        filterDataByBookmark(bookmarkId).then(() => {
        // 북마크 데이터 로드 후 체크박스 초기화
        initCheckboxStateAndSelectAll(false); // 체크박스 선택 해제
        });
      }
    }
  });
}

document.addEventListener('change', function(e) {
  if (e.target && e.target.type === 'checkbox' && e.target.name === 'search-checkbox') {
    updateDeleteButtonState();
  }
});

// function updateDeleteButtonState() {
//   const deleteButton = document.getElementById('delete-db-in-bmk');
//   const checkedItems = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked');
  
//   if (deleteButton) {
//     deleteButton.disabled = checkedItems.length === 0;
//   }
// }

  // 이벤트 리스너 설정
  if (tbody) {
    // tbody에 설정된 change 이벤트 리스너 수정
    tbody.addEventListener("change", function (event) {
      // if (
        // event.target.type === "checkbox" &&
        // event.target.name === "search-checkbox" &&
        // !isInitializingCheckboxes // 초기화 중이 아닐 때만 실행
      // ) 
      {
        const dataNo = event.target.getAttribute("data-no");
        updateSelectedCount();
      }
    });
  }

  if (graphButton) {
    graphButton.addEventListener("click", copySelectedFiles);
  }

  // 기존 탭 버튼 설정
  const tabBtns = document.querySelectorAll(".sub-tab .tab-item a");
  tabBtns.forEach((e) =>
    e.addEventListener("click", function () {
      tabBtns.forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");
    })
  );

  // all-item-tab 클릭 시 전체 데이터를 다시 로드하는 이벤트 리스너 추가
  const allItemsTab = document.querySelector(".all-item-tab");
  if (allItemsTab) {
    allItemsTab.addEventListener("click", function (event) {
      event.preventDefault();
      document
        .querySelectorAll(".tab-item a")
        .forEach((tab) => tab.classList.remove("active"));
      this.classList.add("active");

      // 현재 검색 조건 유지하여 전체 데이터 검색
      searchWithData(currentSearchConditions).then(() => {
        // 체크박스 상태 초기화
        initCheckboxStateAndSelectAll(false);
      });
    });
  }

  // 초기 로드 시 북마크 탭 불러오기
  getBookmarkTabs();

  const bookmarkBtn = document.getElementById("bookmark-btn");
  if (bookmarkBtn) {
    bookmarkBtn.addEventListener("click", function () {
      openModal("manage-tab-modal"); // 모달 ID를 명시적으로 전달
      setupBookmarkModal();
    });
  }

  if (addButton) {
    addButton.addEventListener("click", function () {
      console.log("북마크 버튼 클릭됨")
      const bookmarkName = document.getElementById("new-tag-name").value; // 북마크 이름을 입력 필드에서 가져옴
      if (bookmarkName) {
        addBookmark(bookmarkName);
      } else {
        alert("북마크 이름을 입력해주세요.");
      }
    });
  } else {
    console.error("북마크 추가 버튼 작동 에러");
  }
  // sessionStorage에서 검색 조건을 추출하여 초기화
  const savedSearchConditions = sessionStorage.getItem('searchConditions');
  if (savedSearchConditions) {
    const searchConditions = JSON.parse(savedSearchConditions);

    // 초기 로드 시 검색 조건에 따라 검색 실행
    searchWithData(searchConditions).then(() => {
      initCheckboxStateAndSelectAll(false);
      updateSelectedCount();
    });
  }

  ////////////////////////////////////////////////////////////////////////
  // 페이지 당 데이터 수 선택 콤보박스 이벤트 리스너
  document.addEventListener('change', function(e) {
    if (e.target && e.target.id === "items-per-page") {
      const selectedValue = e.target.value;
      itemsPerPage = selectedValue === "all-data" ? "all-data" : parseInt(selectedValue);
      goToPage(1);
    }
  });
  
  ////////////////////////////////////////////////////////////////////////

  // 데이터 로드 및 기타 초기화
  searchWithData({}).then(() => {
    console.log("searchWithData completed");
    // 필터링된 항목 선택 상태 초기화 및 체크박스 업데이트
	// >>> 250327 hjkim - remove check all
    //initCheckboxStateAndSelectAll(true);
	// <<< 250327 hjkim - remove check all
    console.log("initCheckboxStateAndSelectAll completed");
    updateSelectedCount();
    setupSelectAllCheckbox();
    console.log("updateSelectedCount completed");
  });

  setupSelectAllCheckbox();
  console.log("setupSelectAllCheckbox called");
  // updateSelectedCount();
  // updateDeleteButtonState(); // 전체 항목에 해당될 시에는 '항목 삭제' 버튼 상태 업데이트

  // 북마크 관련 초기화
  getBookmarkTabs();
  getTabList();

  // Redis 데이터 초기화 함수 호출
  fetchRedisDataAndUpdate(); 


///////////////////////////////////////////////////////////////////////////
// '항목 삭제'버튼 -> '전체항목'일때랑 '북마크' 일때랑 다르게 적용 -> 이러면안됨
// 전체 항목일때와 북마크 일때 똑같이 적용해야함 . 
// 1. 항목 삭제 함수 정의
async function handleDeleteItems() {
  const selectedCheckboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked');
  
  if (selectedCheckboxes.length === 0) {
      alert("삭제할 항목을 선택해주세요.");
      return;
  }

  if (!confirm('선택한 항목을 삭제하시겠습니까?')) {
      return;
  }

  // 현재 컨텍스트 확인 (북마크 또는 전체 목록)
  const activeTab = document.querySelector(".tab-item a.active");
  const isBookmarkContext = activeTab && activeTab.hasAttribute("data-bookmark-id");
  const bookmarkId = isBookmarkContext ? activeTab.getAttribute("data-bookmark-id") : null;

  // 컨텍스트에 따라 다른 확인 메시지 표시
  const confirmMessage = isBookmarkContext ? 
    `선택한 ${selectedCheckboxes.length}개의 항목을 북마크에서 제거하시겠습니까?` :
    `선택한 ${selectedCheckboxes.length}개의 항목을 삭제하시겠습니까?\n(이 작업은 되돌릴 수 없습니다)`;

  if (!confirm(confirmMessage)) {
      return;
  }

  const dataNos = Array.from(selectedCheckboxes).map(checkbox => 
      checkbox.getAttribute("data-no")
  );
  

  // 전송할 데이터 확인을 위한 콘솔 출력
  console.log('북마크 삭제  전송할 데이터:', {
      dataNos: dataNos,
      bookmarkId: bookmarkId,
      isBookmarkContext: isBookmarkContext
  });

  try {
      const response = await fetch('js/stack/delete_search_data.php', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
          },
          body: JSON.stringify({
              dataNos: dataNos,
              bookmarkId: bookmarkId,
              isBookmarkContext: isBookmarkContext
          })
      });

      if (!response.ok) {
          console.log(' 북마크 삭제 서버 응답 상태:', response.status, response.statusText);
          throw new Error('서버 응답이 올바르지 않습니다.');
      }

      const result = await response.json();
      console.log('북마크 삭제 서버 응답 데이터:', result);

      if (result.success) {
        // 북마크 컨텍스트일 경우 화면에서만 제거
        if (isBookmarkContext) {
            selectedCheckboxes.forEach(checkbox => {
                const row = checkbox.closest('tr');
                if (row) row.remove();
            });
            alert('선택한 항목이 북마크에서 제거되었습니다.');
            filterDataByBookmark(bookmarkId);
        } else {
            // 전체 항목 컨텍스트일 경우 데이터 새로고침
            alert('선택한 항목이 삭제되었습니다.');
            searchWithData(currentSearchConditions);
        }

        updateSelectedCount();
        updateDeleteButtonState();
    } else {
        alert('작업 실패: ' + (result.error || '알 수 없는 오류'));
    }
} catch (error) {
    console.error('에러 발생:', error);
    alert('오류가 발생했습니다: ' + error.message);
}
}

// 2. 삭제 버튼 상태 업데이트 함수
function updateDeleteButtonState() {
  const deleteButton = document.getElementById('delete-db-in-bmk');
  const checkedItems = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked');
  
  if (deleteButton) {
      deleteButton.disabled = checkedItems.length === 0;
  }
}

// 3. DOM이 로드된 후 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', function() {
  const deleteButton = document.getElementById('delete-db-in-bmk');
  if (deleteButton) {
      deleteButton.addEventListener('click', handleDeleteItems);
  } else {
      console.error("삭제 버튼을 찾을 수 없습니다.");
  }
});


////////////////////////////////////////////////////////////////////////////
document
  .getElementById("stack-data-mng-head")
  .addEventListener("click", function () {
    currentPageContext = 'all';
    currentBookmarkId = null;
    
    resetSearchConditions(); // 검색 조건 초기화 함수 호출
    searchWithData({}).then(() => {
      // 체크박스 상태 초기화
      initCheckboxStateAndSelectAll(false);
      // 선택된 항목 수 업데이트
      updateSelectedCount();
      // 삭제 버튼 상태 업데이트
      updateDeleteButtonState();
    });
    

    // 모든 탭에서 'active' 클래스 제거
    document.querySelectorAll(".tab-item a").forEach((tab) => {
      tab.classList.remove("active");
    });

    // '전체항목' 탭에만 'active' 클래스 추가
    const allItemsTab = document.querySelector(".all-item-tab");
    if (allItemsTab) {
      allItemsTab.classList.add("active");
    }

    // 현재 요소에 'bold' 클래스 추가
    this.classList.add("bold");
  });

let isResetTriggered = false;

// 필터 검색 초기화 버튼
document.querySelectorAll(".search_reset").forEach((button) => {
  button.addEventListener("click", function () {
    resetSearchConditions(); // 검색 조건 초기화 함수 호출
    isResetTriggered = true;
    performSearch({ skipUrlUpdate : true })
  });
});

// 검색 조건 초기화 함수
export function resetSearchConditions() {
  console.log("resetSearchConditions called");

  // 입력 필드 초기화
  document.querySelectorAll(".search-condition").forEach((input) => {
    input.value = ""; // 빈 문자열로 설정
  });

  // 라디오 버튼 초기화
  document
    .querySelectorAll('.search-condition[type="radio"]')
    .forEach((radio) => {
      radio.checked = false; // 선택 해제
    });

  // 라벨 입력 필드 초기화
  document.getElementById("input-label").value = "";

  // 날짜 선택 초기화
  setDefaultDates();

  // Error Code select 초기화
  document.getElementById('stack-error-codes-search').value = '';

  // date-time-range-input 닫기
  document.querySelector('#date-time-range-input').classList.remove('open');
  
  // date-time-range-value 활성화, 업데이트 후 다시 비활성화
  const dateTimeRangeValue = document.getElementById('date-time-range-value');
  dateTimeRangeValue.disabled = false;
  updateDisplayValue();
 
  // 현재 검색 조건 객체 초기화
  currentSearchConditions = {};

  // 전체선택 체크박스 초기화
  document.getElementById("search-all-checkbox").checked = false;

  // 페이지에 있는 모든 체크박스 해제
  const allCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][name="search-checkbox"]'
  );
  allCheckboxes.forEach((checkbox) => {
    checkbox.checked = false; // 체크 해제
  });

  // 체크박스 상태 확인
  console.log("Checkbox states after reset:");
  allCheckboxes.forEach((checkbox) => {
    console.log(
      // `Checkbox ${checkbox.getAttribute("data-no")}: ${checkbox.checked}`
    );
  });

  // 모든 체크박스 상태 변경 후 선택된 항목의 개수 업데이트
  updateSelectedCount();

  // 현재 컨텍스트에 따른 초기화 동작
  if (currentPageContext === "all") {
    // 전체 데이터 초기화
    searchWithData({}).then(() => {
      // 필터링된 항목 선택 상태 초기화 및 체크박스 업데이트
      updateSelectedCount();
    });
    document.getElementById("stack-data-mng-head").classList.add("bold");
  } else if (currentPageContext === "bookmark") {
    // 북마크 내 데이터 초기화
    filterDataByBookmark(currentBookmarkId, 1, {});
    document
      .querySelector(`.tab-item a[data-bookmark-id="${currentBookmarkId}"]`)
      .classList.add("active");
  }

  // 버튼의 active 클래스 모두 제거 후, 필요한 요소에 active 클래스 추가
  document.querySelectorAll(".tag-selector.active").forEach((button) => {
    button.classList.remove("active");
  });

}

// 검색 버튼 클릭 이벤트 리스너
export function addSearchButtonListener() {
  document.querySelectorAll(".stk-sch-btn").forEach((button) => {
    button.addEventListener("click", function () {
      performSearch();
    });
  });
}

export function performSearch({ skipUrlUpdate = false } = {}) {
  // 검색 조건 수집 함수
  const getInputValue = (inputId) => {
    const inputElement = document.getElementById(inputId);
    if (!inputElement) {
      console.log(`Element not found for ID: ${inputId}`);
      return ""; // 빈 문자열 반환하거나, 적절한 기본값 설정
    }
    const value = inputElement.value.trim(); // 입력값에서 앞뒤 공백 제거
    if (value) {
      // 값이 있는 경우에만 로깅
      console.log(`입력 값 가져오기: ${inputId}`);
      console.log(`Value for ${inputId}: ${value}`);
    }
    return value;
  };

  // 날짜 범위 가져오기
  const { fromDate, toDate } = getSearchDateRange();

  // MySQL datetime 형식으로 변환
  const startDate = formatDateForSearch(fromDate);
  const endDate = formatDateForSearch(toDate);

  // 날짜 유효성 검사
  if (fromDate > toDate) {
    alert("시작 날짜가 종료 날짜보다 뒤에 있습니다.");
    return;
  }

  // Error Code select 값 가져오기
  const errorCode = document.getElementById('stack-error-codes-search').value;

  // 검색 조건 수집
  const labelOrBigoType = document.getElementById('label-or-bigo').value;
  const searchValue = getInputValue("input-label");

  const searchConditions = {
    "start-date": startDate,  
    "end-date": endDate,  
    hzFROM: {
      value: getInputValue("input-from"),
      condition: getSelectedCondition("a07"),
    },
    hzTO: {
      value: getInputValue("input-to"),
      condition: getSelectedCondition("a08"),
    },
    "M-L": {
      value: getInputValue("input-m-l"),
      condition: getSelectedCondition("a02"),
    },
    x1: {
      value: getInputValue("input-x1"),
      condition: getSelectedCondition("a03"),
    },
    x2: {
      value: getInputValue("input-x2"),
      condition: getSelectedCondition("a04"),
    },
    MERR: { 
      value: errorCode, 
      condition: "=" 
    }
  };

  // 검색어가 있을 경우에만 검색 타입에 따라 조건 추가
  if (searchValue) {
    searchConditions[labelOrBigoType] = { value: searchValue };
  }

  // 빈 값 필터링
  Object.keys(searchConditions).forEach((key) => {
    if (
      typeof searchConditions[key] === "object" &&
      searchConditions[key] !== null
    ) {
      if (!searchConditions[key].value) {
        delete searchConditions[key];
      }
    } else {
      if (!searchConditions[key]) {
        delete searchConditions[key];
      }
    }
  });

  console.log("검색 조건:", searchConditions);

  // 검색 조건을 sessionStorage에 저장
  sessionStorage.setItem('searchConditions', JSON.stringify(searchConditions));

  // URL을 업데이트하려면 skipUrlUpdate가 false여야 함
  if (!skipUrlUpdate) {
    // 검색 조건을 쿼리 문자열로 변환
    const queryString = new URLSearchParams(searchConditions).toString();

    // 현재 URL에 검색 조건 추가
    const newUrl = `${window.location.pathname}?${queryString}`;
  }

  // 서버에 검색 요청
  if (currentPageContext === "bookmark") {
    filterDataByBookmark(currentBookmarkId, 1, searchConditions).then(
      () => {
        initCheckboxStateAndSelectAll(true); 
        updateSelectedCount();
      }
    );
  } else {
    searchWithData(searchConditions).then(() => {
      initCheckboxStateAndSelectAll();
      if (isResetTriggered) {
        initCheckboxStateAndSelectAll(false);
        isResetTriggered = false;
      }
      updateSelectedCount();
    });
  }
}



// 선택된 조건을 반환하는 함수
function getSelectedCondition(name) {
  // merr를 건너뛰도록 조건 추가
  if (name === "a09") return ""; 

  const over = document.getElementById(`o${name.substring(1)}`)?.checked;
  const under = document.getElementById(`u${name.substring(1)}`)?.checked;

  return over ? "over" : under ? "under" : "";
}


//검색 필터된 데이터
// 서버에 검색 조건을 전송하고 결과를 받아 테이블에 표시하는 함수 (GET 요청 사용) / 퀴리 문자열 생성
// encodeURIComponent 함수 : URL에서 사용할 수 있도록 문자열 인코딩
function fetchData(conditions = {}, page = 1, bookmarkId = null, type) {
  return new Promise((resolve, reject) => {
    console.log("fetchData 상세 로그:");
    console.log("- conditions:", JSON.stringify(conditions, null, 2));
    console.log("- page:", page);
    console.log("- bookmarkId:", bookmarkId);
    console.log("- type:", type);

    // powerplant_id fuelcell_id는 conditions에 이미 포함되어 있으므로 별도로 추가할 필요 없음
    let query = Object.keys(conditions)
      .map((key) => {
        if (key === "powerplant_id" || key === "fuelcell_id") {
          return `${encodeURIComponent(key)}=${encodeURIComponent(conditions[key])}`;
        } else if (key === "LABEL" || key === "BIGO") {  // BIGO 추가
          return `${encodeURIComponent(key)}=${encodeURIComponent(conditions[key].value)}`;
        } else if (key === "start-date" || key === "end-date") {
          return `${encodeURIComponent(key)}=${encodeURIComponent(conditions[key])}`;
        } else {
          return `${encodeURIComponent(key)}=${encodeURIComponent(conditions[key].value)}&${encodeURIComponent(key + "Condition")}=${encodeURIComponent(conditions[key].condition)}`;
        }
      })
      .join("&");

    query += `&page=${page}&perPage=${itemsPerPage}`;
    query += `&type=${type}`;

    if (bookmarkId) {
      query += `&bookmarkId=${bookmarkId}`;
    }

    const url = `js/stack/stack_search.php?${query}`;
    console.log("요청 URL:", url);

     fetch(url)
      .then(async response => {
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server response:', errorText);
          try {
            const errorJson = JSON.parse(errorText);
            throw new Error(errorJson.message || `서버 오류: ${response.status}`);
          } catch (e) {
            throw new Error(`서버 오류: ${response.status}`);
          }
        }
        return response.json();
      })
      .then(response => {
        console.log("서버 응답:", response);
        if (Array.isArray(response.data)) {
          console.log("데이터 배열 길이:", response.data.length);
          displayResults(response.data, page, response.totalRows, type);
          displayPagination(response.totalRows, page);
          resolve(response);
        } else {
          throw new Error("Results is not an array");
        }
      })
      .catch(error => {
        console.error("Fetch error:", error);
        reject(error);
      });
  });
}

// searchWithData와 filterDataByBookmark 함수를 fetchData를 사용하도록 수정
export function searchWithData(conditions, page = 1, searchType=null, perPage = 100) {
  return new Promise((resolve, reject) => {
    try {
      currentPageContext = "search";
      currentSearchConditions = conditions;
      
      // URL 파라미터에서 값 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const urlPlant = urlParams.get('plant');
      const urlFuelcell = urlParams.get('fuelcell');
      
      // 수정: 현재 설정 가져오기 (이 부분에 오류가 있음)
      const currentConfig = getCurrentConfig();
      
      // 수정: 기본값 설정 및 undefined 처리
      const powerplant_id = (urlPlant && urlPlant !== 'undefined') ? urlPlant : 
                          (currentConfig && currentConfig.powerplant_id) ? currentConfig.powerplant_id : 'SE01';
      const fuelcell_id = (urlFuelcell && urlFuelcell !== 'undefined') ? urlFuelcell : 
                        (currentConfig && currentConfig.fuelcell_id) ? currentConfig.fuelcell_id : 'F001';
      
      console.log('수정된 발전소 ID:', powerplant_id);
      console.log('수정된 연료전지 ID:', fuelcell_id);

      // type이 명시적으로 전달되지 않은 경우 전역 변수 사용
      const typeToUse = searchType || type;

      // 검색 조건 파라미터 생성
      const searchParams = new URLSearchParams();
      
      // 기본 파라미터 추가
      searchParams.append('page', page);
      searchParams.append('perPage', perPage);  // 기본값 설정
      searchParams.append('type', typeToUse);
      searchParams.append('powerplant_id', powerplant_id);
      searchParams.append('fuelcell_id', fuelcell_id);
      
      // 날짜 파라미터 추가
      if (conditions['start-date']) {
        searchParams.append('start-date', conditions['start-date']);
      }
      if (conditions['end-date']) {
        searchParams.append('end-date', conditions['end-date']);
      }
      
      // MERR 파라미터 특별 처리
      if (conditions.MERR && conditions.MERR.value) {
        searchParams.append('MERR', conditions.MERR.value);
      }
      
      // 기타 조건 파라미터 추가
      for (const [key, value] of Object.entries(conditions)) {
        if (key !== 'start-date' && key !== 'end-date' && key !== 'MERR') {
          if (typeof value === 'object' && value !== null && 'value' in value && value.value !== '') {
            searchParams.append(key, value.value);
            if (value.condition) {
              searchParams.append(`${key}Condition`, value.condition);
            }
          }
        }
      }
      
      // 요청 URL 생성
      const url = `js/stack/stack_search.php?${searchParams.toString()}`;
      console.log('수정된 요청 URL:', url);
      
      // 수정: fetchData 대신 직접 fetch 호출
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('서버 응답:', data);
          
          // 데이터 처리 로직
          displayResults(data.data, page, data.totalRows, typeToUse);
          displayPagination(data.totalRows, page);
          // 진단 로그 추가
          loadAndDisplayDiagnosisData(1); 

          // 검색이 완료된 후 체크박스 선택
          updateCheckboxesAfterSearch();
          resolve(); // 성공적으로 완료되면 resolve
        })
        .catch(error => {
          console.error('데이터 가져오기 오류:', error);
          reject(error);
        });

    } catch (error) {
      console.error('searchWithData 실행 중 오류:', error);
      reject(error);
    }
  });
}

// filterDataByBookmark 함수
export function filterDataByBookmark(bookmarkId, page = 1, searchConditions = {}) {
  return new Promise((resolve, reject) => {
    try {
      console.log('북마크 필터링 시작:', bookmarkId);
      
      // 북마크 ID 유효성 확인
      if (!bookmarkId) {
        console.error('유효하지 않은 북마크 ID:', bookmarkId);
        reject(new Error('유효하지 않은 북마크 ID'));
        return;
      }
      
      // URL 파라미터에서 값 가져오기
      const urlParams = new URLSearchParams(window.location.search);
      const urlPlant = urlParams.get('plant');
      const urlFuelcell = urlParams.get('fuelcell');
      
      // 현재 설정 가져오기
      const currentConfig = getCurrentConfig();
      
      // 기본값 설정 및 undefined 처리
      const powerplant_id = (urlPlant && urlPlant !== 'undefined') ? urlPlant : 
                          (currentConfig && currentConfig.powerplant_id) ? currentConfig.powerplant_id : 'SE01';
      const fuelcell_id = (urlFuelcell && urlFuelcell !== 'undefined') ? urlFuelcell : 
                        (currentConfig && currentConfig.fuelcell_id) ? currentConfig.fuelcell_id : 'F001';
      
      console.log('북마크 필터링 - 발전소 ID:', powerplant_id);
      console.log('북마크 필터링 - 연료전지 ID:', fuelcell_id);
      
      // 검색 조건 파라미터 생성
      const searchParams = new URLSearchParams();
      
      // 기본 파라미터 추가
      searchParams.append('bookmarkId', bookmarkId);
      searchParams.append('page', page);
      searchParams.append('perPage', 100);
      searchParams.append('type', type);
      searchParams.append('powerplant_id', powerplant_id);
      searchParams.append('fuelcell_id', fuelcell_id);
      
      // 요청 URL 생성
      const url = `js/stack/stack_search.php?${searchParams.toString()}`;
      console.log('북마크 필터링 URL:', url);
      
      // 데이터 요청
      fetch(url)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json().catch(err => {
            console.error('JSON 파싱 오류:', err);
            throw new Error('서버 응답을 처리할 수 없습니다.');
          });
        })
        .then(data => {
          console.log('북마크 데이터 응답:', data);
          
          // 데이터 처리 로직
          displayResults(data.data, page, data.totalRows, type);
          displayPagination(data.totalRows, page, bookmarkId);
          // 진단 로그 추가
          loadAndDisplayDiagnosisData(1);
          
          // 검색이 완료된 후 체크박스 선택
          updateCheckboxesAfterSearch();
          
          // 북마크 탭 활성화
          const bookmarkTab = document.querySelector(`a[data-bookmark-id="${bookmarkId}"]`);
          if (bookmarkTab) {
            document.querySelectorAll('.tab-item a').forEach(tab => {
              tab.classList.remove('active');
            });
            bookmarkTab.classList.add('active');
          }
          
          resolve();
        })
        .catch(error => {
          console.error('북마크 데이터 가져오기 오류:', error);
          alert('북마크 데이터를 불러오는 중 오류가 발생했습니다.');
          reject(error);
        });
    } catch (error) {
      console.error('filterDataByBookmark 실행 중 오류:', error);
      reject(error);
    }
  });
}
/////////////////////////////////////////////////////////////////////////////////////
// 라벨 기본 이름을 추출
function extractBaseLabel(label) {
  return label.replace(/\s+\d+$/, ''); // 뒤에 붙은 번호는 제거하고 라벨명만 추출
}

// 비활성화된 시리즈의 라벨을 수집
function getDisabledLabels(uplot) {
  const disabled = new Set();
  if (uplot && uplot.series) {
    uplot.series.forEach((s, i) => {
      if (s.label && s.show === false) {
        disabled.add(extractBaseLabel(s.label));
      }
    });
  }
  return disabled;
}

// 비활성화 된 라벨 다시 비활성화
function applyDisabledLabels(uplot, disabledLabels) {
  if (!uplot || !uplot.series) return;
  uplot.series.forEach((s, i) => {
    if (s.label && disabledLabels.has(extractBaseLabel(s.label))) {
      uplot.setSeries(i, { show: false });
    }
  });
}

// 선택한 두 시작점을 기준으로 데이터를 정렬해 모달에 비교 그래프 표시
function showModalWithGraph(startPoints, endPoints, uplot) {
  const modal = document.getElementById("dataModal");
  const graphContainer = document.getElementById("modalGraph");
  modal.style.display = "block";
  graphContainer.innerHTML = "";

  if (startPoints.length === 2 && (!endPoints || endPoints.length === 0)) {
    const [pt1, pt2] = startPoints;

    // 각 시작점이 어떤 차트에 속하는지 인덱스를 찾음
    const seriesIdx1 = uplot.series.findIndex(s => s.label === pt1.label);
    const seriesIdx2 = uplot.series.findIndex(s => s.label === pt2.label);

    if (seriesIdx1 === -1 || seriesIdx2 === -1) {
      console.error("Series label not found.");
      return;
    }

    const xData = uplot.data[0];  // 공통 x축 데이터
    const yData1 = uplot.data[seriesIdx1];
    const yData2 = uplot.data[seriesIdx2];

    const startIdx1 = xData.findIndex(x => x >= pt1.x);
    const startIdx2 = xData.findIndex(x => x >= pt2.x);

    // 최소 길이만큼만 잘라냄
    const maxLen = Math.min(xData.length - startIdx1, xData.length - startIdx2);

    const commonX = xData.slice(startIdx1, startIdx1 + maxLen);
    const y1 = yData1.slice(startIdx1, startIdx1 + maxLen);
    const y2 = yData2.slice(startIdx2, startIdx2 + maxLen);

    // pt2의 y 차트를 pt1에 맞춰 y축 이동
    const y2Shifted = y2.map(y => y + (pt1.y - pt2.y));

    // 동적으로 y축 레이블 설정
    const yAxisLabel = extractBaseLabel(pt1.label || "Voltage");
    new uPlot({
      title: "시작점 기준 비교 (공통 x축)",
      width: 800,
      height: 600,
      series: [
        { label: "Time" },
        { label: pt1.label, stroke: "red", width: 2 },
        { label: pt2.label, stroke: "blue", width: 2 },
      ],
      scales: { x: { time: false } },
      axes: [
        { label: "Time", scale: "x", values: (u, ticks) => ticks.map(v => v.toFixed(3)) },
        { label: yAxisLabel },
      ]
    }, [commonX, y1, y2Shifted], graphContainer);
  }
  document.getElementById("closeModalBtn").onclick = () => {
    modal.style.display = "none";
    graphContainer.innerHTML = "";
  };
}

function getClickPosition(e, uplot) {
  const rect = uplot.root.querySelector(".u-over").getBoundingClientRect();
  const xPos = e.clientX - rect.left;
  const yPos = e.clientY - rect.top;
  const xVal = uplot.posToVal(xPos, "x");
  return { xVal, yPos };
}

// 마우스 클릭한 위치의 x값을 찾는 함수
function findClosestXIdx(xVal, dataX) {
  let closestIdx = 0;
  let minDiff = Infinity;
  for (let i = 0; i < dataX.length; i++) {
    const diff = Math.abs(dataX[i] - xVal);
    if (diff < minDiff) {
      minDiff = diff;
      closestIdx = i;
    }
  }
  return closestIdx;
}

// 마우스 클릭한 위치 가장 가까운 시리즈(그래프)를 찾는 함수
function findClosestSeries(uplot, closestIdx, yPos) {
  let selectedSeries = null;
  let closestYValDiff = Infinity;
  for (let i = 1; i < uplot.data.length; i++) {
    const seriesOpts = uplot.series[i];
    if (!seriesOpts.show) continue;
    const yVal = uplot.data[i][closestIdx];
    if (yVal == null) continue;
    const scaleKey = uplot.series[i].scale || "A";
    const yPix = uplot.valToPos(yVal, scaleKey);
    const yDiff = Math.abs(yPix - yPos);
    if (yDiff < closestYValDiff) {
      closestYValDiff = yDiff;
      selectedSeries = i;
    }
  }
  return selectedSeries;
}

const state = {
  selecting: false,
  startPoints: [],
};

document.getElementById("rangeSelectBtn").addEventListener("click", () => {
  state.selecting = true;
  state.startPoints = [];
  alert("시작점 2개를 선택하세요.");
});


// Overlay 메인 클릭 이벤트 핸들러
function overlayClick(e, uplot, state) {
  if (!state.selecting) return;

  const { xVal, yPos } = getClickPosition(e, uplot);
  const closestIdx = findClosestXIdx(xVal, uplot.data[0]);
  const selectedSeries = findClosestSeries(uplot, closestIdx, yPos);

  if (selectedSeries !== null) {
    const actualX = uplot.data[0][closestIdx];
    const actualY = uplot.data[selectedSeries][closestIdx];
    const label = uplot.series[selectedSeries].label;

    const point = { x: actualX, y: actualY, label, idx: closestIdx };
    state.startPoints.push(point);

    if (state.startPoints.length === 2) {
      state.selecting = false;
      showModalWithGraph(state.startPoints, [], uplot);
      state.startPoints = [];
    }
  }
}

async function pulseDateCellClick(dateCell, type, state) {
  const no = dateCell.getAttribute('data-no');
  console.log('Clicked cell NO:', no);

  if (type === 'PULSE' || type === 'NPULSE') {
    const row = dateCell.closest('tr');
    const checkbox = row.querySelector('input[type="checkbox"][name="search-checkbox"]');
    const graphBtn = document.getElementById('graph-btn');

    if (checkbox && graphBtn) {
      const isCurrentlyChecked = checkbox.checked;
      checkbox.checked = !isCurrentlyChecked;

      if (!isCurrentlyChecked) {
        updateSelectedCount();
      } else {
        try {
          const response = await fetch(`js/stack/get_pulse_name.php?no=${no}&type=${type}`);
          const data = await response.json();
      
          if (data.name) {
            // 세션스토리지에서 선택 목록 불러오기
            const savedStr = sessionStorage.getItem('selectedFullpaths');
            let saved = savedStr ? JSON.parse(savedStr) : [];
            // 선택 목록에서 현재 해제된 fullpath 제거
            saved = saved.filter(path => path !== data.name);
            sessionStorage.setItem('selectedFullpaths', JSON.stringify(saved));
          }
      
          const checkedBoxes = document.querySelectorAll(
            'input[type="checkbox"][name="search-checkbox"]:checked'
          );
          if (checkedBoxes.length > 0) {
            graphBtn.click();
          }
          updateSelectedCount();
        } catch (error) {
          console.error('체크박스 해제 중 오류:', error);
          checkbox.checked = true;
        }
      }      
    }
    try {
      const selectedItems = Array.from(document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked')).map(cb => {
        return {
          no: cb.getAttribute('data-no'),
          type: cb.getAttribute('data-type')
        };
      });

      const fullpaths = [];
      for (const checkedItem of selectedItems) {
        const response = await fetch(`js/stack/get_pulse_name.php?no=${checkedItem.no}&type=${checkedItem.type}`);
        const data = await response.json();
        if (data.name) fullpaths.push(data.name);
      }

      if (fullpaths.length > 0) {
        const graphElement = document.querySelector("pulse-graph-in-stack");
        const viewMode = document.querySelector('input[name="viewMode"]:checked')?.value || "single";
        if (graphElement) {
          graphElement.setViewMode(viewMode);
          if (viewMode === "single") {
            document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked')
              .forEach(cb => {
                if (cb !== checkbox) cb.checked = false;
              });
            checkbox.checked = true;
            updateSelectedCount();
            const response = await fetch(
              `js/stack/get_pulse_name.php?no=${checkbox.dataset.no}&type=${checkbox.dataset.type}`
            );
            const data = await response.json();
            if (data.name) {
              graphElement.fullpaths = [data.name];
              graphElement.destroyPlot();
              graphElement.init_DOM();
              await graphElement.init_data();
            }
            selectedItems = [];
          } else if (viewMode === "timeseries") {
            // 기존 저장 불러오기
            const savedStr = sessionStorage.getItem('selectedFullpaths');
            const saved = savedStr ? JSON.parse(savedStr) : [];

            // 합치기 및 정렬
            const mergedFullpaths = [...new Set([...saved, ...fullpaths])];
            mergedFullpaths.sort((a, b) => {
              const extract = str => str.match(/d(\d{4}-\d{2}-\d{2}-\d{2}-\d{2}-\d{2})/)?.[1] || "";
              return new Date(extract(a).replace(/-/g, ':').replace(':', '-', 2)) - 
                     new Date(extract(b).replace(/-/g, ':').replace(':', '-', 2));
            });
            const disabledLabels = graphElement.uplot ? getDisabledLabels(graphElement.uplot) : new Set();
            graphElement.fullpaths = mergedFullpaths;
            sessionStorage.setItem('selectedFullpaths', JSON.stringify(mergedFullpaths));
            graphElement.destroyPlot();
            graphElement.init_DOM();
            await graphElement.init_data();
            requestAnimationFrame(() => {
              applyDisabledLabels(graphElement.uplot, disabledLabels);
            });

          } else if (viewMode === "overlay") {
            const savedStr = sessionStorage.getItem('selectedFullpaths');
            const saved = savedStr ? JSON.parse(savedStr) : [];
            const mergedFullpaths = [...new Set([...saved, ...fullpaths])];
            const disabledLabels = graphElement.uplot ? getDisabledLabels(graphElement.uplot) : new Set();

            graphElement.fullpaths = mergedFullpaths;
            sessionStorage.setItem('selectedFullpaths', JSON.stringify(mergedFullpaths));
            graphElement.destroyPlot();
            graphElement.init_DOM();
            await graphElement.init_data();
            requestAnimationFrame(() => {
              applyDisabledLabels(graphElement.uplot, disabledLabels);
            });

            const uplot = graphElement.uplot;
            if (uplot && uplot.root) {
              const overlay = uplot.root.querySelector(".u-over");
              if (overlay) {
                overlay.addEventListener("click", (e) => overlayClick(e, uplot, state));
              } else {
                console.warn("uPlot 내부에 overlay 요소를 찾을 수 없습니다.");
              }
            }
          }
        } else {
          console.error("pulse-graph-in-stack 요소를 찾을 수 없습니다.");
        }
      }
    } catch (error) {
      console.error('Error:', error);
      console.warn('그래프 데이터를 불러오는 중 오류 발생');
    }
  }
}


// 소수점 2자리까지 보여주기 위한 함수
function formatNumber(val) {
  return val != null ? parseFloat(val).toFixed(2) : ""; // null 처리 포함
}

// 북마크 아닌 전체 데이터에서 결과를 표시하는 함수
export function displayResults(results, currentPage, totalRows, type) {
  
  const tbody = document.querySelector("#stack_search_table");
  tbody.innerHTML = "";

  if (Array.isArray(results)) {
    results.forEach((row) => {
      // console.log("value:", row);
      // console.log('MERR before formatting:', row.MERR);
      // console.log('Formatted MERR:', formatErrorCode(row.MERR));

      const tr = document.createElement("tr");
      tr.setAttribute("data-page", currentPage);

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.name = "search-checkbox";
      checkbox.setAttribute("data-no", row.NO);
      checkbox.setAttribute("data-err", row.MERR);
      checkbox.checked = checkedItems.has(row.NO); 


      const tdCheckbox = document.createElement("td");
      tdCheckbox.appendChild(checkbox);
      tr.appendChild(tdCheckbox);

      // #stack_search_table 동적으로 변경
      if (type === 'SIN') {
        tr.innerHTML += `
          <td class="date-cell" data-no="${row.NO}" data-err="${formatErrorCode(row.MERR)}" style="cursor: pointer">${row.DATE || ""}</td>
          <td>${row.hzFROM || ""}</td>
          <td>${row.hzTO || ""}</td>
          <td>${row["M-L"] || ""}</td>
          <td>${row.x1 || ""}</td>
          <td class="merr-cell" title="${formatErrorCode(row.MERR) || ""}">${formatErrorCode(row.MERR) || ""}</td>
          <td class="bigo-cell" data-no="${row.NO}" title="${row.LABEL || ''}">${row.BIGO || ''}</td>
        `;
      } else if (type === 'PULSE') {
        tr.innerHTML += `
          <td class="date-cell" data-no="${row.NO}" data-err="${row.MERR || ''}" style="cursor: pointer">${row.DATE || ""}</td>
          <td>${row.hzFROM || ""}</td>
          <td>${row.hzTO || ""}</td>
          <td>${formatNumber(row.RISE)}</td>
          <td>${formatNumber(row.APEX)}</td>
          <td>${formatNumber(row.DIFF)}</td>
          <td>${formatNumber(row.DEG)}</td>
          <td>${formatNumber(row.RATE)}</td>
          <td class="merr-cell" title="${formatErrorCode(row.MERR) || ""}">${formatErrorCode(row.MERR) || ""}</td>
          <td class="bigo-cell" data-no="${row.NO}" title="${row.LABEL || ''}">${row.BIGO || ''}</td>
        `;
      } else if (type === 'NPULSE') {
        tr.innerHTML += `
          <td class="date-cell" data-no="${row.NO}" data-err="${row.MERR || ''}" style="cursor: pointer">${row.DATE || ""}</td>
          <td>${row.hzFROM || ""}</td>
          <td>${row.hzTO || ""}</td>
          <td>${formatNumber(row.RISE)}</td>
          <td>${formatNumber(row.APEX)}</td>
          <td>${formatNumber(row.DIFF)}</td>
          <td>${formatNumber(row.DEG)}</td>
          <td>${formatNumber(row.RATE)}</td>
           <td class="merr-cell" title="${formatErrorCode(row.MERR) || ""}">${formatErrorCode(row.MERR) || ""}</td>
          <td class="bigo-cell" data-no="${row.NO}" title="${row.LABEL || ''}">${row.BIGO || ''}</td>
        `;
      } else if (type === 'CALIB') {
        tr.innerHTML += `
          <td class="date-cell" data-no="${row.NO}" data-err="${formatErrorCode(row.MERR)}" style="cursor: pointer">${row.DATE || ""}</td>
          <td>${row.hzFROM || ""}</td>
          <td>${row.hzTO || ""}</td>
          <td>${row["M-L"] || ""}</td>
          <td>${row.x1 || ""}</td>
          <td class="merr-cell" title="${formatErrorCode(row.MERR) || ""}">${formatErrorCode(row.MERR) || ""}</td>
          <td class="bigo-cell" data-no="${row.NO}" title="${row.LABEL || ''}">${row.BIGO || ''}</td>
        `;
      }

      // date-cell 클릭 이벤트 추가
      const dateCell = tr.querySelector('.date-cell');
      dateCell.addEventListener('click', () => pulseDateCellClick(dateCell, type, state));

      // MERR 셀에 더블클릭 이벤트 추가 (SIN, PULSE 모두 적용)
      const merrCell = tr.querySelector('.merr-cell');
      merrCell.addEventListener('dblclick', function() {
        const currentValue = this.textContent.split('.')[0];
        createErrorCodeSelect(this, currentValue);
      });

      // BIGO 필드 더블 클릭 이벤트 리스너 추가
      tr.querySelectorAll('.bigo-cell').forEach(cell => {
        cell.addEventListener('dblclick', function () {
            const currentText = this.textContent;
            console.log('Current BIGO text:', currentText); // 현재 BIGO 텍스트 로그

            const input = document.createElement('input');
            input.type = 'text';
            input.value = currentText;
            input.style.width = '100%';
    
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const newValue = input.value;
                    this.textContent = newValue;
                    const no = this.getAttribute('data-no'); // BIGO 셀의 data-no 속성에서 no 값을 가져옴
                    console.log('Updating BIGO for NO:', no, 'with new value:', newValue); // 업데이트할 NO와 BIGO 값 로그

                    updateBigoInDatabase(no, newValue);
                }
            });
            this.textContent = '';
            this.appendChild(input);
            input.focus();
        });
      });
      tbody.appendChild(tr);
    });
  }

  // 항목갯수 동적으로 변경
  const countSelectedDiv = document.getElementById("count-selected");
  if (countSelectedDiv) {
    if (type === 'SIN') {
      countSelectedDiv.textContent = `SIN | ${totalRows}`;
    } else if (type === 'PULSE') {
      countSelectedDiv.textContent = `PULSE | ${totalRows}`;
    } else if (type === 'NPULSE') {
      countSelectedDiv.textContent = `NPULSE | ${totalRows}`;
    } else if (type === 'CALIB') {
      countSelectedDiv.textContent = `CALIB | ${totalRows}`;
    }
  }

  // 결과 표시 후 체크박스 상태 업데이트
  updateCheckboxesAfterSearch();
}
  
/////////////////////////////////////////////////////////////////////////////
// 에러코드 표에서 더블 클릭해서 드롭다운으로 수정 가능하게
// td를 더블클릭했을 때 select로 변경하는 함수
function createErrorCodeSelect(td, currentValue) {
  const select = document.createElement('select');
  select.name = 'stack-error-codes-edit';
  select.id = 'stack-error-codes-edit';
  
  // 스타일 추가
  select.style.width = '100%';
  select.style.boxSizing = 'border-box';
  select.style.padding = '2px';
  select.style.fontSize = '12px';
  
  // 기본 옵션 추가
  const defaultOption = document.createElement('option');
  defaultOption.value = '';
  defaultOption.textContent = '= Select Error Code =';
  select.appendChild(defaultOption);
  
  // errorCodeMapping을 사용하여 옵션 생성
  Object.entries(errorCodeMapping).forEach(([code, name]) => {
      const option = document.createElement('option');
      option.value = code;
      option.textContent = `${code}. ${name}`;
      select.appendChild(option);
  });

  // 현재 MERR 값과 일치하는 option 선택
  select.value = currentValue;

  // select 변경 시 이벤트
  select.addEventListener('change', async function() {
      const newValue = this.value;
      const oldValue = currentValue;
      
      // 변경 확인 메시지
      const oldText = errorCodeMapping[oldValue] ? `${oldValue}. ${errorCodeMapping[oldValue]}` : oldValue;
      const newText = errorCodeMapping[newValue] ? `${newValue}. ${errorCodeMapping[newValue]}` : newValue;
      
      const isConfirmed = confirm(
          `에러 코드를 변경하시겠습니까?\n\n` +
          `현재: ${oldText}\n` +
          `변경: ${newText}`
      );

      if (isConfirmed) {
          try {
              const row = td.closest('tr');
              const no = row.querySelector('.date-cell').getAttribute('data-no');
              
              const response = await fetch('js/stack/update_error_code.php', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                      no: no,
                      merr: newValue
                  })
              });

              const result = await response.json();
              if (!result.success) {
                  throw new Error(result.message);
              }

              // 성공 메시지
              alert('에러 코드가 성공적으로 변경되었습니다.');
              
          } catch (error) {
              console.error('Error updating error code:', error);
              alert('에러 코드 업데이트 실패');
              this.value = oldValue;  // 실패시 원래 값으로 복구
          } finally {
              // select를 다시 td로 변경
              td.textContent = formatErrorCode(this.value) || "";
              td.title = formatErrorCode(this.value) || "";
          }
      } else {
          // 취소시 원래 값으로 복구
          this.value = oldValue;
          td.textContent = formatErrorCode(oldValue) || "";
          td.title = formatErrorCode(oldValue) || "";
      }
  });

  // td의 내용을 select로 교체
  td.textContent = '';
  td.appendChild(select);
  select.focus();

  // 외부 클릭 시 select 제거
  document.addEventListener('click', function closeSelect(e) {
      if (!select.contains(e.target)) {
          td.textContent = formatErrorCode(select.value) || "";
          td.title = formatErrorCode(select.value) || "";
          document.removeEventListener('click', closeSelect);
      }
  });
}


//////////////////////////////////////////////////////////////////////////////////////////
// BIGO 필드 업데이트 함수
function updateBigoInDatabase(no, newValue) {
  console.log('Sending update request for NO:', no, 'with BIGO:', newValue); // 요청 전송 로그

  fetch('js/stack/update_bigo.php', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({ no, bigo: newValue }),
  })
  .then(response => {
      console.log('Response status:', response.status); // 응답 상태 로그
      return response.json();
  })
  .then(data => {
      console.log('Response data:', data); // 응답 데이터 로그
      if (data.success) {
          console.log('BIGO updated successfully');
      } else {
          console.error('Failed to update BIGO:', data.error);
      }
  })
  .catch(error => {
      console.error('Error updating BIGO:', error);
  });
}


// 에러 코드 포맷팅 함수
export function formatErrorCode(errCode) {
  if (!errCode) return "";
  const errorName = errorCodeMapping[errCode];
  return errorName ? `${errCode}. ${errorName}` : errCode;
}


// 검색 후 체크박스 상태를 업데이트하는 함수
function updateCheckboxesAfterSearch() {
  const labelInput = document.getElementById('input-label');
  const hasActiveSearch = labelInput.value.trim() !== '';

  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = hasActiveSearch;
  });

  if (hasActiveSearch) {
    updateSelectedCount();
    updateSelectAllCheckboxState();
  }
}



////////////////////////////////////////////////////////////////////////////////////////
// 체크박스 함수들

// 체크박스 초기화 상태를 설정하는 함수 내보내기
export function setInitializingCheckboxes(value) {
  isInitializingCheckboxes = value;
}

// 체크박스 초기화 및 자동 선택 함수 추가
export function initCheckboxStateAndSelectAll(shouldCheckAll = false) {
  if (!window.isFuelcellConfigLoaded) {
    console.log('연료전지 설정이 아직 로드되지 않았습니다.');
    document.addEventListener('fuelcellConfigLoaded', () => {
      initCheckboxStateAndSelectAll(shouldCheckAll);
    }, { once: true });
    return;
  }

  console.log(`체크박스 초기화 중. shouldCheckAll: ${shouldCheckAll}`);

  // 모든 체크박스 선택
  const checkboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]');
  checkboxes.forEach((checkbox) => {
    checkbox.checked = shouldCheckAll; // shouldCheckAll 값에 따라 체크 상태 설정
  });

  // 전체 선택 체크박스 상태 업데이트
  const selectAllCheckbox = document.getElementById("search-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = shouldCheckAll;

    selectAllCheckbox.onclick = function() {
      const shouldCheckAll = selectAllCheckbox.checked;
      const checkboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]');
      checkboxes.forEach(checkbox => {
        checkbox.checked = shouldCheckAll;
      });
      updateSelectedCount();
    };
  }

  // 체크박스 상태 업데이트
  updateSelectAllCheckboxState();
  updateSelectedCount();

  console.log('체크박스 초기화 완료:', {
    totalCheckboxes: checkboxes.length,
    shouldCheckAll: shouldCheckAll
  });
}

// 전체 체크박스의 상태 업데이트 하는 함수
function updateSelectAllCheckboxState() {
  const allCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][name="search-checkbox"]:not([disabled])'
  );
  const checkedCheckboxes = document.querySelectorAll(
    'input[type="checkbox"][name="search-checkbox"]:checked:not([disabled])'
  );

  const selectAllCheckbox = document.getElementById("search-all-checkbox");
  if (selectAllCheckbox) {
    if (allCheckboxes.length === checkedCheckboxes.length) {
      selectAllCheckbox.checked = true;
      selectAllCheckbox.indeterminate = false;
    } else if (checkedCheckboxes.length > 0) {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = true;
    } else {
      selectAllCheckbox.checked = false;
      selectAllCheckbox.indeterminate = false;
    }
  }
}


// 체크박스가 변경될 때마다 선택된 항목의 개수를 업데이트하고, 모든 체크박스가 선택되었는지 확인하여 전체 선택 체크박스의 상태를 업데이트하는 함수
export function updateSelectedCount() {
  const allCheckboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]');
  const checkedCheckboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]:checked');

  console.log("updateSelectedCount 호출됨 - 전체 체크박스 수:", allCheckboxes.length, "선택된 체크박스 수:", checkedCheckboxes.length);

  const countSpan = document.getElementById("count-checked");
  if (countSpan) {
    countSpan.textContent = `Selected : ${checkedCheckboxes.length}`;
  }

  const selectAllCheckbox = document.getElementById("search-all-checkbox");
  if (selectAllCheckbox) {
    selectAllCheckbox.checked = allCheckboxes.length === checkedCheckboxes.length;
  }

  checkedItems = new Set();
  checkedCheckboxes.forEach((checkbox) => {
    checkedItems.add(checkbox.getAttribute('data-no'));
  });
}

// 전체 선택 체크박스의 변경 이벤트 처리. 전체 선택/해제 로직만 수행
export function handleSelectAllChange(event) {
  console.log("전체 선택 체크박스 변경됨");
  const isChecked = event.target.checked;
  
  const tableCheckboxes = document.querySelectorAll('#stack_search_table input[type="checkbox"][name="search-checkbox"]');
  console.log(`찾은 체크박스 수: ${tableCheckboxes.length}`);

  tableCheckboxes.forEach((checkbox) => {
    checkbox.checked = isChecked;
    if (isChecked) {
      checkedItems.add(checkbox.getAttribute('data-no'));
    } else {
      checkedItems.delete(checkbox.getAttribute('data-no'));
    }
  });

  updateSelectedCount();
  updateSelectAllCheckboxState();
}

// 페이지 로드 또는 페이지 변경 시 호출될 함수
function setupSelectAllCheckbox() {
  const selectAllCheckbox = document.getElementById("search-all-checkbox");
  if (selectAllCheckbox) {
    // 전체 선택 체크박스 이벤트 리스너
    selectAllCheckbox.removeEventListener("change", handleSelectAllChange);
    selectAllCheckbox.addEventListener("change", handleSelectAllChange);
  }

  // 테이블 내 체크박스들에 대한 이벤트 리스너
  const tableBody = document.getElementById('stack_search_table');
  if(tableBody){
    // 이벤트 위임 사용하여 체크박스 이벤트 처리
    tableBody.addEventListener('change', (event) =>{
      if(event.target.type === 'checkbox' && event.target.name === 'search-checkbox'){
        updateSelectedCount();
        updateSelectAllCheckboxState();
      }
    });
  }
}

//////////////////////////////////////////////////////////////////////////////
// 페이지네이션
export function displayPagination(totalRows, currentPage, bookmarkId = null) {
  const totalPages = Math.ceil(totalRows / itemsPerPage);
  const paginationContainer = document.getElementById(
    "stack-search-pagination"
  );
  paginationContainer.innerHTML = ""; // 기존 페이지네이션 초기화

  const maxPageVisible = 10; // 한 번에 표시할 최대 페이지 수
  let startPage = Math.max(currentPage - Math.floor(maxPageVisible / 2), 1);
  let endPage = Math.min(startPage + maxPageVisible - 1, totalPages);

  if (endPage - startPage + 1 < maxPageVisible) {
    startPage = Math.max(endPage - maxPageVisible + 1, 1);
  }

  // 항상 '<<' 버튼을 표시하되, 첫 페이지인 경우 비활성화합니다.
  paginationContainer.appendChild(
    createPageItem(1, "<<", currentPage > 1, bookmarkId)
  );

  // 항상 '<' 버튼을 표시하되, 첫 페이지인 경우 비활성화합니다.
  paginationContainer.appendChild(
    createPageItem(
      Math.max(1, currentPage - 1),
      "<",
      currentPage > 1,
      bookmarkId
    )
  );

  for (let i = startPage; i <= endPage; i++) {
    paginationContainer.appendChild(
      createPageItem(i, i.toString(), currentPage !== i, bookmarkId)
    );
  }

  // 항상 '>' 버튼을 표시하되, 마지막 페이지인 경우 비활성화합니다.
  paginationContainer.appendChild(
    createPageItem(
      Math.min(totalPages, currentPage + 1),
      ">",
      currentPage < totalPages,
      bookmarkId
    )
  );

  // 항상 '>>' 버튼을 표시하되, 마지막 페이지인 경우 비활성화합니다.
  paginationContainer.appendChild(
    createPageItem(totalPages, ">>", currentPage < totalPages, bookmarkId)
  );
}

function createPageItem(pageNumber, text, clickable, bookmarkId = null) {
  const pageItem = document.createElement("li");
  pageItem.classList.add("page-item"); // 모든 페이지 아이템에 'page-item' 클래스 추가

  const pageLink = document.createElement("a");
  pageLink.classList.add("page-link"); // 모든 페이지 링크에 'page-link' 클래스 추가
  pageLink.textContent = text;
  pageLink.href = "#"; // 클릭 이벤트를 처리하고 기본 동작을 방지하기 위해 링크 해시 설정

  if (clickable) {
    pageLink.addEventListener("click", function (event) {
      event.preventDefault();
      goToPage(pageNumber, bookmarkId); // 페이지 이동 함수 호출
    });
  } else {
    pageItem.classList.add("disabled"); // 클릭할 수 없는 페이지 아이템에 'disabled' 클래스 추가
  }

  if (typeof pageNumber === "number" && pageNumber === currentPage) {
    pageItem.classList.add("pagination-active"); // 현재 페이지에 대한 스타일 적용
  }

  pageItem.appendChild(pageLink);
  return pageItem;
}

// 페이지 이동 함수
export function goToPage(pageNumber, bookmarkId = null) {
  console.log(`goToPage 호출됨 - 페이지 번호: ${pageNumber}, 북마크 ID: ${bookmarkId}`);
  currentPage = pageNumber;

  const params = new URLSearchParams({
    page: currentPage,
    perPage: itemsPerPage,
  });

  const resolvedPerPage = itemsPerPage === "all-data" ? 999999 : itemsPerPage;

  if (currentPageContext === "all") {
    searchWithData(currentSearchConditions, pageNumber, null, resolvedPerPage).then(() => {
      console.log("searchWithData 완료 - all");
      initCheckboxStateAndSelectAll(false);
      updateSelectedCount();
    });
  } else if (currentPageContext === "search") {
    searchWithData(currentSearchConditions, pageNumber, null, resolvedPerPage).then(() => {
      console.log("searchWithData 완료 - search");
      initCheckboxStateAndSelectAll(false);
      updateSelectedCount();
    });
  } else if (currentPageContext === "bookmark") {
    filterDataByBookmark(bookmarkId || currentBookmarkId, pageNumber, currentSearchConditions, resolvedPerPage).then(() => {
      console.log("filterDataByBookmark 완료");
      initCheckboxStateAndSelectAll(false);
      updateSelectedCount();
    });
  }
}

/////////////////////////////////////////////////////////////////////////////////////////////
// 북마크 탭관리
// 서버에서 북마크 목록을 가져와서 목록 표시(왼쪽 상단 +인 '탭 관리' 버튼)
async function getTabList() {
  try {
    console.log('북마크 목록 가져오기 시작');

    const currentConfig = await getCurrentConfig();
    const { powerplant_id, fuelcell_id, group_id } = currentConfig;

    console.log('북마크 목록 가져오기 - 발전소 ID:', powerplant_id);
    console.log('북마크 목록 가져오기 - 그룹 ID:', group_id);
    console.log('북마크 목록 가져오기 - 연료전지 ID:', fuelcell_id);

    const tabListTable = document.querySelector('.table.tab-list tbody');
    if (!tabListTable) {
      console.error('북마크 목록 테이블을 찾을 수 없습니다.');
      return;
    }

    const url = `js/stack/get_bookmark.php?plant=${powerplant_id}&fuelcell=${fuelcell_id}&group=${group_id}`;

    const response = await fetch(url);
    const bookmarks = await response.json();

    console.log('북마크 목록 응답:', bookmarks);

    if (bookmarks.length === 0) {
      tabListTable.innerHTML = '<tr><td colspan="2">등록된 북마크가 없습니다.</td></tr>';
      return;
    }

    let tableHtml = '';
    bookmarks.forEach(bookmark => {
      tableHtml += `
        <tr data-bookmark-id="${bookmark.id}" data-bookmark-name="${bookmark.name}">
          <td><input type="checkbox" name="tab-list-checkbox" id="checkbox-${bookmark.id}" ></td>
          <td>
            <div class="db-edit" style="display: none;">
              <input type="text" value="${bookmark.name}">
            </div>
            <a href="#"><span>${bookmark.name}</span></a>
          </td>
        </tr>
      `;
    });

    tabListTable.innerHTML = tableHtml;

    tabListTable.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        const row = this.closest('tr');
        const bookmarkId = row.getAttribute('data-bookmark-id');
        filterDataByBookmark(bookmarkId);
      });
    });
  } catch (error) {
    console.error('getTabList 함수 실행 중 오류:', error);
  }
}
window.getTabList = getTabList;

async function getBookmarkTabs() {
  try {
    console.log('북마크 탭 가져오기 시작');

    const currentConfig = await getCurrentConfig();
    const { powerplant_id, fuelcell_id, group_id } = currentConfig;

    console.log('북마크 탭 - 발전소 ID:', powerplant_id);
    console.log('북마크 탭 - 그룹 ID:', group_id);
    console.log('북마크 탭 - 연료전지 ID:', fuelcell_id);

    const url = `js/stack/get_bookmark.php?plant=${powerplant_id}&fuelcell=${fuelcell_id}&group=${group_id}`;
    const response = await fetch(url);

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`네트워크 오류: ${response.status} - ${text}`);
    }

    const data = await response.json();
    console.log("불러온 북마크 데이터:", data);

    const bookmarkList = document.getElementById("bookmark-tab").querySelector("ul");
    bookmarkList.innerHTML = ""; // 초기화

    const allItemsTab = document.createElement("li");
    allItemsTab.classList.add("tab-item");
    allItemsTab.innerHTML = `<a class="all-item-tab active">전체항목</a>`;
    bookmarkList.appendChild(allItemsTab);

    allItemsTab.querySelector("a").addEventListener("click", function () {
      searchWithData(currentSearchConditions);
      document.getElementById("stack-data-mng-head").classList.add("bold");
      document.querySelectorAll(".tab-item a").forEach(tab => tab.classList.remove("active"));
      this.classList.add("active");
    });

    data.forEach(bookmark => {
      const newTabItem = document.createElement("li");
      newTabItem.classList.add("tab-item");
      newTabItem.innerHTML = `<a data-bookmark-id="${bookmark.id}" class="bookmark-tab">${bookmark.name}</a>`;
      bookmarkList.appendChild(newTabItem);

      newTabItem.querySelector("a").addEventListener("click", function () {
        const bookmarkId = this.getAttribute("data-bookmark-id");
        filterDataByBookmark(bookmarkId);
        document.querySelectorAll(".tab-item a").forEach(tab => tab.classList.remove("active"));
        this.classList.add("active");
      });
    });

    const stackDataMngHead = document.getElementById("stack-data-mng-head");
    if (stackDataMngHead) {
      const existingPlusButton = stackDataMngHead.querySelector(".bmk-list-mng-plus-btn");
      if (existingPlusButton) existingPlusButton.remove();

      const plusButton = document.createElement("div");
      plusButton.classList.add("bmk-list-mng-plus-btn");
      plusButton.innerHTML = `<a class="plus" title="항목관리" onclick="openModal('manage-tab-modal', 'manage')">+</a>`;
      stackDataMngHead.appendChild(plusButton);
    }
  } catch (error) {
    console.error("getBookmarkTabs 함수 오류:", error);
    document.getElementById("bookmark-tab").innerHTML = `<p>북마크를 불러오는 데 문제가 발생했습니다.</p>`;
  }
}

// 이벤트 위임을 사용하여 탭 클릭 이벤트 핸들러 설정(상단 탭)
document
  .getElementById("bookmark-tab")
  .addEventListener("click", handleTabClick);

// 탭 클릭 이벤트 핸들러 함수
function handleTabClick(event) {
  const target = event.target.closest("a");
  if (target) {
    document
      .querySelectorAll(".tab-item a")
      .forEach((tab) => tab.classList.remove("active"));
    target.classList.add("active");

    // 항목관리 하는 + 버튼 클릭 확인
  if (target.parentElement.classList.contains("bmk-list-mng-plus-btn") || 
  target.classList.contains("plus")) {
  console.log('북마크 관리 플러스 버튼 클릭');
  event.stopPropagation(); // 이벤트 버블링 중지
  event.preventDefault(); // 기본 이벤트 중지
  openModal('manage-tab-modal', 'manage'); // 모달 열기, 두 번째 파라미터 추가
  return; // 데이터 조회 로직 실행 안함
  }

    // 전체항목 탭을 클릭했는지 확인
    if (target.classList.contains("all-item-tab")) {
      // console.log('전체항목 탭 클릭');
      searchWithData(currentSearchConditions).then(() => {
        // 검색 버튼 클릭 이벤트 트리거
        document.querySelector(".stk-sch-btn").click();
      });
      return; // 이후 로직을 실행하지 않음
    }

    // 다른 북마크 탭을 클릭했을 경우
    const bookmarkId = target.dataset.bookmarkId;
    if (bookmarkId) {
      // console.log("Clicked bookmark ID:", bookmarkId);
      filterDataByBookmark(bookmarkId, 1, currentSearchConditions).then(() => {
        // 검색 버튼 클릭 이벤트 트리거
        document.querySelector(".stk-sch-btn").click();
      });
    } else {
      console.error("Bookmark ID not found");
      alert("데이터를 불러오는 중 오류가 발생했습니다.");
    }
  }
}

/*
오류 : undefined 메세지 뜨는 이유는 data.message나 data.error 접근하려 할 때,
data 객체가 올바르게 파싱되지 않았거나 응답 데이터에 message 혹은 error필드가 없을 때 발생
*/
// 북마크 업데이트 함수
function updateBookmark(id, newName, newColorId) {
  fetch(`js/stack/update_bookmark.php`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      id: id,
      bookmark: newName,
      color: newColorId
    }),
  })
    .then((response) => response.text())
    .then((text) => {
      // console.log('Response text:', text); // 서버에서 반환된 응답을 로그로 출력

      // 응답을 두 개의 JSON 객체로 나누기
      const jsonResponses = text.split("}{").map((part, index, arr) => {
        if (index === 0) return part + "}";
        if (index === arr.length - 1) return "{" + part;
        return "{" + part + "}";
      });

      jsonResponses.forEach((jsonResponse) => {
        try {
          const data = JSON.parse(jsonResponse);
          // console.log('Parsed response data:', data);
          getTabList(); // 업데이트 후 북마크 목록을 다시 불러옴
          getBookmarkTabs();
        } catch (e) {
          console.error("Error parsing JSON:", e);
          console.error("Response text:", jsonResponse); // 파싱 오류 발생 시 응답 텍스트를 로그로 출력
        }
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

////////////////////////////////////////////////////////////////////////////////////////
// 그래프 그리기 
// selected 디렉터리 비우는 함수 
async function clearSelectedDirectory() {
  const sessionId = getSessionId();
  try {
      const response = await fetch(`js/stack/delete_files_in_selected.php?sessionId=${sessionId}`);
      const data = await response.json();
      console.log('Selected directory cleared:', data.message);
      return data;
  } catch (error) {
      console.error("Error clearing selected directory:", error);
      throw error;
  }
}
window.clearSelectedDirectory = clearSelectedDirectory;

// 세션 ID 관리 함수
function getSessionId() {
  let sessionId = document.cookie.split('; ')
      .find(row => row.startsWith('SESS_ID='))
      ?.split('=')[1];
  
  return sessionId;
}

async function copyFilesForGraph(no, color, dateValue, fuelcell_id, powerplant_id) {
  if (!powerplant_id || !fuelcell_id) {
    console.error('필수 파라미터 누락:', { powerplant_id, fuelcell_id });
    throw new Error('발전소 ID와 연료전지 ID가 필요합니다.');
  }

  const type = document.querySelector('#sin-pulse-select').value;
  const sessionId = getSessionId();
  const defaultColor = color.toLowerCase() === '#ffffff' ? '' : encodeURIComponent(color);
  const isRawData = document.querySelector('#raw-data-checkbox')?.checked || false;

  const url = `js/stack/copyFileForGraph.php?no=${no}&type=${type}&color=${defaultColor}&date=${encodeURIComponent(dateValue)}&fuelcell_id=${encodeURIComponent(fuelcell_id)}&powerplant_id=${encodeURIComponent(powerplant_id)}&isRawData=${isRawData}&sessionId=${sessionId}`;

  try {
    const response = await fetch(url);
    const text = await response.text();
    const result = JSON.parse(text);

    if (!result.success) {
      if (isRawData && result.message.includes("파일을 찾을 수 없습니다")) {
        alert("Raw Data가 없습니다.");
        return null;
      }
      throw new Error(result.message);
    }

    if (Array.isArray(result.data)) {
      const xs = result.data.map(d => d[1]);
      const ys = result.data.map(d => d[2]);

      const min_x = Math.min(...xs);
      const max_x = Math.max(...xs);
      const min_y = Math.min(...ys);
      const max_y = Math.max(...ys);

      const xaxis_max = Math.ceil(max_x * 1.1);
      const yaxis_max = Math.ceil(max_y * 1.1);

      const isRelative = typeof getLocalStorage === "function" && getLocalStorage(`${PLANT_FOLDER()}/${STACK_NAME()}/org_chk`) === 'true';

      return {
        ...result,
        data: result.data,
        color: color,
        min_x,
        max_x,
        min_y,
        max_y,
        xaxis_max,
        yaxis_max,
        isRelative,
        ack_number: Date.now() % 1000000 // 임시 구분값
      };
    } else {
      console.warn("서버 응답에 그래프 데이터가 없습니다.");
      return null;
    }
  } catch (e) {
    console.error('copyFilesForGraph 오류:', e);
    throw e;
  }
}


// handleFileOperations 함수도 수정
export async function handleFileOperations(dataNos, colorInput, fuelcell_id) {
  // fuelcellConfig가 로드되지 않았다면 대기
  if (!window.isFuelcellConfigLoaded) {
      console.log('연료전지 설정 로드 대기 중...');
      return new Promise((resolve) => {
          document.addEventListener('fuelcellConfigLoaded', () => {
              resolve(handleFileOperations(dataNos, colorInput, fuelcell_id));
          }, { once: true });
      });
  }

  const currentConfig = getCurrentConfig();
  console.log('현재 설정:', currentConfig); // 설정 값 로깅

  if (!currentConfig || !currentConfig.powerplant_id || !currentConfig.fuelcell_id) {
      console.error('유효하지 않은 설정:', currentConfig);
      throw new Error('발전소 또는 연료전지 설정을 찾을 수 없습니다.');
  }

  const powerplant_id = currentConfig.powerplant_id;

  console.log('파일 작업 시작:', {
      dataNos,
      colorInput,
      fuelcell_id: currentConfig.fuelcell_id,
      powerplant_id
  });

  try {
      await clearSelectedDirectory();

      const fetchPromises = dataNos.map((no) => {
          console.log(`NO ${no} 처리 중`);
          return copyFilesForGraph(
              no, 
              colorInput, 
              new Date().toISOString(), 
              currentConfig.fuelcell_id, 
              powerplant_id
          ).catch(error => {
              console.error(`NO ${no} 처리 중 에러:`, error);
              return null;
          });
      });

      const results = await Promise.all(fetchPromises);
      const allData = results.filter((data) => data !== null);
      
      if (allData.length === 0) {
          throw new Error('처리된 파일이 없습니다');
      }
      
      console.log('모든 데이터 처리 완료:', allData);
      window.handleDataResponse(allData);
  } catch (error) {
      console.error("파일 작업 중 에러:", error);
      throw error;
  }
}

// 체크박스 선택하고 '그래프 그리기' 버튼 클릭 이벤트 처리
export async function copySelectedFiles() {
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][name="search-checkbox"]:checked'
  );
  if (checkboxes.length === 0) return;

  const currentConfig = await getCurrentConfig();
  if (!currentConfig?.powerplant_id || !currentConfig?.fuelcell_id) {
    console.error('설정을 가져올 수 없습니다:', currentConfig);
    throw new Error('발전소 또는 연료전지 설정을 찾을 수 없습니다.');
  }

  const type = document.querySelector('#sin-pulse-select')?.value || 'SIN';
  const selectedColor = document.getElementById('graph-color-selector')?.value;

  if (type === 'SIN' || type === 'CALIB') {
    try {
      const fetchPromises = Array.from(checkboxes).map(cb => {
        const row = cb.closest('tr');
        const dateCell = row.querySelector('.date-cell');
        const no = cb.getAttribute("data-no");

        let color;
        if(selectedColor && selectedColor !== '' && selectedColor !== '#ffffff') {
          color = selectedColor;
        } else {
          const errCode = dateCell.getAttribute('data-err')?.split('.')[0];
          color = getColorByMERR(errCode) || '#06D001';
          console.log(`Processing NO: ${no}, Color: ${color}`);
        }
        return copyFilesForGraph(
          no, color, new Date().toISOString(),
          currentConfig.fuelcell_id, currentConfig.powerplant_id
        ).then(result => result ? { ...result, color } : null);
      });

      const results = await Promise.all(fetchPromises);
      const allData = results.filter(data => data !== null);

      if (allData.length > 0) {
        window.handleDataResponse(allData); // 그래프 색상 포함 전달
      } else {
        console.error('처리된 데이터가 없습니다.');
      }
    } catch (error) {
      console.error("Error during file operations:", error);
      throw error;
    }
  } else if (type === 'PULSE' || type === 'NPULSE') {
    try {
      const selectedItems = Array.from(checkboxes).map(cb => ({
        no: cb.getAttribute("data-no"),
        type: cb.getAttribute("data-type"),
      }));

      const fullpaths = [];

      for (const item of selectedItems) {
        const response = await fetch(`js/stack/get_pulse_name.php?no=${item.no}&type=${item.type}`);
        const data = await response.json();
        if (data.name) fullpaths.push(data.name);
      }

      if (fullpaths.length > 0) {
        const graphElement = document.querySelector("pulse-graph-in-stack");
        if (graphElement) {
          graphElement.fullpaths = fullpaths;
          graphElement.destroyPlot();
          graphElement.init_DOM();
          await graphElement.init_data();
        } else {
          console.error("pulse-graph-in-stack 요소를 찾을 수 없습니다.");
        }
      } else {
        console.warn("가져온 파일 경로가 없습니다.");
      }
    } catch (error) {
      console.error("PULSE 데이터 처리 중 오류 발생:", error);
    }
  }
}

// 선택된 파일 삭제 함수 추가
async function deleteSelectedFile(no) {
  const sessionId = getSessionId();
  try {
      const response = await fetch(`js/stack/delete_selected_file.php?no=${no}&sessionId=${sessionId}`);
      if (!response.ok) {
          throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (!data.success) {
          throw new Error(data.message);
      }
      return data;
  } catch (error) {
      console.error('Error deleting file:', error);
      throw error;
  }
}

// 날짜 셀 클릭 이벤트 처리 함수
async function handleDateCellClick(event) {
  const clickedElement = event.target;

  // type이 SIN 또는 CALIB인 경우에만 실행
  if ((type === 'SIN' || type === 'CALIB') && clickedElement.tagName === 'TD' && clickedElement.cellIndex === 1) {
    const row = clickedElement.closest('tr');
    const checkbox = row.querySelector('input[type="checkbox"][name="search-checkbox"]');
    const graphBtn = document.getElementById('graph-btn');

    if (checkbox && graphBtn) {
      try {
        const isCurrentlyChecked = checkbox.checked;
        const dateCell = row.querySelector('.date-cell');
        const dataNo = dateCell.getAttribute('data-no');
        checkbox.checked = !isCurrentlyChecked;

        if (!isCurrentlyChecked) {
          if (typeof window.clear_graph === 'function') {
            window.clear_graph();
          }
          let color;
          const errCode = dateCell.getAttribute('data-err')?.split('.')[0];
          color = getColorByMERR(errCode) || '#06D001';
          graphBtn.setAttribute("data-color", color);
          graphBtn.setAttribute("data-no", dataNo);
          graphBtn.click();
        } else {
          await deleteSelectedFile(dataNo);
          if (typeof window.clear_graph === 'function') {
            window.clear_graph();
          }

          const checkedBoxes = document.querySelectorAll(
            'input[type="checkbox"][name="search-checkbox"]:checked'
          );
          if (checkedBoxes.length > 0) {
            graphBtn.removeAttribute("data-color");
            graphBtn.removeAttribute("data-no");
            graphBtn.click();
          }
        }
        updateSelectedCount();
      } catch (error) {
        console.error('Error during date cell click:', error);
        checkbox.checked = !checkbox.checked; 
        updateSelectedCount();
      }
    }
  } 
}

// 날짜 셀 클릭 이벤트 핸들러 설정 함수
function dateCellClickHandler(tableBody) {
  if (!tableBody) {
    console.log('Table body not found');
    return;
  }

  tableBody.addEventListener('click', handleDateCellClick);
}

// 컬러(색깔) -  색상 맵을 로드하는 함수
// 그래프 색상 선택기 초기화
export function initializeGraphPickers() {
  const graphColorPicker = document.querySelector("#graph-color-selector");
  graphColorPicker.addEventListener("change", function () {
    this.style.color = this.value; // 직접 선택된 색상 코드 사용
  });
}

// 태그 색상 선택기 초기화
export function initializeTagColorSelector() {
  const tagColorSelector = document.querySelector("#tag-color-selector");
  tagColorSelector.addEventListener("change", function () {
    this.style.color = this.value; // 직접 선택된 색상 코드 사용
  });
}

// 수정된 getGraphColor 함수
function getGraphColor(dataNo) {
  // 사용자가 직접 선택한 색상이 있는 경우
  const colorInput = document.querySelector("#graph-color-selector").value;
  console.log('Selected color:', colorInput);

  if (colorInput && colorInput.toUpperCase() !== '#FFFFFF') {
      console.log('Using user selected color:', colorInput);
      return colorInput;
  }

  // checkbox에서 data-err 값을 가져와서 색상 매핑
  const checkbox = document.querySelector(`input[data-no="${dataNo}"]`);
  if (checkbox) {
      const errCode = checkbox.getAttribute('data-err');
      const mappedColor = getColorByMERR(errCode);
      console.log('Data NO:', dataNo);
      console.log('Error code:', errCode);
      console.log('Mapped color:', mappedColor);
      return mappedColor;
  }

  console.log('Using default color');
  return '#06D001'; // 기본 색상
}

// BOP페이지=> STACK 페이지 URL의 stime 인자로 스택 페이지 그래프 그리기
function handleTimeSearch() {
  const urlParams = new URLSearchParams(window.location.search);
  const stime = urlParams.get('stime');
  const plant = urlParams.get('plant') || 'SE01';  
  const group = urlParams.get('group');
  const fuelcell = urlParams.get('fuelcell');
  
  if (!stime || !group || !fuelcell) return;

  const apiUrl = `js/stack/get_bop_date_on_search.php?plant=${plant}&group=${group}&fuelcell=${fuelcell}&stime=${stime}`;

  fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        // 페이지 번호 계산 (itemsPerPage는 페이지당 항목 수)
        const pageNumber = Math.ceil(data.rowNumber / itemsPerPage);
        
        // 먼저 해당 페이지로 이동
        searchWithData(currentSearchConditions, pageNumber).then(() => {
          // 페이지 로드 완료 후 해당 행 찾기
          const dateCells = document.querySelectorAll('#stack_search_table .date-cell');
          
          dateCells.forEach(cell => {
            if (cell.textContent.trim() === data.data.DATE) {
              const row = cell.closest('tr');
              if (row) {
                const checkbox = row.querySelector('input[type="checkbox"]');
                if (checkbox) {
                  // 다른 체크박스들 모두 해제
                  document.querySelectorAll('#stack_search_table input[type="checkbox"]').forEach(cb => {
                    cb.checked = false;
                  });
                  
                  // 해당 체크박스 체크
                  checkbox.checked = true;

                  row.scrollIntoView({
                    behavior: 'auto',
                    block: 'center'
                  });
                  
                  // 그래프 초기화
                  if (typeof window.clear_graph === 'function') {
                    window.clear_graph();
                  }
                  
                  // 그래프 그리기
                  const graphBtn = document.getElementById('graph-btn');
                  if (graphBtn) {
                    graphBtn.click();
                  }
                  
                  // 체크박스 카운트 업데이트
                  updateSelectedCount();
                }
              }
            }
          });
        });
      }
    })
    .catch(error => {
      console.error('API 호출 오류:', error);
    });
}

document.addEventListener('DOMContentLoaded', () => {
  const graphBtn = document.querySelector("#graph-btn");
  if (graphBtn && !graphBtn.getAttribute("data-color")) {
    graphBtn.setAttribute("data-color", "#06D001"); 
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.has('stime')) {
    setTimeout(handleTimeSearch, 1000);
  } else {
    // fuelcellConfig가 로드될 때까지 대기
    if (window.isFuelcellConfigLoaded) {
      loadInitialData().then(() => {
        console.log("초기 데이터 로드 완료");
      }).catch(error => {
        console.error("초기 데이터 로드 실패:", error);
      });
    } else {
      document.addEventListener('fuelcellConfigLoaded', () => {
        loadInitialData().then(() => {
          console.log("초기 데이터 로드 완료");
        }).catch(error => {
          console.error("초기 데이터 로드 실패:", error);
        });
      }, { once: true });
    }
  }
});

/////////////////////////////////////////////////////////////////////////////
// 에러코드에 따른 색상 매핑 함수(그래프 그리기)
function getColorByMERR(errCode) {
  const colorMap = {
      '0': '#06D001',  // 정상 - 초록색
      '1': '#E53E3E',  // MFM 전 누설 - 더 진한 빨간색
      '2': '#CC0000',  // MFM 후 누설 - 매우 진한 빨간색
      '3': '#E65C00',  // 블로워 - 더 진한 주황색
      '4': '#0066CC',  // 유량센서 - 더 진한 파란색
      '5': '#6B238E',  // 압력센서 - 더 진한 보라색
      '6': '#0099CC',  // 가습기 - 더 진한 하늘색
      '7': '#CC7A00',  // 스택 입구 온도센서(물) - 더 진한 주황색
      '8': '#B35900',  // 스택 출구 온도센서(물) - 더 진한 주황갈색
      '9': '#0052CC',  // 열교환기 - 더 진한 파란색
      '10': '#004C99', // 1차 냉각수 펌프 - 매우 진한 파란색
      '11': '#008B74', // 2차 냉각수 펌프 - 더 진한 청록색
      '12': '#CC9900', // 스택 입구 온도센서(열) - 더 진한 노란색
      '13': '#993D00', // 스택 출구 온도센서(열) - 더 진한 갈색
      '14': '#CC0033', // 열교환기 출구 온도센서 - 더 진한 빨간색
      '15': '#cf1d1d', // 공기 부족 - 밝은 빨간색
      '16': '#cf0000', // 수소 부족 - 어두운 빨간색
      '30': '#FFAA00', // 가동준비 - 밝은 주황색
      '31': '#00A300', // 정상복귀 - 진한 초록색
      '32': '#d62828', // CO의심 - 짙은 적색
      '33': '#4a0000'  // CO피독 - 더 어두운 적색
  };
  return colorMap[errCode] || '#06D001'; // 매핑되지 않은 코드는 기본값으로 초록색 반환
}

// 라벨 입력 필드에 대한 엔터 키 이벤트 리스너 추가(엔터 치면 수정사항 저장되도록)
document.querySelectorAll(".label-input").forEach((input) => {
  input.addEventListener("keypress", function (e) {
    // keypress: 키 눌렀을 때, keydown: 키 누르는 동안, keyup: 키에서 손 땔 때
    // console.log(e.currentTarget.dataset.date);
    if (e.key === "Enter") {
      e.preventDefault(); // 폼 제출 방지w
      updateLabel(e.currentTarget.dataset.date, e.currentTarget.value); // 데이터 업데이트 함수 호출
      e.currentTarget.blur(); // 입력 필드 포커스 제거
    }
  });
});


////////////////////////////////////////////////////////////////////////////////////////
// 항목 관리 버튼(상단의 '+' 기호) 추가하는 함수
// function addPlusButton(bookmarkList) {
//   // 부모 div 찾기
//   const subTabDiv = bookmarkList.parentElement;
  
//   // 이미 플러스 버튼이 있는지 확인
//   if (!subTabDiv.querySelector('.bmk-list-mng-plus-btn')) {
//       var plusButton = document.createElement("div");
//       plusButton.innerHTML = '<a class="plus" title="항목관리" onclick="openModal(\'manage-tab-modal\', \'manage\')">+</a>';
//       plusButton.classList.add("bmk-list-mng-plus-btn");
      
//       // ul 앞에 플러스 버튼 추가
//       subTabDiv.insertBefore(plusButton, bookmarkList);
//   }
// }

// 서버에 북마크를 추가하는 함수
function addBookmark(bookmarkName) {
  try {
    console.log('북마크 추가 시작:', bookmarkName);
    
    if (!bookmarkName || bookmarkName.trim() === '') {
      alert('북마크 이름을 입력해주세요.');
      return;
    }
    
    // URL 파라미터에서 값 가져오기
    const urlParams = new URLSearchParams(window.location.search);
    const urlPlant = urlParams.get('plant');
    const urlGroup = urlParams.get('group');
    const urlFuelcell = urlParams.get('fuelcell');
    
    // 현재 설정 가져오기
    const currentConfig = getCurrentConfig();
    
    // 유효한 값 확인
    const powerplant_id = (urlPlant && urlPlant !== 'undefined') ? urlPlant : 
                        (currentConfig && currentConfig.powerplant_id) ? currentConfig.powerplant_id : 'SE01';
    const group_id = (urlGroup && urlGroup !== 'undefined') ? urlGroup : 
                   (currentConfig && currentConfig.group_id) ? currentConfig.group_id : 'GR01';
    const fuelcell_id = (urlFuelcell && urlFuelcell !== 'undefined') ? urlFuelcell : 
                      (currentConfig && currentConfig.fuelcell_id) ? currentConfig.fuelcell_id : 'F001';
    
    console.log('북마크 추가 - 발전소 ID:', powerplant_id);
    console.log('북마크 추가 - 그룹 ID:', group_id);
    console.log('북마크 추가 - 연료전지 ID:', fuelcell_id);
    
    // 요청 데이터 확인 로깅
    console.log('북마크 추가 요청 데이터:', {
      name: bookmarkName,
      powerplant_id: powerplant_id,
      group_id: group_id,
      fuelcell_id: fuelcell_id
    });
    
    // 북마크 추가 요청
    const formData = new FormData();
    formData.append('name', bookmarkName);
    formData.append('powerplant_id', powerplant_id);
    formData.append('group_id', group_id);
    formData.append('fuelcell_id', fuelcell_id);
    
    // FormData 내용 확인 로깅
    for (const [key, value] of formData.entries()) {
      console.log(`${key}: ${value}`);
    }
    
    fetch('js/stack/add_bookmark.php', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      console.log('북마크 추가 응답:', data);
      
      if (data.success) {
        alert('북마크가 추가되었습니다.');
        
        // 북마크 리스트 새로고침
        getBookmarkTabs();
        getTabList();
        // 선택된 체크박스 데이터를 북마크에 등록
        const checkedBoxes = document.querySelectorAll('input[name="data-checkbox"]:checked');
        if (checkedBoxes.length > 0) {
          console.log(`${checkedBoxes.length}개 항목을 북마크에 등록합니다.`);
          registerBookmarkData(data.bookmarkId, checkedBoxes);
        }
      } else {
        alert('북마크 추가 실패: ' + (data.message || '알 수 없는 오류'));
      }
    })
    .catch(error => {
      console.error('북마크 추가 중 오류:', error);
      alert('북마크 추가 중 오류가 발생했습니다.');
    });
  } catch (error) {
    console.error('addBookmark 함수 실행 중 오류:', error);
  }
}
////////////////////////////////////////////////////////////////////////////////////
// 북마크 삭제
// 삭제 버튼 이벤트 리스너 추가
document.getElementById("delete-bmk").addEventListener("click", function () {
  const selectedCheckboxes = document.querySelectorAll(
    'input[name="tab-list-checkbox"]:checked'
  );
  const idsToDelete = Array.from(selectedCheckboxes).map((checkbox) => {
    return checkbox.closest("tr").getAttribute("data-bookmark-id");
  });

  if (idsToDelete.length === 0) {
    alert("삭제할 북마크를 선택해주세요.");
    return;
  }

  deleteBookmarks(idsToDelete);
});

// 북마크 삭제 함수
function deleteBookmarks(ids) {
  let deletePromises = ids.map((id) => {
    return fetch("js/stack/delete_bookmark.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "id=" + encodeURIComponent(id),
    }).then((response) => response.json());
  });

  Promise.all(deletePromises)
    .then((results) => {
      // 모든 결과에서 에러 확인
      const errors = results.filter((result) => result.error);
      if (errors.length > 0) {
        alert("일부 북마크 삭제에 실패했습니다.");
      } else {
        alert("선택된 북마크가 성공적으로 삭제되었습니다.");
        location.reload(); // 페이지 새로고침
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      alert("북마크 삭제 과정에서 문제가 발생했습니다.");
    });
}


///////////////////////////////////////////////////////////////////////////
// 북마크 데이터를 등록하는 함수
function registerBookmarkData(bookmarkId, checkboxes) {
  checkboxes.forEach((checkbox) => {
    const no = checkbox.getAttribute("data-no");
    saveBookmarkData(no, bookmarkId);
  });
}

// 여러 데이터를 저장할 때 한 번만 메세지 표시하기 위해 Promise.all 사용
// 북마크 데이터를 서버에 저장하는 함수
function saveBookmarkData(dataNo, bookmarkId) {
  const payload = JSON.stringify({ no: dataNo, bookmarkId: bookmarkId });
  // console.log('Sending payload:', payload);

  return fetch("js/stack/save_bookmark_data.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: payload,
  }).then((response) => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  });
}

// 모달을 여러번 열고 닫을때마다 이벤트 리스너 중복으로 추가되는 문제 발생되어서
// 이벤트 리스너 중복 등록 방지를 위해 handleBookmarkLinkClick과 setupBookmarkModal을 함께 작동시킨다.
function handleBookmarkLinkClick(event) {
  event.preventDefault(); // 기본 이벤트를 방지
  const tr = this.closest("tr");
  const bookmarkId = tr.getAttribute("data-bookmark-id"); // data-bookmark-id 속성의 값 가져옴
  const checkboxes = document.querySelectorAll(
    'input[type="checkbox"][name="search-checkbox"]:checked'
  ); //체크된 모드 체크박스 선택
  const selectedData = Array.from(checkboxes).map((checkbox) => ({
    no: checkbox.getAttribute("data-no"), // 체크박스에서 'data-no' 속성 가져와 객체에 저장
    bookmarkId: bookmarkId, // 위에서 얻은 bookmarkId를 객체에 저장
  }));

  saveMultipleBookmarkData(selectedData);
  closeModal("manage-tab-modal"); // 모달의 표시 상태 토글
  filterDataByBookmark(bookmarkId);

  const tabItem = document.querySelector(
    `.tab-item a[data-bookmark-id="${bookmarkId}"]`
  ); //bookmarkId에 해당하는 탭 아이템 선택
  if (tabItem) {
    document
      .querySelectorAll(".tab-item a")
      .forEach((tab) => tab.classList.remove("active")); // 모든 탭 아이템에서 active 클래스 제거
    tabItem.classList.add("active"); // 현재 탭 아이템에 active 클래스 추가
  }
}

function setupBookmarkModal() {
  const dbEditElements = document.querySelectorAll(
    "#manage-tab-modal .db-edit"
  );
  dbEditElements.forEach((element) => (element.style.display = "none"));
  const tabListCheckboxes = document.querySelectorAll(
    '#manage-tab-modal input[name="tab-list-checkbox"]'
  );
  tabListCheckboxes.forEach((checkbox) => (checkbox.style.display = "none"));

  const bookmarkLinks = document.querySelectorAll("#manage-tab-modal a");
  bookmarkLinks.forEach((link) => {
    link.removeEventListener("click", handleBookmarkLinkClick); // 기존 이벤트 리스너 제거
    link.addEventListener("click", handleBookmarkLinkClick); // 새 이벤트 리스너 추가
  });
}

function saveMultipleBookmarkData(bookmarkData) {
  const savePromises = bookmarkData.map((data) =>
    saveBookmarkData(data.no, data.bookmarkId)
  );

  Promise.all(savePromises)
    .then((results) => {
      // console.log('All data saved:', results);
      alert("모든 데이터가 성공적으로 저장되었습니다.");
      // 필요한 추가 작업 수행
      filterDataByBookmark(bookmarkData[0].bookmarkId); // 예시: 첫 번째 북마크 ID로 필터링
    })
    .catch((error) => {
      console.error("Error during data registration:", error);
      alert("데이터 등록 중 오류가 발생했습니다: " + error.message);
    });
}

//////////////////////////////////////////////////////////////////////////////
// [데이터 업로드]
// 파일 업로드 관련 함수
function handleFileUpload(e) {
  e.preventDefault();
  const form = document.getElementById('uploadForm');
  const formData = new FormData(form);

  const currentConfig = getCurrentConfig();
  const {powerplant_id,  group_id, fuelcell_id} = currentConfig;

  // 종료 시간을 현재 시간으로 설정하고 포맷을 맞춤
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

   // FormData 객체 새로 구성
   const apiFormData = new FormData();
   apiFormData.append('powerplant_id', powerplant_id);
   apiFormData.append('group_id', group_id);
   apiFormData.append('fuelcell_id', fuelcell_id);
   apiFormData.append('SIN', formData.get('measurement_type') === 'SIN' ? '1' : '0');
   apiFormData.append('VT', formData.get('voltage_type').replace('V', ''));
   apiFormData.append('KW', formData.get('power_type').replace('KW', ''));
   apiFormData.append('FROM', formData.get('FROM'));
   apiFormData.append('TO', formData.get('TO'));
   apiFormData.append('MERR', formData.get('MERR'));
   apiFormData.append('BIGO', formData.get('BIGO'));
   apiFormData.append('E_DATE', formattedDate);
   
   // 파일 추가
   const fileInput = document.querySelector('#upfile');
   if (fileInput.files[0]) {
     apiFormData.append('upfile', fileInput.files[0]);
   }
 
   // API 호출
   fetch('http://112.216.161.114:8082/eis/', {
     method: 'POST',
     body: apiFormData
   })
   .then(response => {
     if (!response.ok) {
       throw new Error(`HTTP error! status: ${response.status}`);
     }
     return response.text();
   })
   .then(text => {
     console.log('Server response:', text);
     if (text.includes("upload finish")) {
       alert('업로드가 완료되었습니다.');
       closeModal('data-upload-modal');
       searchWithData({});
     } else {
       alert('업로드 실패: ' + text);
     }
   })
   .catch(error => {
     console.error('Error:', error);
     alert('업로드 중 오류가 발생했습니다: ' + error.message);
   });
 }

// .dat파일 파싱
function parseDatFile(txt) {
  const rows = txt.trim().split("\n").filter(row => row.trim() !== "");
  const micro = [];
  const voltage = [];
  const current = [];

  for (const row of rows) {
    const cols = row.split(",");
    if (cols.length < 3) continue; 

    micro.push(parseFloat(cols[0]));
    voltage.push(parseFloat(cols[1]));
    current.push(parseFloat(cols[2]));
  }

  return [
    micro,
    voltage,
    current
  ];
}

//////////////////////////////////////////////////////////////////////////
// [상세 데이터]
document.getElementById('data-detail-btn').addEventListener('click', function() {
  const selectedCheckboxes = document.querySelectorAll('input[name="search-checkbox"]:checked');
  
  if (selectedCheckboxes.length === 0) {
    alert('데이터를 하나 선택해주세요.');
    return;
  } else if (selectedCheckboxes.length > 1) {
    alert('하나의 데이터만 선택해주세요.');
    return;
  }

  const selectedNo = selectedCheckboxes[0].getAttribute('data-no');
  console.log('Selected NO:', selectedNo);

  fetch(`js/stack/get_data_detail.php?no=${selectedNo}`)
    .then(response => response.json())
    .then(data => {
      console.log('받은 데이터:', data);
      const payload = data.data ?? data;

      ['nyquist-detail', 'pulse-detail'].forEach(id => {
        document.querySelectorAll(`#${id} td[data-field]`).forEach(td => {
          const field = td.dataset.field;
          let value = payload[field];

          // FileName 경로일 경우 / 맨 뒤 파일이름만 보이게
          if ((type === 'PULSE' || type === 'NPULSE') && field === 'NAME' && value != null) {
            const parts = value.split(/[\\/]/); // 슬래시나 역슬래시 구분
            value = parts[parts.length - 1];
          }
          if (field === 'SIN') {
            switch(value) {
              case 0 :
                value = 'SIN';
                break;
              case 1 :
                value = 'PULSE';
                break;
              case 2 :
                value = 'NPULSE';
                break;
              case 3 :
                value = 'CALIB';
                break;
            }
          }
          td.innerText = value != null ? value : '-';
        });
      });
      openModal('data-detail-modal');

      const nyquistFields = document.querySelectorAll('#nyquist-detail');
      const pulseFields = document.querySelectorAll('#pulse-detail');

      // type에 따라 보이는 data field 설정
      if (type === 'SIN') {
        nyquistFields.forEach(field => field.style.display = '');
        pulseFields.forEach(field => field.style.display = 'none');
        document.getElementById('hz-container').style.display = '';
        document.getElementById('uplot-container').style.display = '';
      } else if (type === 'PULSE' || type === 'NPULSE' || type === 'CALIB') {
        nyquistFields.forEach(field => field.style.display = 'none');
        pulseFields.forEach(field => field.style.display = '');
        document.getElementById('hz-container').style.display = 'none';
        document.getElementById('uplot-container').style.display = 'none';
      }

      const date = new Date(payload.DATE);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      const seconds = String(date.getSeconds()).padStart(2, '0');

      if (type === 'SIN') {
        // 디렉토리 경로에 있는 .dat 파일 목록을 가져와 테이블에 표시
        const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
        const dir = `${payload.powerplant_id}/${payload.fuelcell_id}/EIS/${year}/${month}/d${formattedDate}`;
        fetch(`js/stack/get_dat_list.php?dir=${dir}`)
          .then(res => res.json())
          .then(fileList => {
            console.log(fileList); // 파일 목록 확인
            const tableBody = document.getElementById('hz-data-table');
            tableBody.innerHTML = ''; 
        
            fileList.forEach((file, index) => {
              const tr = document.createElement('tr');
              const td = document.createElement('td');
              const fullFileName = file;
              tr.setAttribute('data-file', fullFileName);
              td.textContent = file.split('_')[0]; // 속성으로 파일이름 저장
              td.addEventListener('click', () => {
                document.querySelectorAll('#hz-data-table td').forEach(el => {
                  el.classList.remove('selected');
                });
                td.classList.add('selected');
                const filePath = `${payload.powerplant_id}/${payload.fuelcell_id}/EIS/${year}/${month}/d${formattedDate}/${fullFileName}`;
                const uplotContainer = document.getElementById('uplot-container');

                if (!window.uplotInstance && uplotContainer) {
                  window.uplotInstance = new uPlot(opts(), [], uplotContainer);
                }
                fetch(`js/stack/get_dat_list.php?file=${filePath}`)
                  .then(res => res.json())
                  .then(json => {
                    const dataText = json.fileContent;
                    const parsedData = parseDatFile(dataText);
                    if (window.uplotInstance) {
                      window.uplotInstance.setData(parsedData);
                    }
                  })
                  .catch(error => {
                    console.error('Error fetching .dat file:', error);
                    alert('파일을 가져오는 중 오류가 발생했습니다.');
                  });
              });
              tr.appendChild(td);
              tableBody.appendChild(tr);
              if (index === 0) {
                td.classList.add('selected');
                td.click();  // 첫 번째 파일 클릭 트리거로 그래프 자동 실행
              }
            });
          })
        .catch(error => {
            console.error('Error fetching .dat files:', error);
            alert('파일 목록을 가져오는 데 오류가 발생했습니다.');
        });
      }
      document.getElementById('download-btn').onclick = function() {
        const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;
        const baseUrl = `http://fuelcelldr.com:11180/RAW/${payload.powerplant_id}/${payload.fuelcell_id}/EIS/${year}/${month}`;
        let downloadUrl = "";

        switch (type) {
            case 'SIN':
            case 'CALIB':
                downloadUrl = `${baseUrl}/d${formattedDate}.zip`;
                break;
            case 'PULSE':
                downloadUrl = `${baseUrl}/pulse_data/d${formattedDate}.zip/d${formattedDate}.zip`;
                break;
            case 'NPULSE':
                // NPULSE는 초(second) 없이 파일명 생성
                const npulseDate = `${year}-${month}-${day}-${hours}-${minutes}`;
                downloadUrl = `${baseUrl}/npulse_data/${day}/npulse_d${npulseDate}.zip`;
                break;
            default:
                alert("지원되지 않는 타입입니다.");
                return;
        }
        window.open(downloadUrl, '_blank');
      };
    })
    .catch(error => {
      console.error('Error:', error);
      alert('데이터를 가져오는 중 오류가 발생했습니다.');
    });
});

function opts() {
  const container = document.querySelector(".graph-selected");
  const width = container ? container.clientWidth : 550;
  const height = Math.floor(width * 3 / 4);

  return {
    title: "Voltage & Current",
    width,
    height,
    scales: {
      x: { time: false },
      y: { auto: true }
    },
    series: [
      {}, // x축
      {
        label: "Voltage",
        points: {show: false},
        stroke: "blue"
      },
      {
        label: "Current",
        points: {show: false},
        stroke: "red"
      }
    ]
  };
}
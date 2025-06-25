//bopNarmalData.js [BOP 정상 학습 데이터]
import { getCurrentConfig, ensureDataLoaded } from '../config/fuelcellSelector.js';

// 현재 선택된 발전소와

// 이벤트 핸들러 객체
const eventHandlers = {
  addTimePeriod,
  toggleAllCheckboxes,
  deleteSelectedRows,
  bringNormalDataFileList,
  closeModal: () => modalSW('normal-data-file-modal', 'close'),
  createNormalData,
  // addSelectedFiles,
  // appendSelectedFiles,
  // setupModalForAddLST,
  // setupModalForAppendLST
};

// 이벤트 리스너 설정
const eventListeners = {
  'add-time-period-btn': { action: 'click', handler: 'addTimePeriod' },
  'normal-data-select-all': { action: 'change', handler: 'toggleAllCheckboxes' },
  'delete-normal-data-btn': { action: 'click', handler: 'deleteSelectedRows' },
  'save-normal-data-btn': { action: 'click', handler: 'createNormalData' },
  'add-normal-data-file-btn': {action: 'click', handler: 'bringNormalDataFileList'}, // 일반 파일 추가 모달
  'append-normal-data-file-btn' : {action: 'click', handler: 'bringNormalDataFileListForAppend'}, // append 모드 위한 모달
};

// LST 추가
function setupModalForAddLST() {
  const modalTitle = document.querySelector('#normal-data-modal .modal--title');
  const actionButton = document.getElementById('add-file-name-confirm-btn');
  
  modalTitle.textContent = 'LST 추가';
  actionButton.textContent = '확인';
  actionButton.onclick = addSelectedFiles;

  bringNormalDataFileList();
}

// LST 생성(APPEND)
function setupModalForAppendLST() {
  const modalTitle = document.querySelector('#normal-data-modal .modal--title');
  const actionButton = document.getElementById('add-file-name-confirm-btn');
  
  modalTitle.textContent = 'LST 생성(append)';
  actionButton.textContent = '추가';
  actionButton.onclick = appendSelectedFiles;

  bringNormalDataFileList();
}

// 이벤트 리스너 초기화 함수
function initializeEventListeners() {
  // 필수 요소 체크
  const requiredElements = [
      'add-normal-data-file-btn',
      'append-normal-data-file-btn'
  ];
  
  // 필수 요소가 하나라도 없으면 이 페이지는 BOP Normal Data 페이지가 아님
  const isBopNormalPage = requiredElements.some(id => document.getElementById(id));
  if (!isBopNormalPage) {
      // console.log('Not in BOP Normal Data page, skipping initialization');
      return;
  }

  // 기본 이벤트 리스너 설정
  Object.entries(eventListeners).forEach(([id, { action, handler }]) => {
      const element = document.getElementById(id);
      if (element) {
          element.addEventListener(action, eventHandlers[handler]);
      }
  });

  // LST 추가 버튼
  const addLSTButton = document.getElementById('add-normal-data-file-btn');
  if (addLSTButton) {
      addLSTButton.onclick = function(event) {
          event.preventDefault();
          setupModalForAddLST();
          modalSW('#normal-data-modal', 'open');
      };
  }

  // LST 생성(append) 버튼
  const appendLSTButton = document.getElementById('append-normal-data-file-btn');
  if (appendLSTButton) {
      appendLSTButton.onclick = function(event) {
          event.preventDefault();
          setupModalForAppendLST();
          modalSW('#normal-data-modal', 'open');
      };
  }
}

// 메인 초기화 함수
async function initialize() {
  try {
      // 필수 요소 체크
      const requiredElements = [
          'add-normal-data-file-btn',
          'append-normal-data-file-btn'
      ];
      
      // 필수 요소가 하나라도 없으면 이 페이지는 BOP Normal Data 페이지가 아님
      const isBopNormalPage = requiredElements.some(id => document.getElementById(id));
      if (!isBopNormalPage) {
          return;
      }

      // fuelcellSelector의 데이터 로딩 완료 대기
      await ensureDataLoaded();
      
      // 이벤트 리스너 초기화
      initializeEventListeners();
      
      // 테이블 로드
      await loadNormalDataTable();
      
  } catch (error) {
      console.error('BOP Normal Data initialization failed:', error);
  }
}

// DOMContentLoaded 이벤트에서 초기화 함수를 비동기적으로 실행
document.addEventListener('DOMContentLoaded', () => {
  initialize().catch(console.error);
});

// fuelcellChanged 이벤트 리스너 추가
document.addEventListener('fuelcellChanged', () => {
  loadNormalDataTable().catch(console.error);
});

///////////////////////////////////////////////////////////////////////////
//체크박스
function toggleAllCheckboxes() {
  const selectAllCheckbox = document.getElementById('normal-data-select-all');
  const isChecked = selectAllCheckbox.checked;
  const checkboxes = document.querySelectorAll('#normal-data-list-table input[type="checkbox"]');
  checkboxes.forEach(checkbox => {
      checkbox.checked = isChecked;
  });
}


///////////////////////////////////////////////////////////////////////////
// 조회(type=1(시작시간 종료시간 있음)인 데이터 또는 type=2 이면서(file_name이 있음) 시작시작 종료시간 없는 데이터만 가져옴.)
export async function loadNormalDataTable() {
  try {
      // fuelcellSelector의 데이터 로딩 완료 대기
      await ensureDataLoaded();
      
      const config = await getCurrentConfig();
      const { powerplant_id, fuelcell_id } = config;

      const params = new URLSearchParams({
          powerplant_id,
          fuelcell_id
      });

      const response = await fetch(`js/bop/get_normal_data.php?${params}`, {
          cache: "no-cache"
      });
      
      const result = await response.json();
      
      if (result.success) {
          const tableBody = document.getElementById('normal-data-list-table');
          if (!tableBody) {
              console.error('테이블 요소를 찾을 수 없습니다');
              return;
          }

          tableBody.innerHTML = '';

          if (result.data.length === 0) {
            tableBody.innerHTML = '<tr>데이터가 없습니다.</tr>';
              return;
          }

          const filteredData = result.data.filter(item => 
              item.type === 1 || (item.type === 2 && !item.start_time && !item.end_time)
          );

          if (filteredData.length === 0) {
              tableBody.innerHTML = '<tr>데이터가 없습니다.</tr>';
              return;
          }

          filteredData.forEach(item => {
              const newRow = tableBody.insertRow();
              newRow.innerHTML = `
                  <td id="checkbox-${item.id}"><input type="checkbox" data-id="${item.id}" data-type="${item.type}"></td>
                  ${getContentCell(item)}
              `;
          });
      }
  } catch (error) {
      console.error('데이터 로딩 중 오류 발생:', error);
  }
}

function getContentCell(item) {
  let content = [];

  if (item.type === 1) {
    if (item.start_time && item.end_time) {
      const startDate = item.start_time.split(' ')[0];
      const startTime = item.start_time.split(' ')[1];
      const endTime = item.end_time.split(' ')[1];
      content.push(`<span class="date-div">${startDate}</span>${startTime}~${endTime}`);
    }
  } else if (item.type === 2) {
    if (item.file_name) {
      content.push(`<span class="file-div">${item.file_name}</span>`);
    }
  }

  if (content.length === 0) {
    content.push('데이터 없음');
  }

  return `<td colspan="2" id="content-${item.id}">${content.join(' ')}</td>`;
}



///////////////////////////////////////////////////////////////////////////
// 시간 추가
export async function addTimePeriod() {
  const startTime = document.getElementById('start_t').value;
  const endTime = document.getElementById('end_t').value;
  
  // URL에서 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlant = urlParams.get('plant');
  const urlGroup = urlParams.get('group');
  const urlFuelcell = urlParams.get('fuelcell');
  
  // getCurrentConfig와 URL 매개변수 둘 다 시도
  let config;
  try {
    config = await getCurrentConfig();
  } catch (error) {
    console.error('getCurrentConfig 오류:', error);
    config = {};
  }
  
  const powerplant_id = config.powerplant_id || urlPlant;
  const group_id = config.group_id || urlGroup;
  const fuelcell_id = config.fuelcell_id || urlFuelcell;
  
  console.log('구성 정보:', { powerplant_id, group_id, fuelcell_id, urlSource: !!urlPlant });
  
  // 필수 값 검증
  if (!powerplant_id || !fuelcell_id) {
    alert('연료전지 정보를 찾을 수 없습니다.');
    return;
  }
  
  if (!startTime || !endTime) {
    alert('HW BOP 센서 모니터링에서 기간을 드래그해주세요.');
    return;
  }

  // .selected-box 내부의 .date-div에서 날짜 가져오기
  const dateDiv = document.querySelector('.selected-box .date-div');
  if (!dateDiv) {
    alert('날짜를 선택해주세요.');
    return;
  }
  
  const currentDate = dateDiv.textContent.trim();
  if (!currentDate) {
    alert('유효한 날짜를 선택해주세요.');
    return;
  }
  
  // 날짜와 시간 결합
  const fullStartTime = `${currentDate} ${startTime}`;
  const fullEndTime = `${currentDate} ${endTime}`;

  // 콘솔에 전송할 데이터 확인 (디버깅용)
  console.log('전송 데이터:', {
    powerplant_id,
    group_id,
    fuelcell_id,
    start_time: fullStartTime,
    end_time: fullEndTime
  });

  // 새 데이터 객체
  const newData = {
    powerplant_id,
    group_id, 
    fuelcell_id,
    start_time: fullStartTime,
    end_time: fullEndTime
  };
  
  // 중복 검사
  const tableBody = document.getElementById('normal-data-list-table');
  const rows = tableBody.querySelectorAll('tr');
  let isDuplicate = false;
  
  for (const row of rows) {
    const contentCell = row.querySelector('[id^="content-"]');
    if (contentCell) {
      const dateSpan = contentCell.querySelector('.date-div');
      if (dateSpan) {
        const date = dateSpan.textContent.trim();
        const content = contentCell.textContent.trim();
        const timeContent = content.replace(date, '').trim();
        const timeParts = timeContent.split('~');
        
        if (timeParts.length === 2) {
          const rowStartTime = `${date} ${timeParts[0].trim()}`;
          const rowEndTime = `${date} ${timeParts[1].trim()}`;
          
          if (rowStartTime === fullStartTime && rowEndTime === fullEndTime) {
            isDuplicate = true;
            break;
          }
        }
      }
    }
  }
  
  if (isDuplicate) {
    alert('이미 존재하는 시간 범위입니다.');
    return;
  }

  // 새 데이터만 데이터베이스에 추가
  fetch(`js/bop/add_normal_data_time.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newData)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      console.log('데이터 저장 성공:', result.message);
      loadNormalDataTable(); // 테이블 새로고침
    } else {
      console.error('데이터 저장 실패:', result.message, result);
      alert('데이터 저장에 실패했습니다: ' + result.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('서버 요청 중 오류가 발생했습니다.');
  });
}

///////////////////////////////////////////////////////////////////////////
// 삭제
function deleteSelectedRows() {
  const checkboxes = document.querySelectorAll('#normal-data-list-table input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert('삭제할 항목을 선택해주세요.');
    return;
  }

  if (!confirm(`선택한 ${checkboxes.length}개의 항목을 삭제하시겠습니까?`)) {
    return;
  }

  const dataToDelete = Array.from(checkboxes).map(checkbox => ({
    id: checkbox.dataset.id,
    type: parseInt(checkbox.dataset.type)
  }));

  fetch(`js/bop/delete_normal_data.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ data: dataToDelete })
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      checkboxes.forEach(checkbox => {
        checkbox.closest('tr').remove();
      });
      // console.log('데이터 삭제 성공:', result.message);
      loadNormalDataTable(); // 테이블 새로고침
      alert('선택한 항목이 성공적으로 삭제되었습니다.');
    } else {
      // console.error('데이터 삭제 실패:', result.message);
      alert('데이터 삭제에 실패했습니다: ' + result.message);
    }
  })
  .catch(error => {
    // console.error('Error:', error);
    alert('서버 요청 중 오류가 발생했습니다.');
  });
}

////////////////////////////////////////////////////////////////////////////
// 정상데이터생성(http://192.168.100.111:8082/api/nm_merge/ 여기로 보냄)
async function createNormalData() {
  const fileNameInput = document.getElementById('file-name-input');
  const fileName = fileNameInput.value.trim();
  if (!fileName) {
      alert('파일명을 입력해주세요.');
      return;
  }

  // URL에서 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlant = urlParams.get('plant');
  const urlGroup = urlParams.get('group');
  const urlFuelcell = urlParams.get('fuelcell');
  
  // getCurrentConfig와 URL 매개변수 둘 다 시도
  let config;
  try {
    config = await getCurrentConfig();
  } catch (error) {
    console.error('getCurrentConfig 오류:', error);
    config = {};
  }
  
  const powerplant_id = config.powerplant_id || urlPlant;
  const group_id = config.group_id || urlGroup;
  const fuelcell_id = config.fuelcell_id || urlFuelcell;
  
  console.log('정상데이터 생성 구성 정보:', { powerplant_id, group_id, fuelcell_id, urlSource: !!urlPlant });
  
  // 필수 값 검증
  if (!powerplant_id || !fuelcell_id) {
    alert('연료전지 정보를 찾을 수 없습니다.');
    return;
  }

   // 파일 존재 여부 확인 - URL 매개변수를 직접 전달
   const fileExists = await checkFileExists(fileName, powerplant_id, fuelcell_id);
   if (fileExists) {
       alert('이미 존재하는 파일명입니다. 다른 파일명을 입력해주세요.');
       fileNameInput.value = '';
       fileNameInput.focus();
       return;
   }

  const checkedItems = document.querySelectorAll('#normal-data-list-table input[type="checkbox"]:checked');
  if (checkedItems.length === 0) {
      alert('항목을 선택해주세요.');
      return;
  }

  const normalList = Array.from(checkedItems).map(checkbox => {
      const row = checkbox.closest('tr');
      const id = checkbox.dataset.id;
      const type = checkbox.dataset.type;
      const contentCell = document.getElementById(`content-${id}`);
      const content = contentCell ? contentCell.textContent.trim() : '';

      let s_time = '', e_time = '', f_name = '', date = '';

      if (type === '1') {
          const dateSpan = contentCell.querySelector('.date-div');
          date = dateSpan ? dateSpan.textContent.trim() : '';
          
          const timeContent = content.replace(date, '').trim();
          const timeParts = timeContent.split('~');
          
          if (date && timeParts.length === 2) {
              s_time = timeParts[0].trim().replace(/:/g, '-');
              e_time = timeParts[1].trim().replace(/:/g, '-');
              f_name = `raw_${fuelcell_id}_${date.replace(/-/g, '')}.csv`; // 실제로는 .lst로 들어간다. 백엔드 요청
          } 
      } else if (type === '2') {
          f_name = content;
      }

      return {
          id: parseInt(id),
          f_name,
          f_date: date, 
          s_time,
          e_time,
          type
      };
  });

  // 데이터 유효성 검사
  if (!normalList || normalList.length === 0) {
    alert('정상 목록을 생성할 수 없습니다.');
    return;
  }

  const data = {
      file_name: fileName,
      powerplant_id,
      group_id,
      fuelcell_id,
      normal_list: normalList
  };

  console.log('서버로 전송되는 데이터:', JSON.stringify(data, null, 2));

  try {
      const response = await fetch('http://192.168.100.111:8082/api/nm_merge/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json; charset=UTF-8', 
          },
          body: JSON.stringify(data),
          mode: 'cors'
      });

      if (!response.ok) {
          const errorText = await response.text();
          console.error('서버 응답:', errorText);
          throw new Error(`서버 응답 오류: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const result = await response.json();
      console.log('서버 응답:', result);
      if (result.status === 'success' || result.success) {
          alert('정상데이터가 성공적으로 생성되었습니다.');
          fileNameInput.value = '';
          await loadNormalDataTable();

           // 체크박스 해제
           const checkboxes = document.querySelectorAll('#normal-data-list-table input[type="checkbox"]');
           checkboxes.forEach(checkbox => {
               checkbox.checked = false;
           });

            // 전체 선택 체크박스 해제
            const selectAllCheckbox = document.getElementById('normal-data-select-all');
            if (selectAllCheckbox) {
                selectAllCheckbox.checked = false;
            }
      } else {
          console.error('정상데이터 생성 실패:', result.message || '알 수 없는 오류');
          alert('정상데이터 생성 중 오류가 발생했습니다: ' + (result.message || '알 수 없는 오류'));
      }
  } catch (error) {
      console.error('정상데이터 생성 중 오류 발생:', error);
      alert('정상데이터 생성 중 오류가 발생했습니다: ' + error.message);
  }
}

// 중복된 파일명 있으면 alert로 '중복된 파일명이 존재합니다.' 하고 #file-name-input '' 비워주고 커서넣어준다. 
async function checkFileExists(fileName, powerplantId, fuelcellId) {
  try {
    // 인자로 받은 powerplantId와 fuelcellId 사용
    const powerplant_id = powerplantId;
    const fuelcell_id = fuelcellId;
    
    // 값이 없을 경우 URL에서 가져오기
    if (!powerplant_id || !fuelcell_id) {
      const urlParams = new URLSearchParams(window.location.search);
      const plant = urlParams.get('plant');
      const fuelcell = urlParams.get('fuelcell');
      
      if (!plant || !fuelcell) {
        console.error('연료전지 정보를 찾을 수 없습니다.');
        return false;
      }
      
      powerplant_id = plant;
      fuelcell_id = fuelcell;
    }
    
    const response = await fetch(`js/bop/check_file_exists.php?powerplant_id=${encodeURIComponent(powerplant_id)}&fuelcell_id=${encodeURIComponent(fuelcell_id)}&file_name=${encodeURIComponent(fileName)}`);
    const result = await response.json();
    
    if (result.success) {
      return result.exists;
    } else {
      console.error('파일 존재 여부 확인 실패:', result.message);
      return false;
    }
  } catch (error) {
    console.error('파일 존재 여부 확인 중 오류 발생:', error);
    return false;
  }
}

///////////////////////////////////////////////////////////////////////////
// [LST추가] 버튼 누르면 #normal-data-modal 에 띄어주고
// get_normal_data_file_list.php 통해서 리스트 보여줌
async function bringNormalDataFileList() {
  // URL에서 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlant = urlParams.get('plant');
  const urlGroup = urlParams.get('group');
  const urlFuelcell = urlParams.get('fuelcell');
  
  // getCurrentConfig와 URL 매개변수 둘 다 시도
  let config;
  try {
    config = await getCurrentConfig();
  } catch (error) {
    console.error('getCurrentConfig 오류:', error);
    config = {};
  }
  
  const powerplant_id = config.powerplant_id || urlPlant;
  const group_id = config.group_id || urlGroup;
  const fuelcell_id = config.fuelcell_id || urlFuelcell;
  
  console.log('LST 추가 구성 정보:', { powerplant_id, group_id, fuelcell_id, urlSource: !!urlPlant });

  if (!powerplant_id || !fuelcell_id) {
    alert('연료전지 정보를 찾을 수 없습니다.');
    return;
  }

  fetch(`js/bop/get_normal_data_file_list.php?powerplant_id=${encodeURIComponent(powerplant_id)}&fuelcell_id=${encodeURIComponent(fuelcell_id)}`)
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      const fileList = document.getElementById('list-of-filenames');

      if (!fileList) {
        console.error('파일 목록 요소를 찾을 수 없습니다: list-of-filenames');
        return;
      }
      
      // 기존 목록 초기화
      fileList.innerHTML = '';

        if (result.files.length === 0) {
          const row = fileList.insertRow();
          const cell = row.insertCell(0);
          cell.colSpan = 2;
          cell.textContent = '파일이 없습니다.';
        } else {
          // 파일 목록 생성
          result.files.forEach(file => {
            const row = fileList.insertRow();
            const checkboxCell = row.insertCell(0);
            const fileNameCell = row.insertCell(1);
            
            checkboxCell.innerHTML = `<input type="checkbox" data-filename="${file}">`;
            fileNameCell.textContent = file;
          });
        }

        // 전체 선택 체크박스 이벤트 리스너 추가
        const selectAllCheckbox = document.getElementById('select-all-files');
        if (selectAllCheckbox) {
          selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = fileList.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
              checkbox.checked = this.checked;
            });
          });
        }

        // 모달 표시
        modalSW('#normal-data-modal', 'open');
      } else {
        console.error('파일 목록 로딩 실패:', result.message);
        alert('파일 목록을 불러오는 중 오류가 발생했습니다.');
      }
    })
    .catch(error => {
      console.error('파일 목록 로딩 중 오류 발생:', error);
      alert('파일 목록을 불러오는 중 오류가 발생했습니다.');
    });
}

// [파일추가] 모달에서 [확인] 버튼 클릭 시, api_normaldata 테이블로 데이터 추가
async function addSelectedFiles() {
  const fileList = document.getElementById('list-of-filenames');
  const selectedFiles = Array.from(fileList.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.getAttribute('data-filename'));

  if (selectedFiles.length === 0) {
    alert('파일을 선택해주세요.');
    return;
  }

  // URL에서 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlant = urlParams.get('plant');
  const urlGroup = urlParams.get('group');
  const urlFuelcell = urlParams.get('fuelcell');
  
  // getCurrentConfig와 URL 매개변수 둘 다 시도
  let config;
  try {
    config = await getCurrentConfig();
  } catch (error) {
    console.error('getCurrentConfig 오류:', error);
    config = {};
  }
  
  const powerplant_id = config.powerplant_id || urlPlant;
  const group_id = config.group_id || urlGroup;
  const fuelcell_id = config.fuelcell_id || urlFuelcell;

  if (!powerplant_id || !fuelcell_id) {
    alert('연료전지 정보를 찾을 수 없습니다.');
    return;
  }

  const data = {
    powerplant_id,
    group_id,
    fuelcell_id,
    files: selectedFiles
  };

  fetch(`js/bop/add_new_file_name.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert('파일이 성공적으로 추가되었습니다.');
      modalSW('#normal-data-modal', 'close');
      loadNormalDataTable(); // 테이블 다시 불러오기
    } else {
      // 오류 메시지 처리
      let errorMessage = '파일 추가 중 오류가 발생했습니다.';
      if (result.message && result.message.includes('Duplicate entry')) {
        errorMessage = '중복되는 파일명이 있습니다.';
      }
      alert(errorMessage);
    }
  })
  .catch(error => {
    console.error('파일 추가 중 오류 발생:', error);
    alert('파일 추가 중 오류가 발생했습니다.');
  });
}

// append lst 불러오는 함수. bringNormalDataFileList()랑 같은 리스트를 불러오지만, 모달안에 내용이  달라지기에 이 함수도 존재.
function bringNormalDataFileListForAppend() {
  const fileModal = document.getElementById('normal-data-modal');
  if (!fileModal) {
    return;
  }

  // URL에서 매개변수 가져오기
  const urlParams = new URLSearchParams(window.location.search);
  const urlPlant = urlParams.get('plant');
  const urlGroup = urlParams.get('group');
  const urlFuelcell = urlParams.get('fuelcell');
  
  // getCurrentConfig와 URL 매개변수 둘 다 시도
  let config;
  try {
    config = getCurrentConfig();
  } catch (error) {
    console.error('getCurrentConfig 오류:', error);
    config = {};
  }
  
  const powerplant_id = config.powerplant_id || urlPlant;
  const group_id = config.group_id || urlGroup;
  const fuelcell_id = config.fuelcell_id || urlFuelcell;

  if (!powerplant_id || !fuelcell_id) {
    alert('연료전지 정보를 찾을 수 없습니다.');
    return;
  }

  fetch(`js/bop/get_normal_data_file_list.php?powerplant_id=${encodeURIComponent(powerplant_id)}&fuelcell_id=${encodeURIComponent(fuelcell_id)}`)
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        const fileList = document.getElementById('list-of-filenames');
        if (!fileList) {
          console.error('파일 목록 요소를 찾을 수 없습니다: list-of-filenames');
          return;
        }
        
        fileList.innerHTML = '';

        if (result.files.length === 0) {
          const row = fileList.insertRow();
          const cell = row.insertCell(0);
          cell.colSpan = 2;
          cell.textContent = '파일이 없습니다.';
        } else {
          result.files.forEach(file => {
            const row = fileList.insertRow();
            const checkboxCell = row.insertCell(0);
            const fileNameCell = row.insertCell(1);
            
            checkboxCell.innerHTML = `<input type="checkbox" data-filename="${file}">`;
            fileNameCell.textContent = file;
          });
        }

        const selectAllCheckbox = document.getElementById('select-all-files');
        if (selectAllCheckbox) {
          selectAllCheckbox.addEventListener('change', function() {
            const checkboxes = fileList.querySelectorAll('input[type="checkbox"]');
            checkboxes.forEach(checkbox => {
              checkbox.checked = this.checked;
            });
          });
        }

        // 모달 제목 변경
        const modalTitle = fileModal.querySelector('.modal--title');
        if (modalTitle) {
          modalTitle.textContent = 'LST 생성(append)';
        }

        // 확인 버튼을 append 버튼으로  변경
        const confirmButton = document.getElementById('add-file-name-confirm-btn');
        if (confirmButton) {
          confirmButton.id = 'append-file-name-btn';
          confirmButton.textContent = '추가';
          confirmButton.onclick = appendSelectedFiles;
        }

        modalSW('#normal-data-modal', 'open');
      } else {
        console.error('파일 목록 로딩 실패:', result.message);
        alert('파일 목록을 불러오는 중 오류가 발생했습니다.');
      }
    })
    .catch(error => {
      console.error('파일 목록 로딩 중 오류 발생:', error);
      alert('파일 목록을 불러오는 중 오류가 발생했습니다.');
    });
}

// appendSelectedFiles 함수
async function appendSelectedFiles() {
  const fileList = document.getElementById('list-of-filenames');
  const selectedFiles = Array.from(fileList.querySelectorAll('input[type="checkbox"]:checked'))
    .map(checkbox => checkbox.getAttribute('data-filename'));

  if (selectedFiles.length === 0) {
    alert('파일을 선택해주세요.');
    return;
  }

  // 현재 화면의 날짜와 시간 수집
  const existingDateTimes = Array.from(document.querySelectorAll('#normal-data-list-table tr'))
    .filter(row => row.querySelector('[data-type="1"]')) // type=1인 행만 선택
    .map(row => {
      const content = row.querySelector('[id^="content-"]').textContent;
      const date = row.querySelector('.date-div').textContent;
      const times = content.split(date)[1].trim().split('~');
      return {
        date: date,
        startTime: times[0],
        endTime: times[1]
      };
    });

  const { powerplant_id, group_id, fuelcell_id } = await getCurrentConfig();
  
  const data = {
    powerplant_id,
    group_id,
    fuelcell_id,
    files: selectedFiles,
    existingDateTimes  // 날짜와 시간 정보를 모두 전달
  };

  fetch(`js/bop/append_lst_into_data.php`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      if (result.duplicates && result.duplicates.length > 0) {
        alert('이미 존재하는 날짜입니다:\n' + result.duplicates.join('\n'));
      }
      if (result.added && result.added.length > 0) {
        // alert('날짜 목록이 성공적으로 추가되었습니다:\n' + result.added.join('\n'));
      }
      modalSW('#normal-data-modal', 'close');
      loadNormalDataTable();
    } else {
      alert('데이터 추가 중 오류가 발생했습니다: ' + result.message);
    }
  })
  .catch(error => {
    console.error('데이터 추가 중 오류 발생:', error);
    alert('데이터 추가 중 오류가 발생했습니다.');
  });
}
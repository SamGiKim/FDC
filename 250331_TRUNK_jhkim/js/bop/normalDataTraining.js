import { getCurrentConfig } from '../config/fuelcellSelector.js'; 

// 이벤트 리스너 등록
document.addEventListener('DOMContentLoaded', () => {
  const addButton = document.getElementById('normal-data-model-add-btn');
  if (addButton) {
    addButton.addEventListener('click', handleButtonClick);
  }
});

// 모델 이름 유효성 검증
function validateModelName(modelName) {
  return modelName.trim() !== '';
}

// 날짜를 YYYYMMDD 형식으로 포맷하는 함수
function formatDateForFileName(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year}${month.padStart(2, '0')}${day.padStart(2, '0')}`;
}

// 날짜를 YYYY-MM-DD 형식으로 포맷하는 함수
function formatDateForFileDate(dateString) {
  const [year, month, day] = dateString.split('-');
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// 시간 형식 변환 함수
function formatTime(timeString) {
  return timeString.replace(/:/g, '-');
}

// 체크된 항목들을 기반으로 파일 목록 생성
function generateNormalList(checkboxes) {
  return Array.from(checkboxes).map(checkbox => {
    const row = checkbox.closest('tr');
    const id = checkbox.getAttribute('data-id');
    let type;
    const contentCell = row.querySelector(`#content-${id}`);
    const contentText = contentCell.textContent.trim();

    // 형식 A인지 B인지 판단
    if (isFormatA(contentText)) {
      // 형식 A 처리
      type = '1'; // 형식 A의 경우 type을 '1'로 설정
      const [dateDiv, timeRange] = contentText.split(/(\d{2}:\d{2}:\d{2}~\d{2}:\d{2}:\d{2})/).map(text => text.trim());

      const formattedDateForFileName = formatDateForFileName(dateDiv); // YYYYMMDD 형식
      const formattedDateForFileDate = formatDateForFileDate(dateDiv); // YYYY-MM-DD 형식

      return {
        id,
        f_name: `raw_${fuelcell_id}_${formattedDateForFileName}.csv`,
        f_date: formattedDateForFileDate,
        s_time: formatTime(timeRange.split('~')[0]),
        e_time: formatTime(timeRange.split('~')[1]),
        type
      };
    } else {
      // 형식 B 처리 
      type = '2'; // 형식 B의 경우 type을 '2'로 설정
      const f_name = contentText; // 파일 이름 그대로 사용

      return {
        id,
        f_name,
        type
      };
    }
  });
}

// 형식 A인지 판단하는 함수
function isFormatA(text) {
  // 날짜(YYYY-MM-DD)로 시작하는지 확인
  return /^\d{4}-\d{2}-\d{2}/.test(text);
}

// POST 요청 전송
function sendPostRequest(url, data) {
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data),
    mode: 'cors'
  }).then(response => response.json());
}

// 메인 함수
function handleButtonClick() {
  const modelNameInput = document.getElementById('normal-data-model-name');
  const modelName = modelNameInput.value; // Access value directly from input
  if (!validateModelName(modelName)) {
    alert('모델 이름을 입력해주세요.');
    return;
  }

  const checkboxes = document.querySelectorAll('#normal-data-list-table input[type="checkbox"]:checked');
  if (checkboxes.length === 0) {
    alert('하나 이상의 체크박스를 선택해주세요.');
    return;
  }

  const {powerplant_id, group_id, fuelcell_id} = getCurrentConfig();
  const normalList = generateNormalList(checkboxes);  

  const requestData = {
    file_name: modelName,
    powerplant_id,
    group_id,
    fuelcell_id,
    normal_list: normalList
  };

  // 서버로 전송되는 데이터 로깅
  console.log('서버로 전송되는 데이터:', JSON.stringify(requestData, null, 2));

  sendPostRequest('http://192.168.100.111:8082/api/nm_training/', requestData)
    .then(result => {
      alert('데이터가 성공적으로 전송되었습니다.');
      // 서버 응답을 JSON 문자열로 변환하여 출력
      console.log('서버 응답:', result);
      // 입력 필드 비우기
      modelNameInput.value = '';

      // 체크박스 선택 해제
      checkboxes.forEach(checkbox => checkbox.checked = false);
      // 전체 선택 체크박스 해제
      const selectAllCheckbox = document.getElementById('normal-data-select-all');
      if (selectAllCheckbox) {
        selectAllCheckbox.checked = false;
      }
    })
    .catch(error => {
      alert('데이터 전송 중 오류가 발생했습니다.');
      console.error('오류 발생:', error);
    });
}

import { getCurrentConfig } from "../config/fuelcellSelector.js";

// 추가시 모달을 띄워서 추가하는 방식으로 바꾼 코드!

export const errorCodeMapping = {
  // err_code : 'err_name'
  0: '정상',
  1: 'MFM 전 누설',
  2: 'MFM 후 누설',
  3: '블로워',
  4: '유량센서',
  5: '압력센서',
  6: '가습기',
  7: '스택 입구 온도센서(물)',
  8: '스택 출구 온도센서(물)',
  9: '열교환기',
  10: '1차 냉각수 펌프',
  11: '2차 냉각수 펌프',
  12: '스택 입구 온도센서(열)',
  13: '스택 출구 온도센서(열)',
  14: '열교환기 출구 온도센서',
  15: '공기 부족',       
  16: '수소 부족',
  30: '가동준비', 
  31: '정상복귀',
  32: 'CO피독'        
};

// 모든 함수를 BopSensorLabeling 객체 내에 그룹화시킴
const BopSensorLabeling = {

  // 이벤트 리스너 초기화 함수 시작
  initEventListeners: function() {
    // 필요한 모든 요소들을 먼저 찾기
    const elements = {
        addButton: document.getElementById('add-sensor-labeling-data'),
        detailButton: document.getElementById('sensor-labeling-data-detail-btn'),
        searchButton: document.getElementById('search-sensor-labeling-data-btn'),
        resetButton: document.getElementById('reset-sensor-labeling-data-btn'),
        editButton: document.getElementById('edit-sensor-labeling-data'),
        deleteButton: document.getElementById('delete-sensor-labeling-data')
    };

    // 페이지에 필요한 요소들이 없으면 조용히 리턴
    const hasRequiredElements = Object.values(elements).some(element => element !== null);
    if (!hasRequiredElements) {
        // console.log('BOP Sensor Labeling elements not found in this page');
        return;
    }

    // 각 요소가 존재할 때만 이벤트 리스너 추가
    if (elements.addButton) {
        elements.addButton.addEventListener('click', () => {
            this.addTimePeriodToSensorLabeling();
        });
    }

    if (elements.detailButton) {
        elements.detailButton.addEventListener('click', () => {
            this.handleDetailButtonClick();
        });
    }

    if (elements.editButton) {
        elements.editButton.addEventListener('click', this.updateSensorLabelingData.bind(this));
    }

    if (elements.deleteButton) {
        elements.deleteButton.addEventListener('click', this.deleteSensorLabelingData.bind(this));
    }

    if (elements.searchButton) {
        elements.searchButton.addEventListener('click', () => {
            this.pagination.currentPage = 1;
            this.fetchSensorLabelingData({isSearch: true});
        });
    }

    if (elements.resetButton) {
        elements.resetButton.addEventListener('click', () => {
            document.getElementById('bop-error-codes-search').value = '';
            this.pagination.currentPage = 1;
            this.fetchSensorLabelingData();
        });
    }
},
  // 이벤트 리스터 초기화 함수 끝
  
   // 상세 보기 버튼 리스너 초기화
  initDetailButtonListener: function() {
    const tableBody = document.querySelector('#bop-labeling-data-table-db tbody');
    const detailButton = document.getElementById('sensor-labeling-data-detail-btn');

    if (tableBody && detailButton) {
      tableBody.addEventListener('change', function(event) {
        if (event.target.type === 'checkbox') {
          const checkboxes = tableBody.querySelectorAll('input[type="checkbox"]');
          checkboxes.forEach(checkbox => {
            if (checkbox !== event.target) {
              checkbox.checked = false;
            }
          });
        }
      });
    }
  },


  // 새로운 함수: 날짜 클릭 이벤트 리스너 초기화
  initDateClickListeners: function() {
    const tableBody = document.querySelector('#bop-labeling-data-table-db tbody');
    
    // 테이블이 존재하지 않으면 조용히 리턴
    if (!tableBody) {
        // console.log('BOP Labeling table not found in this page');
        return;
    }

    tableBody.addEventListener('click', (event) => {
        if (event.target.classList.contains('date-div')) {
            const parentRow = event.target.closest('tr');
            const stime = parentRow.getAttribute('stime');
            
            // 날짜 정보 추출
            const dateParts = stime.split(' ')[0].split('-');
            const year = parseInt(dateParts[0], 10);
            const month = parseInt(dateParts[1], 10);
            const day = parseInt(dateParts[2], 10);
    
            // 커스텀 이벤트 발생
            const resetEvent = new CustomEvent('resetCalendex', {
                detail: { year, month, day }
            });
            document.dispatchEvent(resetEvent);
    
            // 새로운 기능: 이벤트 데이터 가져오기
            this.fetchEventData(year, month, day);
        }
    });
},

  fetchEventData: function(year, month, day) {
    const {powerplant_id, fuelcell_id} = getCurrentConfig();
    const url = `js/bop/get_event.php?y=${year}&m=${month}&d=${day}&powerplant_id=${powerplant_id}&fuelcell_id=${fuelcell_id}`;
    
    fetch(url)
      .then(response => response.text())
      .then(data => {
        this.processEventData(data);
      })
      // .catch(error => console.error('Error fetching event data:', error));
  },
  
  processEventData: function(data) {
    const events = data.split('\n').filter(line => line.trim() !== '' && !line.startsWith('CSV file created'));
    events.forEach(event => {
      const [type, startTime, endTime, eventType, value, ...rest] = event.split(',');
      if (type === '0') {
        const [errCode, history] = rest;
        // console.log(`API Event: ${startTime} - ${endTime}, Type: ${eventType}, Value: ${value}, Error Code: ${errCode}, History: ${history}`);
      } else if (type === '1') {
        const [merr, bigo, ci, stm, hzFrom, hzTo] = rest;
        // console.log(`Search Event: ${startTime} - ${endTime}, Type: ${eventType}, Value: ${value}, MERR: ${merr}, BIGO: ${bigo}, Additional Info: ${ci}, ${stm}, ${hzFrom}, ${hzTo}`);
      }
    });
  },


   // 전체 체크박스 상태를 토글하는 함수
   toggleAllCheckboxes: function(checked) {
    const checkboxes = document.querySelectorAll('#bop-labeling-data-table-db input[type="checkbox"]');
    checkboxes.forEach(checkbox => {ㅐ
      checkbox.checked = checked;
    });
  },




    // 페이지네이션
    pagination:{
      currentPage:1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0
    },
  
    // 페이지네이션 UI 업데이트
    updatePagination: function() {
      const paginationElement = document.getElementById('bop-labeling-data-pagination');
      if (!paginationElement) {
          return;
      }
  
      // 총 페이지 수 계산
      const totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
      
      // 표시할 페이지 범위 계산
      let startPage = Math.max(1, this.pagination.currentPage - 2);
      let endPage = Math.min(totalPages, startPage + 4);
      
      // startPage 재조정 (endPage가 totalPages에 가까울 때)
      startPage = Math.max(1, endPage - 4);
  
      let paginationHTML = '';
      
      // 처음 페이지로 이동 버튼
      paginationHTML += `
          <li class="page-item ${this.pagination.currentPage === 1 ? 'disabled' : ''}">
              <a class="page-link" href="#" data-page="1">&laquo;</a>
          </li>
      `;
  
      // 페이지 번호들
      for (let i = startPage; i <= endPage; i++) {
          paginationHTML += `
              <li class="page-item ${i === this.pagination.currentPage ? 'active' : ''}">
                  <a class="page-link" href="#" data-page="${i}">${i}</a>
              </li>
          `;
      }
  
      // 마지막 페이지 버튼
      paginationHTML += `
          <li class="page-item ${this.pagination.currentPage === totalPages ? 'disabled' : ''}">
              <a class="page-link" href="#" data-page="${totalPages}">&raquo;</a>
          </li>
      `;
  
      paginationElement.innerHTML = paginationHTML;
  
      // 페이지네이션 클릭 이벤트 추가
      paginationElement.querySelectorAll('.page-link').forEach(link => {
          link.addEventListener('click', (e) => {
              e.preventDefault();
              const pageNum = parseInt(e.target.dataset.page);
              
              // 유효한 페이지 번호인지 확인
              if (!isNaN(pageNum) && pageNum > 0 && pageNum <= totalPages) {
                  this.pagination.currentPage = pageNum;
                  this.fetchSensorLabelingData();
              }
          });
      });
  
      // 디버깅용 로그
      console.log('페이지네이션 업데이트:', {
          현재페이지: this.pagination.currentPage,
          총항목수: this.pagination.totalItems,
          페이지당항목수: this.pagination.itemsPerPage,
          총페이지수: totalPages,
          시작페이지: startPage,
          끝페이지: endPage
      });
  },
  
   
    // 페이지네이션 이벤트 리스너
    initPaginationEventListners: function(){
      const paginationElement = document.getElementById('bop-labeling-data-pagination');
      if(!paginationElement) return;
  
      this.pagination.addEventListener('click', (e) => {
        e.preventDefault();
        const pageLink = e.target.closest('.page-link');
        if(!pageLink) return;
  
        const page = pageLink.dataset.page;
        if(page ==='prev'){
          this.pagination.currentPage = Math.max(1, this.pagination.currentPage -1);
        }else if(page==='next'){
          this.pagination.currentPage = Math.min(this.pagination.totalPages, this.pagination.currentPage+1);
        }else{
          this.pagination.currentPage = parseInt(page);
        }
  
        this.fetchSensorLabelingData();
      })
    },

    

  // 데이터 조회 및 검색(필터) 기능 통합 함수
  fetchSensorLabelingData: async function(searchParams = {}) {
    const { powerplant_id, fuelcell_id } = await getCurrentConfig();
    
    let params = {
        powerplant_id,
        fuelcell_id,
        page: this.pagination.currentPage,
        itemsPerPage: this.pagination.itemsPerPage
    };

    // 검색 버튼을 통한 요청일 경우에만 에러 코드 체크
    if (searchParams.isSearch) {
        const errorCode = document.getElementById('bop-error-codes-search').value;
        if (!errorCode) {
            alert('에러 코드를 선택해주세요.');
            return;
        }
        params.err_code = errorCode;
    }

    // 디버깅을 위한 로그
    console.log('요청 파라미터:', params);

    fetch('js/bop/get_sensor_labeling_data.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params)
    })
    .then(response => {
        // 응답 상태 확인
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
     // fetchSensorLabelingData 함수 내에서 성공 시 처리 부분 수정
  .then(data => {
    console.log('서버 응답:', data);
    
    if (data.success) {
        this.pagination.totalItems = data.total;
        this.pagination.currentPage = data.currentPage;
        this.pagination.itemsPerPage = data.itemsPerPage;
        
        this.displaySensorLabelingData(data.data);
        this.updatePagination(); // 페이지네이션 UI 업데이트
    } else {
        throw new Error(data.message || '서버에서 오류가 발생했습니다.');
    }
})
    .catch(error => {
        // console.error('상세 에러 정보:', error);
        console.warn(`데이터 조회 중 오류가 발생했습니다: ${error.message}`);
    });
},



  /*
   fetchSensorLabelingData: function () {
    const { powerplant_id, fuelcell_id } = getCurrentConfig();
     fetch('js/bop/get_sensor_labeling_data.php', {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json',
       },
       body: JSON.stringify({ 
        powerplant_id,
        fuelcell_id,
        page: this.pagination.currentPage,
        itemsPerPage:this.pagination.itemsPerPage
        })
     })
     .then(response => response.json())
     .then(data=>{
      if(data.success){
        this.pagination.totalItems = data.total;
        this.displaySensorLabelingData(data.data);
        this.updatePagination();
      }else{
        throw new Error(data.message);
      }
     })
     .catch(error=>{
      console.error('fetchSensorLabelingData 오류:' , error);
      alert(`데이터 조회 중 오류 발생: ${error.message}`);
     });
   },
   */

displaySensorLabelingData: function(data) {
  // console.log('표시할 데이터:', data); // 디버깅용 로그
  if (!Array.isArray(data)) {
    // console.error('데이터가 배열이 아닙니다:', data);
    alert('데이터 형식이 올바르지 않습니다.');
    return;
  }

  const tableBody = document.querySelector('#bop-labeling-data-table-db tbody');
  if (!tableBody) {
    // console.warn('bop-labeling-data-table-db 요소가 없습니다. 이 페이지에서는 스크립트를 실행하지 않습니다.');
    return;
  }

  tableBody.innerHTML = ''; // 기존 데이터 초기화

  data.forEach(item => {
    if (!item || typeof item !== 'object') {
      // console.error('유효하지 않은 항목:', item);
      return; // 이 항목을 건너뛰고 다음 항목으로 진행
    }

    // 소수점 이하의 초 제거
    const startDateTimeStr = item.s_date.replace(/\.\d{6}$/, ''); // .000000 제거
    const endDateTimeStr = item.e_date.replace(/\.\d{6}$/, '');   // .000000 제거

    // history가 null일 때 '-'로 표시
    const historyStr = item.history ? item.history : '-'; 

    // err_code를 정수로 처리하고 매핑된 err_name 가져오기
    const errCode = parseInt(item.err_code);
    const errName = errorCodeMapping[errCode] || `알 수 없는 에러 (코드: ${errCode})`;

    const row = document.createElement('tr');
    row.setAttribute('stime', item.s_date);
    row.setAttribute('etime', item.e_date);
    row.setAttribute('fuelcell_id', item.fuelcell_id); 
    row.setAttribute('data-id', item.id);
    row.innerHTML = `
      <td><input type="checkbox" data-id="${item.id}"></td>
      <td title="${startDateTimeStr}~${endDateTimeStr}"><span class="date-div" style="cursor: pointer;">${startDateTimeStr.split(' ')[0]} </span>${startDateTimeStr.split(' ')[1]}~${endDateTimeStr.split(' ')[1]}</td>
      <td title="${historyStr}"><span class="label-text" data-err-code="${errCode}">${errName}</span></td>
      <td title="${historyStr}">${historyStr}</td>
    `;
    tableBody.appendChild(row);
  });
  this.initDateClickListeners();  // 날짜요소 클릭하면 중간에 그래프 바뀌도록
},

/////////////////////////////////////////////////////////////////////////
// 센서 라벨링 모달 데이터 설정 함수
setSensorLabelingModalData: async function(mode) {
  // 새로운 데이터 추가할 경우
  if(mode === 'add'){
    const startTime = document.getElementById('start_t').value;
    const endTime = document.getElementById('end_t').value;
    const { powerplant_id, group_id, fuelcell_id, name } = getCurrentConfig();
      
    // 선택된 날짜 가져오기
    const selectedDate = document.querySelector('.selected-box .date-div').textContent.trim();
    // 날짜와 시간 조합
    const fullStartTime = `${selectedDate} ${startTime}`;
    const fullEndTime = `${selectedDate} ${endTime}`;

    // 모달의 입력 필드에 값 설정
    document.getElementById('period-start').value = fullStartTime;
    document.getElementById('period-end').value = fullEndTime;
    document.getElementById('stack-name').textContent = `${name} (${fuelcell_id})`;

    
    // 필드 초기화
    document.getElementById('bop-error-codes').value = '';
    document.getElementById('test-temperature').value = '';
    document.getElementById('humidity').value = '';
    document.getElementById('history').value = '';
  }else if(mode === 'detail'){
    // 상세보기 모드일때에는 db에서 가져온 데이터 사용
  }
},

clearModalData: function() {
  // 모달의 모든 입력 필드를 초기화
  document.getElementById('period-start').value = '';
  document.getElementById('period-end').value = '';
  document.getElementById('stack-name').textContent = '';
  document.getElementById('bop-error-codes').value = '';
  document.getElementById('test-temperature').value = '';
  document.getElementById('humidity').value = '';
  document.getElementById('history').value = '';
},


  //////////////////////////////////////////////////////////////////////
  //[상세보기]
  handleDetailButtonClick: function() {
    const selectedCheckbox = document.querySelector('#bop-labeling-data-table-db input[type="checkbox"]:checked');

    if (!selectedCheckbox) {
      alert('데이터를 하나 선택해주세요.');
      // 모달 초기화
      this.clearModalData();
      return; // 선택된 항목이 없으면 함수 종료
    }
    
    // 체크박스의 부모 <tr> 요소에서 data-id 속성 가져오기
    const parentRow = selectedCheckbox.closest('tr');
    const dataId = parentRow.getAttribute('data-id');
    // console.log('Selected data ID from <tr>:', dataId); // 콘솔에 출력하여 확인
   
    // 데이터 가져오기
    this.fetchDataForModal(dataId);
  },

  fetchDataForModal: function(dataId) {
    fetch(`js/bop/get_sensor_labeling_data_by_id.php?id=${dataId}`)
      .then(response => response.json())
      .then(data => {
        console.log('Fetched data:', data); // 서버에서 반환된 데이터를 콘솔에 출력
        if (data.success) {
          this.populateModalWithData(data.data);

          // 데이터가 성공적으로 가져와졌을 때만 모달 열기
          modalSW('#sensor-labeling-modal', 'open', 'detail');
        } else {
          alert('데이터를 가져오는 데 실패했습니다.');
        }
      })
      .catch(error => {
        // console.error('Error fetching data:', error);
        alert('서버 요청 중 오류가 발생했습니다.');
      });
  },

    populateModalWithData: function(data) {
    // 발전소 이름과 스택 이름 설정
    document.getElementById('plant-name').textContent = data.plantName || '-';
    document.getElementById('stack-name').textContent = data.fuelcell_id || '-';

    // 기간 설정 (마이크로초 제거)
    const formatDate = (dateString) => {
      if (!dateString) return '';
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    document.getElementById('period-start').value = formatDate(data.s_date);
    document.getElementById('period-end').value = formatDate(data.e_date);

   // 에러 코드 설정
   const errorCodeSelect = document.getElementById('bop-error-codes');
   if (data.err_code !== null && data.err_code !== undefined) {
     errorCodeSelect.value = data.err_code.toString(); // padStart 제거
   } else {
     errorCodeSelect.value = '';
   }

    // 시험 온도 설정
    document.getElementById('test-temperature').value = data.temperture || '';

    // 습도 설정
    document.getElementById('humidity').value = data.humidity || '';

    // 실험 내역 설정
    document.getElementById('history').value = data.history || '';
},


/////////////////////////////////////////////////////////////////////////
// [수정] through [상세보기]
updateSensorLabelingData() {
  if (!confirm('정말 수정하시겠습니까?')) {
    return; // 사용자가 취소를 선택한 경우 함수 종료
  }

  const dataId = document.querySelector('#bop-labeling-data-table-db input[type="checkbox"]:checked').closest('tr').getAttribute('data-id');
  const errorCode = document.getElementById('bop-error-codes').value;
  const startDate = document.getElementById('period-start').value;
  const endDate = document.getElementById('period-end').value;
  const humidity = parseFloat(document.getElementById('humidity').value);
  const temperature = parseFloat(document.getElementById('test-temperature').value);
  const history = document.getElementById('history').value.trim();

  if (!dataId || !errorCode || isNaN(humidity) || isNaN(temperature)) {
    alert('모든 필드를 올바르게 입력해주세요.');
    return;
  }

  const updateData = {
    id: dataId,
    err_code: errorCode,
    s_date: startDate,
    e_date: endDate,
    humidity: humidity,
    temperture: temperature,
    history: history
  };

  fetch('js/bop/update_sensor_labeling_data.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(updateData)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert('데이터가 성공적으로 업데이트되었습니다.');
      modalSW('#sensor-labeling-modal', 'close');
      this.fetchSensorLabelingData(); // 테이블 데이터 새로고침
    } else {
      alert('업데이트 실패: ' + result.message);
    }
  })
  .catch(error => {
    // console.error('Error:', error);
    alert('서버 요청 중 오류가 발생했습니다.');
  });
},


//////////////////////////////////////////////////////////////////////
// [추가]
  addTimePeriodToSensorLabeling: async function() {
    if (!confirm('정말 추가하시겠습니까?')) {
      return; // 사용자가 취소를 선택한 경우 함수 종료
    }
    
    const startTime = document.getElementById('start_t').value;
    const endTime = document.getElementById('end_t').value;
    const { powerplant_id, group_id, fuelcell_id } = getCurrentConfig();
    const errorCode = document.getElementById('bop-error-codes').value;

    console.log('Selected errorCode:', errorCode); // 디버깅용 로그
  
    const testTemperature = parseFloat(document.getElementById('test-temperature').value);
    const humidity = parseFloat(document.getElementById('humidity').value);
    const history = document.getElementById('history').value.trim(); // history 값 가져오기
  
    // 입력 값 검증
    if (!startTime || !endTime || !errorCode || isNaN(testTemperature) || isNaN(humidity)) {
      alert('기간, 에러코드, 온도 및 습도를 정확히 입력해주세요.');
      return;
    }
  
    const currentDate = document.querySelector('.selected-box .date-div').textContent.trim();
    const fullStartTime = `${currentDate} ${startTime}`;
    const fullEndTime = `${currentDate} ${endTime}`;
  
    // 에러 코드를 정수로 변환
    const errorCodeInt = parseInt(errorCode, 10);
    console.log('Parsed errorCodeInt:', errorCodeInt); // 디버깅용 로그

    // 에러 코드에 해당하는 err_info 설정
    const err_name = errorCodeMapping[errorCodeInt] || `알 수 없는 에러 (코드: ${errorCode})`;
  
    const newData = {
      s_date: fullStartTime,
      e_date: fullEndTime,
      powerplant_id,
      group_id,
      fuelcell_id,
      err_code: errorCodeInt,
      err_name: err_name,
      humidity: humidity,
      temperture: testTemperature,
      history: history // history 추가
    };
  
  
    // 데이터베이스에 저장
    fetch('js/bop/add_sensor_labeling_data.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(newData)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        alert('데이터가 성공적으로 저장되었습니다.');
        // 모달 닫기
      modalSW('#sensor-labeling-modal', 'close');
      // 입력 필드 초기화
      document.getElementById('bop-error-codes').value = '';
      document.getElementById('test-temperature').value = '';
      document.getElementById('humidity').value = '';
      document.getElementById('history').value = '';
      // 테이블 데이터 새로고침
      this.fetchSensorLabelingData();
      } else {
        console.error('데이터 저장 실패:', result.message);
        alert('데이터 저장에 실패했습니다: ' + result.message);
      }
    })
    .catch((error) => {
      console.error('Error:', error);
      alert('서버 요청 중 오류가 발생했습니다.');
    });
  },
  
  /////////////////////////////////////////////////////////////////////////
// [삭제 ]through [상세보기]
deleteSensorLabelingData: function() {
  if (!confirm('정말 삭제하시겠습니까?')) {
    return; // 사용자가 취소를 선택한 경우 함수 종료
  }

  // 모달에서 현재 항목의 data-id 가져옴
  const dataId = document.querySelector('#bop-labeling-data-table-db input[type="checkbox"]:checked').closest('tr').getAttribute('data-id');

  if (!dataId) {
    alert('삭제할 항목을 찾을 수 없습니다.');
    return;
  }

  const deleteData = [{ id: dataId }];

  // 서버에 삭제 요청
  fetch('js/bop/delete_sensor_labeling_data.php', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(deleteData)
  })
  .then(response => response.json())
  .then(result => {
    if (result.success) {
      alert(result.message);
      // 모달 닫기
      modalSW('#sensor-labeling-modal', 'close');
      // 테이블 새로 고침
      this.fetchSensorLabelingData();
    } else {
      console.error('데이터 삭제 실패:', result.message);
      alert('데이터 삭제에 실패했습니다: ' + result.message);
    }
  })
  .catch((error) => {
    console.error('Error:', error);
    alert('서버 요청 중 오류가 발생했습니다.');
  });
}

};

// 전역 객체에 메서드 추가
window.setSensorLabelingModalData = BopSensorLabeling.setSensorLabelingModalData.bind(BopSensorLabeling);
window.BopSensorLabeling = BopSensorLabeling;

// 페이지 로드 시 이벤트 리스너 초기화
document.addEventListener('DOMContentLoaded', function() {
  try {
      BopSensorLabeling.initEventListeners();
      BopSensorLabeling.fetchSensorLabelingData(); // 페이지 로드 시 데이터 가져오기
      BopSensorLabeling.initDateClickListeners(); // 날짜 클릭 이벤트 리스너 초기화
      BopSensorLabeling.initDetailButtonListener();
  } catch (error) {
      // console.log('BOP Sensor Labeling initialization skipped for this page');
  }
});

// 스택 변경 이벤트 리스너 추가
document.addEventListener('fuelcellChanged', function(event) {
  BopSensorLabeling.fetchSensorLabelingData();
});

export default BopSensorLabeling; // BopSensorLabeling을 default로 내보냄


  

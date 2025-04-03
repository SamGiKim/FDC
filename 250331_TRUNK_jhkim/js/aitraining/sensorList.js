import { getCurrentConfig} from '../config/fuelcellSelector.js';

let selectedErrCodes = new Set(); // 선택된 errCode들을 추적하기 위한 Set

// 고장 진단 리스트의 매핑 데이터
const faultDiagnosisMapping = {
  'VF_ERROR_01': 'MFM Before Leak',
  'VF_ERROR_02': 'MFM After Leak',
  'VF_ERROR_03': 'Blower',
  'VF_ERROR_04': 'Flow Sensor',
  'VF_ERROR_05': 'Pressure Sensor',
  'VF_ERROR_06': 'Humidifier',
  'VF_ERROR_07': 'Stack In Temp. Sensor(W)',
  'VF_ERROR_08': 'Stack Out Temp. Sensor(W)',
  'VF_ERROR_09': 'Heat Exchanger',
  'VF_ERROR_12': 'Stack In Temp. Sensor(H)',
  'VF_ERROR_13': 'Stack Out Temp. Sensor(H)',
  'VF_ERROR_14': 'Heat Exch. Out Temp. Sensor'
};

// 소프트 센서 리스트의 매핑 데이터
const softSensorMapping = {
  'VF_deltaP': 'DeltaP',
  'VF_Air(U)': 'Air-U',
  'VF_Air(P1)': 'Air-P',
  'VF_Air(V)': 'Air-V',
  'VF_R1': 'Water 1',
  'VF_R2': 'Water 2',
  'VF_R3': 'Water 3',
  'VF_heat': 'heat',
  'VF_Ms': 'Ms',
  'VF_Mr': 'Mr',
  'VF_DI': 'DI',
  'VF_WP': 'WP'
};

// 페이지 로딩 시 기본 모델 그룹으로 데이터 로드
document.addEventListener('DOMContentLoaded', () => {
  const modelGroupSelect = document.getElementById('model-group-select');
  if (modelGroupSelect) {
    // 페이지 로드 시 첫 번째 옵션 선택 및 데이터 로드
    if (modelGroupSelect.options.length > 0) {
      const defaultModelGroup = modelGroupSelect.options[0].value;
      modelGroupSelect.value = defaultModelGroup;
      loadModelData(defaultModelGroup);
    }

    // 사용자가 선택할 때 데이터를 로드하도록 이벤트 추가
    modelGroupSelect.addEventListener('change', (event) => {
      loadModelData(event.target.value);
    });
  }

  // '전체' 클릭 이벤트 리스너 추가
  const faultDiagnosisListAll = document.getElementById('fault-diagnosis-list-all');
  if (faultDiagnosisListAll) {
    faultDiagnosisListAll.addEventListener('click', function() {
      const allItems = document.querySelectorAll('.fault-diagnosis-list a');
      const isActive = this.classList.contains('active');

      if (isActive) {
        // 현재 '전체'가 활성화 상태인 경우, 비활성화
        allItems.forEach(item => {
          item.classList.remove('active');
          const label = item.textContent.trim();
          const errCode = Object.keys(faultDiagnosisMapping).find(key => faultDiagnosisMapping[key] === label);
          if (errCode) {
            selectedErrCodes.delete(errCode.split('_')[2]);
          }
        });

        // '전체' 클릭에 대한 커스텀 이벤트 발생
        const customEvent = new CustomEvent('faultItemClicked', { 
          detail: { 
            errCode: null,
            isActive: false,
            selectedErrCodes: Array.from(selectedErrCodes)
          } 
        });
        document.dispatchEvent(customEvent);

        console.log('전체 클릭으로 선택된 error codes:', Array.from(selectedErrCodes));
      } else {
        // 현재 '전체'가 비활성화 상태인 경우, 활성화
        allItems.forEach(item => {
          item.classList.add('active');
          const label = item.textContent.trim();
          const errCode = Object.keys(faultDiagnosisMapping).find(key => faultDiagnosisMapping[key] === label);
          if (errCode) {
            selectedErrCodes.add(errCode.split('_')[2]);
          }
        });

        // '전체' 클릭에 대한 커스텀 이벤트 발생
        const customEvent = new CustomEvent('faultItemClicked', { 
          detail: { 
            errCode: null,
            isActive: true,
            selectedErrCodes: Array.from(selectedErrCodes)
          } 
        });
        document.dispatchEvent(customEvent);

        console.log('전체 클릭으로 선택된 error codes:', Array.from(selectedErrCodes));
      }

      // '전체'의 active 클래스 토글
      this.classList.toggle('active');
    });
  }

  // 페이지 로드 시 고장 진단 리스트 업데이트
  updateFaultDiagnosisList({});
});

export async function loadModelData(modelGroup) {
  const config = getCurrentConfig();
  try {
    const response = await fetch(`js/aitraining/get_model_data.php?${config.powerplant_id}&
      fuelcell_id=${config.fuelcell_id}&modelGroup=${modelGroup}`);
    const data = await response.json();
    console.log('Received model data:', data);
    updateUI(data);
  } catch (error) {
    console.error('Error loading model data:', error);
  }
}

function updateUI(data) {
  updateFaultDiagnosisList(data);
  updateSoftSensorList(data);
  updateScores(data);
}

// 고장 진단 리스트
function updateFaultDiagnosisList(data) {
  Object.entries(faultDiagnosisMapping).forEach(([key, label]) => {
    const element = getElementByText('.fault-diagnosis-list a', label);

    if (element) {
      const percentElement = element.nextElementSibling;
      if (percentElement && percentElement.classList.contains('per')) {
        const value = data[key] !== undefined && data[key] !== '' ? (data[key]).toFixed(0) : '-';
        percentElement.textContent = ` : ${value}%`; // 고장 진단 리스트 퍼센트
      }

      // 기존 이벤트 리스너 제거
      const newElement = element.cloneNode(true); // 깊은 복사(자식요소 포함)
      element.parentNode.replaceChild(newElement, element);

      const newPercentElement = percentElement.cloneNode(true);
      percentElement.parentNode.replaceChild(newPercentElement, percentElement);

      // 클릭 이벤트 리스너 추가
      const clickHandler = (event) => {
        event.preventDefault();
        const errCode = key.split('_')[2]; // 'VF_ERROR_01'에서 '01' 추출

        // .active 클래스 토글
        newElement.classList.toggle('active');

        // selectedErrCodes Set 업데이트
        if (newElement.classList.contains('active')) {
          selectedErrCodes.add(errCode);
        } else {
          selectedErrCodes.delete(errCode);
        }

        // 개별 항목 클릭에 대한 커스텀 이벤트 발생
        const customEvent = new CustomEvent('faultItemClicked', { 
          detail: { 
            errCode: errCode,
            isActive: newElement.classList.contains('active'),
            selectedErrCodes: Array.from(selectedErrCodes)
          } 
        });
        document.dispatchEvent(customEvent);

        console.log('Selected error codes:', Array.from(selectedErrCodes));
      };

      newElement.addEventListener('click', clickHandler);
      if (newPercentElement) {
        newPercentElement.addEventListener('click', clickHandler);
      }
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const modelGroupSelect = document.getElementById('model-group-select');
  if (modelGroupSelect) {
    // 페이지 로드 시 첫 번째 옵션 선택 및 데이터 로드
    if (modelGroupSelect.options.length > 0) {
      const defaultModelGroup = modelGroupSelect.options[0].value;
      modelGroupSelect.value = defaultModelGroup;
      loadModelData(defaultModelGroup);
    }

    // 사용자가 선택할 때 데이터를 로드하도록 이벤트 추가
    modelGroupSelect.addEventListener('change', (event) => {
      loadModelData(event.target.value);
    });
  }

  // '전체' 클릭 이벤트 리스너 추가
  const faultDiagnosisListAll = document.getElementById('fault-diagnosis-list-all');
  if (faultDiagnosisListAll) {
    faultDiagnosisListAll.addEventListener('click', function() {
      const allItems = document.querySelectorAll('.fault-diagnosis-list a');
      const isActive = this.classList.contains('active');

      if (isActive) {
        // 현재 '전체'가 활성화 상태인 경우, 비활성화
        allItems.forEach(item => {
          item.classList.remove('active');
          const label = item.textContent.trim();
          const errCode = Object.keys(faultDiagnosisMapping).find(key => faultDiagnosisMapping[key] === label);
          if (errCode) {
            selectedErrCodes.delete(errCode.split('_')[2]);
          }
        });

        // '전체' 클릭에 대한 커스텀 이벤트 발생
        const customEvent = new CustomEvent('faultItemClicked', { 
          detail: { 
            errCode: null,
            isActive: false,
            selectedErrCodes: Array.from(selectedErrCodes)
          } 
        });
        document.dispatchEvent(customEvent);

        console.log('전체 클릭으로 선택된 error codes:', Array.from(selectedErrCodes));
      } else {
        // 현재 '전체'가 비활성화 상태인 경우, 활성화
        allItems.forEach(item => {
          item.classList.add('active');
          const label = item.textContent.trim();
          const errCode = Object.keys(faultDiagnosisMapping).find(key => faultDiagnosisMapping[key] === label);
          if (errCode) {
            selectedErrCodes.add(errCode.split('_')[2]);
          }
        });

        // '전체' 클릭에 대한 커스텀 이벤트 발생
        const customEvent = new CustomEvent('faultItemClicked', { 
          detail: { 
            errCode: null,
            isActive: true,
            selectedErrCodes: Array.from(selectedErrCodes)
          } 
        });
        document.dispatchEvent(customEvent);

        console.log('전체 클릭으로 선택된 error codes:', Array.from(selectedErrCodes));
      }

      // '전체'의 active 클래스 토글
      this.classList.toggle('active');
    });
  }

  // 페이지 로드 시 고장 진단 리스트 업데이트
  updateFaultDiagnosisList({});
});

// 소프트 센서 리스트 
export function updateSoftSensorList(data) {
  const softSensorList = document.getElementById('soft-sensor-list');
  
  if (softSensorList) {
    // 모든 .softsensor-title 텍스트 비우기
    const allSoftSensorTitles = document.querySelectorAll('.softsensor-title');
    allSoftSensorTitles.forEach(title => title.textContent = '');

    // 기존의 모든 이벤트 리스너 제거
    const allSoftSensorItems = softSensorList.querySelectorAll('a');
    allSoftSensorItems.forEach(item => {
      item.removeEventListener('click', handleSoftSensorClick);
    });

    Object.entries(softSensorMapping).forEach(([key, label]) => {
      const element = findElementByText(document, 'a', label);
      if (element) {
        const percentElement = element.nextElementSibling;
        if (percentElement && percentElement.classList.contains('per')) {
          const value = data[key] !== undefined && data[key] !== '' ? data[key] : '-';
          percentElement.textContent = ` : ${value}%`; // 소프트 센서 리스트 퍼센트
        }

        // 클릭 이벤트 리스너 추가
        element.addEventListener('click', (event) => {
          handleSoftSensorClick(event);
        });
      }
    });

    // 초기 활성 항목 설정 및 .softsensor-title 업데이트
    const initialActiveItem = softSensorList.querySelector('a.active') || softSensorList.querySelector('a');
    if (initialActiveItem) {
      setActiveSoftSensor(initialActiveItem);
    }
  }
}

export function handleSoftSensorClick(event) {
  event.preventDefault();
  // 디버깅 로그 추가
  console.log('클릭 이벤트 발생:', event.currentTarget.textContent.trim());

  setActiveSoftSensor(event.currentTarget);
  window.hwSensorTableList.loadSelectedSensorData(); // 전역 변수로 접근
}

export function setActiveSoftSensor(element) {
  const softSensorList = document.getElementById('soft-sensor-list');
  const currentlyActive = softSensorList.querySelector('a.active');

  // 현재 활성 항목이 있으면 비활성화
  if (currentlyActive && currentlyActive !== element) {
    currentlyActive.classList.remove('active');
  }

  // 새로운 항목 활성화
  element.classList.add('active');

  // active된 요소의 부모 span.deco에서 타입 확인
  const decoElement = element.closest('span.deco');
  if(decoElement){
    // 타입 확인(air, water, heat, fuel)
    const sensorType = getSensorTypeFromDeco(decoElement);

    //.softsensor-title 업데이트
    const label = element.textContent.trim();
    const titleElements = document.querySelectorAll('.softsensor-title');

    titleElements.forEach(title =>{
      // 텍스트 업데이트
      title.textContent = label;
      // 기존 클래스들 제거
      title.classList.remove('air', 'water', 'heat', 'fuel');
      // active 요소의 타입에 해당하는 클래스 추가
      title.classList.add(sensorType);
    })
  }

  // span.deco 요소에서 센서 타입을 확인하는 헬퍼 함수
  function getSensorTypeFromDeco(decoElement){
    if(decoElement.classList.contains('air')) return 'air';
    if(decoElement.classList.contains('water')) return 'water';
    if(decoElement.classList.contains('heat')) return 'heat';
    if(decoElement.classList.contains('fuel')) return 'fuel';
    return 'air'; // 기본값
  }

  // .softsensor-title 업데이트
  const label = element.textContent.trim();
  const titleElements = document.querySelectorAll('.softsensor-title');
  titleElements.forEach(title => title.textContent = label);

  console.log('선택된 소프트 센서:', label);
}

// 텍스트 내용으로 요소를 선택하는 헬퍼 함수
export function getElementByText(selector, text) {
  const elements = document.querySelectorAll(selector);
  return Array.from(elements).find(element => 
    element.textContent.trim().toUpperCase() === text.toUpperCase()
  );
}

// 텍스트 내용으로 요소를 찾는 헬퍼 함수
export function findElementByText(parentElement, selector, text) {
  const elements = parentElement.querySelectorAll(selector);
  return Array.from(elements).find(element => 
    element.textContent.trim() === text
  );
}

/////////////////////////////////////////////////////////////////////////////////////////
// 전체 퍼센트
// 모델링 그룹선택, 고장진단리스트, 소프트 센서 리스트의 '전체' 퍼센트 
function updateScores(data) {
  const modelGroupPer = document.getElementById('model-group-per');
  const faultDiagnosisPer = document.getElementById('fault-diagnosis-per');
  const softSensorPer = document.getElementById('soft-sensor-per');

  if (modelGroupPer && data['VF_MODEL_SCORE'] !== undefined) {
    modelGroupPer.textContent = ` : ${data['VF_MODEL_SCORE']}%`;
  }

  if (faultDiagnosisPer && data['VF_ERROR_SCORE'] !== undefined) {
    faultDiagnosisPer.textContent = ` : ${data['VF_ERROR_SCORE']}%`;
  }

  if (softSensorPer && data['VF_SENSOR_SCORE'] !== undefined) {
    softSensorPer.textContent = ` : ${data['VF_SENSOR_SCORE']}%`;
  }
}

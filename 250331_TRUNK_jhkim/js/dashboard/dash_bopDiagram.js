import { loadAllData } from '../config/redis_dataManager.js';
import { getCurrentConfig, fuelcellConfig } from '../config/fuelcellSelector.js';


// 시스템 구조도의 sw sensor 부분
const BopDiagramManager = {
  init: function() {
    this.loadBopAndEventData();
    this.setupBopLink();
    this.setupSensorClickHandlers(); // 센서 클릭 핸들러 설정 추가
    this.setupModalClickHandlers();
  },

  loadBopAndEventData: function () {
    loadAllData()
      .then(data => {
        // console.log("BOP Received data:", data);  // 추가
        if (data) {
          this.updateBopDiagram(data.BOP || {});
          this.updateEventStatus(data.HW_Alert || {});
          this.updateGroupWarningStatus(data.result_event || {}); // 그룹(~계 관리)
        } else {
          console.warn("유효한 데이터가 없습니다.");
        }
      })
      .catch(error => {
        console.error("데이터를 불러오는 데 실패했습니다.", error);
      });
  },

  updateBopDiagram: function (bopData) {
    Object.keys(bopData).forEach(category => {
      const categoryData = bopData[category];
      Object.keys(categoryData).forEach(key => {
        const elementId = `${key}_num`;
        const element = document.getElementById(elementId);
        if (element) {
          const value = categoryData[key];
          const unit = element.querySelector("sup") ? element.querySelector("sup").outerHTML : "";
          element.innerHTML = `${Number(value).toFixed(2)}${unit}`;
        } else {
          // console.warn(`Element with ID ${elementId} not found.`);
        }
      });
    });
  },

  updateEventStatus: function (eventData) {
    console.log("Received eventData:", eventData);

    const idMapping = {
      "MFM-Air": "MFM-Air_value",
      "P_A_m_out": "P_A_m_out_value",
      "T_A_S_in": "T_A_S_in_value",
      "T_A_S_out": "T_A_S_out_value",
      "T_DI_S_out": "T_DI_S_out_value",
      "T_w_h_out": "T_w_h_out_value",
      "T_DI_S_in": "T_DI_S_in_value",
      "Flow_Meter": "MFM-Air_value",
      "Pressure_Sensor": "P_A_m_out_value",
      "Stack_in_Water": "T_A_S_in_value",
      "Stack_out_Water": "T_A_S_out_value",
      "Stack_in_Heat": "T_DI_S_in_value",
      "Stack_Out_Heat": "T_DI_S_out_value",
      "Heat_Exchanger_out": "T_w_h_out_value",
    };

    const updateEventElement = (key, value) => {
      const elementId = idMapping[key];
      if (elementId) {
        const element = document.getElementById(elementId);
        // console.log(`Updating element: ${elementId}, value: ${value}`);
        if (element) {
          element.classList.toggle("warning", value === true);
          // console.log(`Toggled warning class on ${elementId}: ${value === true}`);
        } else {
          // console.warn(`Element with ID ${elementId} not found.`);
        }
      }
    };

    const processData = (data) => {
      Object.entries(data).forEach(([key, value]) => {
        if (typeof value === "object" && value !== null) {
          processData(value);
        } else {
          updateEventElement(key, value);
        }
      });
    };
    
    processData(eventData);

    // MFM-DI에 대한 특별 처리
    const handleMFM_DI = (value) => {
      const beforeMFM = document.getElementById("MFM-DI_before_value");
      const afterMFM = document.getElementById("MFM-DI_after_value");
      // console.log(`Handling MFM-DI: value = ${value}`);
      if (beforeMFM) {
        beforeMFM.classList.toggle("warning", value === true);
        // console.log(`Toggled warning class on MFM-DI_before_value: ${value === true}`);
      }
      if (afterMFM) {
        afterMFM.classList.toggle("warning", value === true);
        // console.log(`Toggled warning class on MFM-DI_after_value: ${value === true}`);
      }
    };

    if (eventData.Air && eventData.Air["MFM-DI"] !== undefined) {
      handleMFM_DI(eventData.Air["MFM-DI"]);
    }

    // console.log("Event status update completed");
  },

  updateGroupWarningStatus: function (eventData) {
    // console.log("bop Updating group warning status:", eventData);
  
    const groupMapping = {
      'Air': 'blowerFlame',
      'Water': 'huminiferFlame',
      'Heat': 'HeatExchangerFlame'
    };
  
    Object.entries(groupMapping).forEach(([dataKey, elementId]) => {
      const groupData = eventData[dataKey];
      // console.log(`Checking group ${dataKey}:`, groupData);
      if (groupData && typeof groupData === 'object') {
        const hasWarning = Object.values(groupData).some(value => value === true);
        console.log(`Group ${dataKey} has warning:`, hasWarning);
        const element = document.getElementById(elementId);
        if (element) {
          if (hasWarning) {
            element.setAttribute('class', 'warning');
          } else {
            element.removeAttribute('class');
          }
          // console.log(`Updated class on ${elementId}:`, element.getAttribute('class'));
        } else {
          // console.warn(`Element with ID ${elementId} not found.`);
        }
      }
    });
  
    // MFM 관련 요소 업데이트
    this.updateMFMWarningStatus(eventData.Air);
  },

   // 새로운 기능 추가: 센서 클릭 이벤트 처리
   setupSensorClickHandlers: function() {
    // 각 그룹에 속한 div 요소의 클릭 이벤트 처리
    const blowerGroup = document.querySelectorAll('.blower-group .sensor');
    const humidifierGroup = document.querySelectorAll('.humidifier-group .sensor');
    const heatGroup = document.querySelectorAll('.heat-group .sensor'); // 필요 시 추가
    
    // 공통 함수: warning sample클래스 추가 후 3초 뒤에 제거
    const addWarningWithTimeout = (selector) => {
      const element = document.querySelector(selector);
      if (element) {
        element.classList.add('warning', 'sample');
        setTimeout(() => {
          element.classList.remove('warning', 'sample');
        }, 8000); // 3초 후에 warning 클래스 제거
      }
    };
  
    // 각 그룹에 속한 센서 클릭 시 공통 함수 호출
    blowerGroup.forEach(sensor => {
      sensor.addEventListener('click', () => {
        addWarningWithTimeout('.blower-flame');
      });
    });
    
    humidifierGroup.forEach(sensor => {
      sensor.addEventListener('click', () => {
        addWarningWithTimeout('.humidifier-flame');
      });
    });
    
    heatGroup.forEach(sensor => {
      sensor.addEventListener('click', () => {
        addWarningWithTimeout('.heat-exchanger-flame');
      });
    });

  },  
  
  
  updateMFMWarningStatus: function (airData) {
    if (!airData) return;
  
    const updateMFMElement = (id, value) => {
      const element = document.getElementById(id);
      if (element) {
        element.classList.toggle('warning', value === true);
        // console.log(`Updated MFM element ${id}: warning=${value}`);
      } else {
        // console.warn(`MFM element with ID ${id} not found.`);
      }
    };
  
    updateMFMElement('MFM-DI_after_value', airData.After_MFM);
    updateMFMElement('MFM-DI_before_value', airData.Before_MFM);
  },

  setupBopLink: function() {
    const bopLink = document.getElementById('go-to-bop-page');
    if (bopLink) {
      bopLink.addEventListener('click', this.handleBopLinkClick);
    } else {
      // console.warn("Element with ID 'go-to-bop-page' not found.");
    }
  },

  // URL 생성을 위한 공통 메서드
  createBopUrl: function() {
    const config = getCurrentConfig();
    return `bop.html?plant=${config.powerplant_id}&group=${config.group_id}&fuelcell=${config.fuelcell_id}`;
  },

  handleBopLinkClick: function(e) {
    e.preventDefault();
    window.location.href = this.createBopUrl();
  },

  setupModalClickHandlers: function() {
    const modalBodies = document.querySelectorAll('.dash-modal-body');
    modalBodies.forEach(modal => {
      modal.addEventListener('click', () => {
        window.location.href = this.createBopUrl();
      });
    });
  }

};



export default BopDiagramManager;

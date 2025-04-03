import { getCurrentConfig } from '../config/fuelcellSelector.js';
import { ModelGroupSelector } from '../config/modelSelector.js';

class HWSensorTableList {
  constructor() {
    const { powerplant_id, fuelcell_id } = getCurrentConfig();
    this.powerplant_id = powerplant_id;  
    this.fuelcell_id = fuelcell_id;     
    this.modelGroup = '';              
    this.baseDir = '/bop_data';
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.loadInitialData();
  }

  setupEventListeners() {
    // 이벤트 리스너 중복 방지: 핸들러의 참조를 명확히 전달
    if (this.handleFuelcellChange) document.removeEventListener('fuelcellChanged', this.handleFuelcellChange);
    if (this.handleModelGroupChange) document.removeEventListener('modelGroupChanged', this.handleModelGroupChange);
    if (this.handleSoftSensorClick) document.querySelector('#soft-sensor-list').removeEventListener('click', this.handleSoftSensorClick);

    // fuelcellChanged 이벤트 핸들러
    this.handleFuelcellChange = (event) => {
      const { plant, group, fuelcell } = event.detail;
      this.powerplant_id = plant;
      this.fuelcell_id = fuelcell;
      this.loadData();
    };


    this.handleModelGroupChange = (event) => {
      this.modelGroup = event.detail.modelGroup;  // 변경: currentModelGroup -> modelGroup
      console.log('ModelGroupChanged event received with:', this.modelGroup);
      this.loadData();
    };

    this.handleSoftSensorClick = (event) => {
      if (event.target.tagName === 'A') {
        event.preventDefault();
        this.handleSensorLinkClick(event.target);
      }
    };

    document.addEventListener('fuelcellChanged', this.handleFuelcellChange.bind(this));
    document.addEventListener('modelGroupChanged', this.handleModelGroupChange.bind(this));
    document.querySelector('#soft-sensor-list').addEventListener('click', this.handleSoftSensorClick.bind(this));
  }

  handleSensorLinkClick(element) {
    // 기존 active 클래스 제거
    document.querySelectorAll('#soft-sensor-list a.active').forEach(el => el.classList.remove('active'));

    // 클릭된 항목에만 active 클래스 추가
    element.classList.add('active');

    console.log('Sensor link clicked:', element.innerText);
    this.loadSelectedSensorData();
  }

  loadInitialData() {
    // 첫 번째 센서 항목을 자동으로 선택
    const firstSensor = document.querySelector('#soft-sensor-list a');
    if (firstSensor) {
        firstSensor.classList.add('active');
        
        if (window.modelGroupSelector) {
            this.modelGroup = window.modelGroupSelector.getCurrentModelGroup();
            this.loadData();
        }
    }
}

  async loadData() {
    const activeSensors = this.getActiveSensors();
    console.log('Active sensors for data load:', activeSensors);
    if (activeSensors.length > 0) {
      await this.loadSelectedSensorData();
    } else {
      this.clearTable();
    }
  }

  getActiveSensors() {
    return Array.from(document.querySelectorAll('#soft-sensor-list a.active'))
      .map(el => el.innerText.trim());
  }

  async loadSelectedSensorData() {
    const activeSensors = this.getActiveSensors();
    console.log('Active sensors:', activeSensors);
    
    if (activeSensors.length === 0) {
        this.clearTable();
        return;
    }

    const sensorName = activeSensors[0];
    const sensorData = await this.readCSVFile(sensorName);
    
    if (!sensorData) {
        this.clearTable();
        return;
    }

    console.log('Loaded sensor data:', sensorData);
    this.updateTable(sensorData);

    // init_aitraining_graph_2 함수 호출
    const fullpath = `/data/${this.powerplant_id}/${this.fuelcell_id}/BOP/MODEL/${this.modelGroup}/${this.getSensorFileName(sensorName)}`;  // 변경: currentPowerplantId -> powerplant_id, currentFuelcellId -> fuelcell_id, currentModelGroup -> modelGroup
    const fields = [2,3]; 

    console.log('Calling init_aitraining_graph_2 with:', fullpath, fields);
    if (typeof window.init_aitraining_graph_2 === 'function') {
      window.init_aitraining_graph_2(fullpath, fields);
    } else {
      console.error('init_aitraining_graph_2 is not defined.');
    }
  }

  async readCSVFile(sensorName) {
    const fileName = this.getSensorFileName(sensorName);
    const url = `js/aitraining/get_hw_sensor_table_list.php?powerplant_id=${this.powerplant_id}&fuelcell_id=${this.fuelcell_id}&modelGroup=${encodeURIComponent(this.modelGroup)}&fileName=${encodeURIComponent(fileName)}`; 

    console.log(`Requesting file from: ${url}`);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        if(response.status === 404) {
          console.warn(`csv 파일 존재하지 않습니다: ${fileName}`);
          return null; 
        }
        const errorText = await response.text();
        throw new Error(`HTTP 오류! 상태: ${response.status}, 응답: ${errorText}`);
      }
      const jsonResponse = await response.json();
      return jsonResponse; // JSON 형식으로 반환된 데이터 처리
    } catch (error) {
      console.error('CSV 파일 읽기 오류:', error);
      this.showErrorMessage(`데이터를 불러오는 데 실패했습니다: ${error.message}`);
      return null;
    }
  }

  getSensorFileName(sensorName) {
    const fileNameMap = {
      'DeltaP': 'deltaP.csv',
      'Air-U': 'Air(U).csv',
      'Air-P': 'Air(P1).csv',
      'Air-V': 'Air(V).csv',
      'Water 1': 'R1.csv',
      'Water 2': 'R2.csv',
      'Water 3': 'R3.csv',
      'heat': 'Heat.csv',
      'Ms': 'Ms.csv',
      'Mr': 'Mr.csv',
      'DI': 'DI.csv',
      'WP': 'WP.csv'
    };
    return fileNameMap[sensorName] || `${sensorName}.csv`;
  }

  updateTable(data) {
    const table = document.getElementById('sensor-data-table');
    const thead = table.querySelector('thead');
    const tbody = table.querySelector('tbody');
  
    const [headers, ...rows] = data;
  
    thead.innerHTML = 
      `<tr>
        ${headers.map(header => `<th title="${header}">${header}</th>`).join('')}
      </tr>`;
  
    tbody.innerHTML = rows.map(row => 
      `<tr>
      ${row.map(cell => `<td title="${cell}" value="${cell}">${cell}</td>`).join('')}
    </tr>`
    ).join('');
  
    const columnCount = headers.length;

    // 기존 items- 클래스를 제거
    table.classList.forEach(cls => {
        if (cls.startsWith('items-')) {
            table.classList.remove(cls);
        }
    });
    table.classList.add(`items-${columnCount}`); // table 요소에 items-숫자 클래스 추가
  }

  clearTable() {
    const table = document.getElementById('sensor-data-table');
    table.querySelector('thead').innerHTML = '';
    table.querySelector('tbody').innerHTML = '';
  }

  showErrorMessage(message) {
    console.error(message);
  }
}

// 전역 변수로 인스턴스 생성
window.hwSensorTableList = new HWSensorTableList();

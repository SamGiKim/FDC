import { fuelcellConfig, getSelectedFuelcell } from "../config/fuelcellSelector.js";

const statusClassMap = {
    'normal-C': '정상',
    'watchout-C': '점검요망',
    'warning-C': '경고',
    'critical-C': '비상'
};

const AlarmManager = {
    currentFilters: ['전항목'],

    initAlarm: function() {
        const alarmElement = document.getElementById('alarm-container');
        if (!alarmElement) return;

        this.setupEventListeners();
        this.loadAlarmData();
        this.updateButtonStyles();

        // fuelcell 변경 이벤트 리스너 추가
        document.addEventListener('fuelcellChanged', (event) => {
            this.loadAlarmData(event.detail);
        });
    },

    setupEventListeners: function() {
        document.querySelector('.all-C').addEventListener('click', () => {
            this.toggleAllFilter();
        });

        document.querySelectorAll('.btn-wrapper button').forEach(button => {
            button.addEventListener('click', () => {
                const buttonClass = Array.from(button.classList).find(cls => statusClassMap.hasOwnProperty(cls));
                if (buttonClass) {
                    this.toggleFilter(buttonClass);
                }
            });
        });

        const alarmCountSelect = document.getElementById('alarmCountSelect');
        alarmCountSelect.addEventListener('change', () => this.loadAlarmData());
        const alarmTypeSelect = document.getElementById('alarmTypeSelect');
        alarmTypeSelect.addEventListener('change', () => this.loadAlarmData());
    },

    toggleAllFilter: function() {
        const isAllSelected = this.currentFilters.includes('전항목');
        this.currentFilters = isAllSelected ? [] : ['전항목'];
        this.updateButtonStyles();
        this.loadAlarmData();
    },

    toggleFilter: function(buttonClass) {
        const status = statusClassMap[buttonClass];
        const index = this.currentFilters.indexOf(status);
        const allIndex = this.currentFilters.indexOf('전항목');

        // 배열의 indexOf 메서드는 요소를 찾지 못했을 때 -1 반환

        if (allIndex > -1) { // 전항목이 선택된 상태
            this.currentFilters = [status];
        } else if (index > -1) { // 요소가 배열에 존재한다면
            this.currentFilters.splice(index, 1);
        } else {
            this.currentFilters.push(status);
        }

        if (this.currentFilters.length === Object.keys(statusClassMap).length) {
            this.currentFilters = ['전항목'];
        } else if (this.currentFilters.length === 0) {
            this.currentFilters = ['전항목'];
        }

        this.updateButtonStyles();
        this.loadAlarmData();
    },

    updateButtonStyles: function() {
        const allButton = document.querySelector('.all-C');
        const statusButtons = document.querySelectorAll('.btn-wrapper button');

        allButton.classList.toggle('selected', this.currentFilters.includes('전항목'));
        
        statusButtons.forEach(button => {
            const buttonClass = Object.keys(statusClassMap).find(className => button.classList.contains(className));
            if (buttonClass) {
                button.classList.toggle('selected', this.currentFilters.includes(statusClassMap[buttonClass]));
            }
        });
    },

    loadAlarmData: async function() {
        try {
            const filters = this.currentFilters.join(',');
            const alarmCountSelect = document.getElementById('alarmCountSelect');
            const alarmTypeSelect = document.getElementById('alarmTypeSelect');
            const limit = alarmCountSelect ? alarmCountSelect.value : 10;
            const type = alarmTypeSelect ? alarmTypeSelect.value : 'BOP';
            
            // 현재 선택된 연료전지 정보 가져오기
            const selectedFuelcell = await getSelectedFuelcell();
            if (!selectedFuelcell) {
                console.warn('연료전지 ID를 찾을 수 없습니다.');
                return;
            }
    
            const currentFuelcellData = fuelcellConfig[selectedFuelcell];
            if (!currentFuelcellData) {
                console.warn('연료전지 설정을 찾을 수 없습니다:', selectedFuelcell);
                return;
            }
    
            const params = new URLSearchParams({
                type: type,
                filters: filters,
                limit: limit.toString(),
                fuelcellId: currentFuelcellData.fuelcell,
                plant: currentFuelcellData.plant
            });
    
            const url = `js/dashboard/load_alarm.php?${params.toString()}`;
            console.log('Alarm URL:', url);
            const response = await fetch(url);
            if (!response.ok) {
                console.warn(`알람 데이터 로드 실패: ${response.status}`);
                return;
            }
    
            const data = await response.json();
            this.updateAlarmTable(data);
        } catch (error) {
            console.warn('알람 데이터 로드 실패:', error);
            // 에러를 조용히 처리
        }
    },


    updateAlarmTable: function(alarmData) {
        const tbody = document.querySelector('#alarm-log');
        tbody.innerHTML = '';

        alarmData.forEach(alarm => {
            const tr = document.createElement('tr');
            let statusClass = Object.keys(statusClassMap).find(key => statusClassMap[key] === alarm.status) || '';

            tr.innerHTML = `
                <td class="col-4">${this.formatDate(alarm.time)}</td>
                <td class="col-6">${alarm.comment}</td> 
                <td class="col-2 ${statusClass}">${alarm.status}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    formatDate: function(dateString) {
        const date = new Date(dateString);
        return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    }
};

export { AlarmManager };
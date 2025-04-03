import { loadAllData, setDefaultSection } from '../config/redis_dataManager.js';
import {QoeManager} from './dash_qoe.js';
import SystemInfoManager from './dash_system_info.js';
import BopDiagramManager from './dash_bopDiagram.js';
import realTimeProductionManager from './dash_realtime_production.js';
import { OperationInfoManager } from './dash_operation_info.js';
import { productionBarChartManager } from './dash_bar_chart.js';
import { AlarmManager } from './dash_alarm.js';
import { operationRateManager } from './dash_operation_rate.js';
import HWAlertManager from './dash_hwAlert.js';  
import FaultDiagManager from './dash_faultDiag.js';
import { 
    getSelectedFuelcell, 
    getFuelcellSectionId, 
    fuelcellConfig,
    getCurrentConfig,
    setupFuelcellSelector,
    ensureDataLoaded
} from '../config/fuelcellSelector.js';

const DashboardEventManager = {
    refreshInterval: 10000,
    currentSection: null,
    currentConfig: null,
    isInitialized: false,
    intervalId: null,

    async initialize() {
        try {
            console.log('Dashboard 초기화 시작');
            
            // 기존 차트 정리를 먼저 수행
            this.destroyExistingCharts();
            
            // 사이트 구조 초기화 완료 대기
            await new Promise(resolve => {
                if (window.isFuelcellConfigLoaded) {
                    resolve();
                } else {
                    document.addEventListener('siteStructureInitialized', () => resolve(), { once: true });
                }
            });

            // 현재 설정 가져오기
            this.currentConfig = await getCurrentConfig();
            console.log('현재 설정:', this.currentConfig);

            if (!this.currentConfig) {
                throw new Error('현재 설정을 가져올 수 없습니다.');
            }

            // 섹션 ID 설정
            this.currentSection = `${this.currentConfig.powerplant_id}_${this.currentConfig.fuelcell_id}_dash_web`;
            await setDefaultSection(this.currentSection);

            // 나머지 초기화 진행
            await this.initializeAllComponents();
            await this.refreshData();
            this.startRefreshing();

            this.isInitialized = true;
        } catch (error) {
            console.error('Dashboard 초기화 실패:', error);
            throw error;
        }
    },
    
    destroyExistingCharts() {
        try {
            const chartElements = document.querySelectorAll('canvas');
            chartElements.forEach(canvas => {
                if (window.Chart && Chart.getChart(canvas)) {
                    console.log(`차트 제거: ${canvas.id}`);
                    Chart.getChart(canvas).destroy();
                }
            });
        } catch (error) {
            console.error('차트 제거 중 오류:', error);
        }
    },

    startRefreshing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
        this.intervalId = setInterval(() => this.refreshData(), this.refreshInterval);
        console.log(`데이터 갱신 간격 설정: ${this.refreshInterval}ms`);
    },

    stopRefreshing() {
        if (this.intervalId) {
            clearInterval(this.intervalId);
            this.intervalId = null;
            console.log('데이터 갱신 중지');
        }
    },

    async refreshData() {
        if (!this.currentSection) {
            console.error('현재 섹션이 설정되지 않았습니다.');
            return;
        }

        try {
            console.log('데이터 로딩 시작. 현재 섹션:', this.currentSection);
            const data = await loadAllData();
            
            console.log('데이터 로드 완료:', {
                'BOP 데이터 존재': !!data.BOP,
                'HW_Alert 데이터 존재': !!data.HW_Alert,
                'stack_info 데이터 존재': !!data.stack_info,
                'realtime_production 데이터 존재': !!data.realtime_production,
                'operation_info 데이터 존재': !!data.operation_info,
                'operation_rate 데이터 존재': !!data.operation_rate,
                'result_event 데이터 존재': !!data.result_event
            });

            await this.updateAllComponents(data);
            console.log('컴포넌트 업데이트 완료');

        } catch (error) {
            console.error('데이터 갱신 중 오류:', error);
        }
    },

    async updateAllComponents(data) {
        if (!data) {
            console.error('업데이트할 데이터가 없습니다.');
            return;
        }
    
        try {
            console.log('컴포넌트 업데이트 시작');
            
            const updateTasks = [
                {
                    name: 'SoH',
                    task: () => QoeManager.updateQoeInfo(data)
                },
                {
                    name: 'BOP 다이어그램',
                    task: () => BopDiagramManager.updateBopDiagram(data.BOP || {})
                },
                {
                    name: '이벤트 상태',
                    task: () => BopDiagramManager.updateEventStatus(data.HW_Alert || {})
                },
                {
                    name: '시스템 정보',
                    task: () => SystemInfoManager.updateSystemInfo(data.stack_info || {})
                },
                {
                    name: '생산량',
                    task: () => realTimeProductionManager.updateCharts(
                        data.realtime_production || {},
                        data.real_per_production || {}
                    )
                },
                {
                    name: '생산량 바 차트',
                    task: () => productionBarChartManager.updateAllCharts()
                },
                {
                    name: '알람',
                    task: () => AlarmManager.loadAlarmData()
                },
                {
                    name: '운전정보',
                    task: () => OperationInfoManager.updateOperationInfo(data.operation_info || {})
                },
                {
                    name: '발전량 가동률',
                    task: () => operationRateManager.updateOperationRate(data)
                },
                {
                    name: 'HW 알림',
                    task: () => HWAlertManager.updateHWAlertStatus(data.HW_Alert || {})
                },
                {
                    name: '고장 진단',
                    task: () => FaultDiagManager.updateFaultDiagStatus(data.result_event || {})
                }
            ];
    
            for (const { name, task } of updateTasks) {
                try {
                    await task();
                    console.log(`${name} 업데이트 성공`);
                } catch (error) {
                    console.error(`${name} 업데이트 실패:`, error);
                }
            }
    
            // 모든 컴포넌트 업데이트 후 dataUpdated 이벤트 발생
            document.dispatchEvent(new CustomEvent('dataUpdated', { detail: data }));
            console.log('dataUpdated 이벤트 발생');
    
        } catch (error) {
            console.error('컴포넌트 업데이트 중 오류:', error);
        }
    },

    async initializeAllComponents() {
        try {
            const initTasks = [
                { name: 'SoH', task: () => QoeManager.initQoe() },
                { name: '생산 바 차트', task: () => productionBarChartManager.initBarCharts() },
                { name: '운전 정보', task: () => OperationInfoManager.initOperationInfo() },
                { name: '알람', task: () => AlarmManager.initAlarm() },
                { name: '발전량 가동률', task: () => operationRateManager.initOperationRate() },
                { name: 'BOP 다이어그램', task: () => BopDiagramManager.init() },
                { name: '고장 진단', task: () => FaultDiagManager.initSensorClickEvents() }
            ];

            for (const { name, task } of initTasks) {
                try {
                    await task();
                    console.log(`${name} 초기화 성공`);
                } catch (error) {
                    console.error(`${name} 초기화 실패:`, error);
                }
            }

            // 이벤트 리스너 설정
            this.setupEventListeners();

        } catch (error) {
            console.error('컴포넌트 초기화 실패:', error);
            throw error;
        }
    },

    setupEventListeners() {
        document.addEventListener('refreshData', () => this.refreshData());
        document.addEventListener('fuelcellChanged', async () => {
            const selectedFuelcell = await getSelectedFuelcell();
            await this.handleFuelcellChange(selectedFuelcell);
        });
    },

    async handleFuelcellChange(newFuelcell) {
        try {
            console.log('연료전지 변경 시작:', newFuelcell);
            
            // 새로운 설정 가져오기
            this.currentConfig = await getCurrentConfig();
            this.currentSection = await getFuelcellSectionId(this.currentConfig.fuelcell_id);
            
            // 섹션 업데이트
            await setDefaultSection(this.currentSection);
            
            // 데이터 새로고침
            await this.refreshData();
            
            console.log('연료전지 변경 완료:', this.currentConfig);
        } catch (error) {
            console.error('연료전지 변경 실패:', error);
        }
    }
};

// DOM이 로드된 후 초기화
document.addEventListener('DOMContentLoaded', async () => {
    try {
        await DashboardEventManager.initialize();
    } catch (error) {
        console.error('Dashboard 초기화 실패:', error);
    }
});

export { DashboardEventManager };
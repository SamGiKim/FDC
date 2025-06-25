//bopDiagApply.js [BOP 진단 적용]
import { getCurrentConfig } from '../config/fuelcellSelector.js';
import { loadModelData as loadSensorModelData} from '../aitraining/sensorList.js'; // 데이터 로드 함수 임포트

export class DiagModelSelector {
    constructor() {
        // Promise를 사용하여 초기화 상태 관리
        this.initializationComplete = false;
        this.initPromise = new Promise(async (resolve) => {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', async () => {
                    await this.initialize();
                    resolve();
                });
            } else {
                await this.initialize();
                resolve();
            }
        });
    }

    async initialize() {
        try {
            // DOM 요소 초기화를 먼저 수행
            this.selectElement = document.getElementById('diag-model-apply');
            if (!this.selectElement) {
                throw new Error('diag-model-apply 요소를 찾을 수 없습니다');
            }

            this.applyButton = document.getElementById('diag-model-apply-btn');
            this.applyStartButton = document.getElementById('bop-diag-apply-start-button');
            this.statusElement = document.getElementById('progress-bar-item');
            this.statusTextElement = document.getElementById('model_status');
            
            // 기타 초기화
            this.currentModelGroup = '';
            this.isRunning = false;
            this.boundToggleStartStop = this.toggleStartStop.bind(this);

            // 설정 로드 대기
            const config = await getCurrentConfig();
            console.log('설정 로드 완료:', config);

            // 모델 그룹 로드
            await this.loadModelGroups();
            
            // 이벤트 리스너 및 기타 초기화
            this.setupEventListeners();
            this.populateDateSelectors();
            
            // 상태 체크 시작
            this.checkModelStatus();
            setInterval(() => this.checkModelStatus(), 5000);

            this.initializationComplete = true;
            console.log('DiagModelSelector 초기화 완료');

        } catch (error) {
            console.error('DiagModelSelector 초기화 실패:', error);
            throw error;
        }
    }

    async loadModelGroups() {
        try {
            // URL에서 매개변수 가져오기
            const urlParams = new URLSearchParams(window.location.search);
            const urlPlant = urlParams.get('plant');
            const urlFuelcell = urlParams.get('fuelcell');
            
            // getCurrentConfig와 URL 매개변수 둘 다 시도
            let config;
            try {
                config = await getCurrentConfig();
                console.log('모델 그룹 로드 - 현재 설정:', config);
            } catch (error) {
                console.error('getCurrentConfig 오류:', error);
                config = {};
            }
            
            const powerplant_id = config.powerplant_id || urlPlant;
            const fuelcell_id = config.fuelcell_id || urlFuelcell;
            
            console.log('최종 사용 설정:', { powerplant_id, fuelcell_id, urlSource: !!urlPlant });
    
            if (!powerplant_id || !fuelcell_id) {
                throw new Error('발전소나 연료전지 정보를 찾을 수 없습니다');
            }
    
            if (!this.selectElement) {
                throw new Error('모델 선택 요소를 찾을 수 없습니다');
            }
    
            this.selectElement.innerHTML = '';
            const url = `js/bop/get_model_apply.php?plant=${powerplant_id}&fuelcell=${fuelcell_id}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
    
            const result = await response.json();
            console.log('모델 그룹 응답:', result);
    
            // 응답 구조 수정
            if (result.data) {  // 단순히 data 존재 여부만 체크
                const modelName = result.data;  // .value 제거
                const option = document.createElement('option');
                option.value = modelName;
                option.textContent = modelName;
                this.selectElement.appendChild(option);
                this.currentModelGroup = modelName;
                console.log('모델 설정됨:', modelName);
            } else {
                throw new Error('모델 데이터가 없습니다');
            }
    
        } catch (error) {
            console.error('모델 그룹 로드 실패:', error);
            const option = document.createElement('option');
            option.value = '';
            option.textContent = '사용 가능한 모델 없음';
            this.selectElement.appendChild(option);
        }
    }
    // 기본 옵션 추가 헬퍼 메소드
    addDefaultOption(message) {
        // 옵션 추가 전에 기존 옵션이 있는지 확인
        if (this.selectElement.querySelector(`option[value=""][text="${message}"]`)) {
            return; // 이미 같은 메시지의 옵션이 있으면 추가하지 않음
        }

        const option = document.createElement('option');
        option.value = '';
        option.textContent = message;
        this.selectElement.appendChild(option);
    }

    async loadModelData() {
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
        
        console.log('모델 데이터 로드 - 사용 설정:', { powerplant_id, group_id, fuelcell_id, urlSource: !!urlPlant });
        
        if (!powerplant_id || !fuelcell_id) {
            alert('연료전지 정보를 찾을 수 없습니다.');
            return;
        }
        
        const modelGroup = this.getCurrentModelGroup();
        if (!modelGroup) {
            alert('선택된 모델이 없습니다.');
            return;
        }
    
        try {
            // MySQL에 INSERT 요청
            const insertResponse = await fetch('js/bop/update_DB_bop_diag_apply.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    powerplant_id,
                    group_id,
                    fuelcell_id,
                    model_name: modelGroup
                })
            });
    
            // 응답 로그 추가
            const insertText = await insertResponse.text(); // 텍스트로 응답 받기
            console.log('Insert Response:', insertText); // 응답 로그
            
            let insertResult;
            try {
                insertResult = JSON.parse(insertText); // JSON 파싱
            } catch (jsonError) {
                console.error('Error parsing Insert response:', jsonError);
                throw new Error('Invalid Insert response: ' + insertText);
            }
    
            if (!insertResult.success) {
                throw new Error(`Database update failed: ${insertResult.message}`);
            }
            console.log(insertResult.message);
    
            // Redis에 SET 요청
            const redisResponse = await fetch(
                `js/bop/update_Redis_bop_diag_apply.php?` + 
                `modelName=${encodeURIComponent(modelGroup)}` +
                `&powerplant_id=${encodeURIComponent(powerplant_id)}` +
                `&group_id=${encodeURIComponent(group_id)}` +
                `&fuelcell_id=${encodeURIComponent(fuelcell_id)}`
            );
    
            // 응답 로그 추가
            const redisText = await redisResponse.text(); // 텍스트로 응답 받기
            console.log('Redis Response:', redisText); // 응답 로그
            
            // JSON 파싱 전에 응답 텍스트가 유효한 JSON인지 확인
            try {
                const redisResult = JSON.parse(redisText);
                if (!redisResult.success) {
                    throw new Error(`Redis update failed: ${redisResult.message || 'Unknown error'}`);
                }
                console.log(redisResult.message);
    
                // 성공적 업데이트 후 modelName 업데이트 이벤트 발생
                const updateModelNameEvent = new CustomEvent('modelApplied');
                document.dispatchEvent(updateModelNameEvent);
                
                // 성공 메시지 표시
                alert('모델이 성공적으로 적용되었습니다.');
    
            } catch (jsonError) {
                console.error('Error parsing Redis response:', jsonError);
                throw new Error('Invalid Redis response: ' + redisText);
            }
            
            // 데이터 로드 함수 호출
            await loadSensorModelData(modelGroup);
    
        } catch (error) {
            console.error('Error loading model data:', error);
            alert('모델 데이터 로드 중 오류가 발생했습니다: ' + error.message);
        }
    }

    setupEventListeners() {
        try {
            // select 요소 이벤트
            if (this.selectElement) {
                this.selectElement.addEventListener('change', async () => {
                    this.currentModelGroup = this.selectElement.value;
                    await this.notifyModelGroupChange();
                });
            }

            // 적용 버튼 이벤트
            if (this.applyButton) {
                this.applyButton.addEventListener('click', async () => {
                    if (confirm('모델 적용 하시겠습니까?')) {
                        await this.loadModelData();
                    }
                });
            }

            // 시작/중지 버튼 이벤트
            if (this.applyStartButton) {
                this.applyStartButton.addEventListener('click', this.boundToggleStartStop);
            }

            // 스택 변경 이벤트
            document.addEventListener('stackChanged', async () => {
                await this.loadModelGroups();
            });

        } catch (error) {
            console.warn('이벤트 리스너 설정 실패:', error);
        }
    }

    async notifyModelGroupChange() {
        const config = await getCurrentConfig();
        const event = new CustomEvent('modelGroupChanged', {
            detail: {
                modelGroup: this.currentModelGroup,
                fuelcell_id: config.fuelcell_id
            }
        });
        document.dispatchEvent(event);
    }

    getCurrentModelGroup() {
        return this.currentModelGroup;
    }

    onStackChange() {
        this.loadModelGroups();
    }

    populateDateSelectors() {
        const yearStart = document.getElementById('year-start');
        const monthStart = document.getElementById('month-start');
        const dayStart = document.getElementById('day-start');
        const yearEnd = document.getElementById('year-end');
        const monthEnd = document.getElementById('month-end');
        const dayEnd = document.getElementById('day-end');

        const currentYear = new Date().getFullYear();

        for (let year = currentYear; year >= 2000; year--) {
          const optionStart = document.createElement('option');
          optionStart.value = year;
          optionStart.textContent = year;
          yearStart.appendChild(optionStart);

          const optionEnd = document.createElement('option');
          optionEnd.value = year;
          optionEnd.textContent = year;
          yearEnd.appendChild(optionEnd);
        }

        for (let month = 1; month <= 12; month++) {
          const optionStart = document.createElement('option');
          optionStart.value = month.toString().padStart(2, '0');
          optionStart.textContent = month;
          monthStart.appendChild(optionStart);

          const optionEnd = document.createElement('option');
          optionEnd.value = month.toString().padStart(2, '0');
          optionEnd.textContent = month;
          monthEnd.appendChild(optionEnd);
        }

        for (let day = 1; day <= 31; day++) {
          const optionStart = document.createElement('option');
          optionStart.value = day.toString().padStart(2, '0');
          optionStart.textContent = day;
          dayStart.appendChild(optionStart);

          const optionEnd = document.createElement('option');
          optionEnd.value = day.toString().padStart(2, '0');
          optionEnd.textContent = day;
          dayEnd.appendChild(optionEnd);
        }
    }

    async sendDataToApi() {
        const modelGroup = this.getCurrentModelGroup();
        const config = await getCurrentConfig();  // await 추가

        const yearStart = document.getElementById('year-start').value;
        const monthStart = document.getElementById('month-start').value;
        const dayStart = document.getElementById('day-start').value;
        const yearEnd = document.getElementById('year-end').value;
        const monthEnd = document.getElementById('month-end').value;
        const dayEnd = document.getElementById('day-end').value;

        const s_date = `${yearStart}-${monthStart}-${dayStart}`;
        const e_date = `${yearEnd}-${monthEnd}-${dayEnd}`;

        const requestData = {
            model_name: modelGroup,
            powerplant_id: config.powerplant_id,  // config 객체에서 참조
            group_id: config.group_id,            // config 객체에서 참조
            fuelcell_id: config.fuelcell_id,      // config 객체에서 참조
            s_date: s_date,
            e_date: e_date
        };

        // console.log('Sending data to API with:', requestData);

        try {
            const response = await fetch('http://192.168.100.111:8082/api/dg_retry/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestData)
            });

            const result = await response.json();
            // console.log('API Response:', result); // 응답 로그 추가

            if (result.status !== 'success') {
                throw new Error(`API request failed: ${result.message}`);
            }
            // console.log('API request successful:', result.message);
            alert('성공적으로 시작되었습니다.'); // 성공 메시지 출력

            this.updateButtonToStop();
        } catch (error) {
            // console.error('Error sending data to API:', error);
            alert('API 요청 중 오류가 발생했습니다.'); // 오류 메시지 출력
        }
    }

    updateButtonToStop() {
        this.applyStartButton.innerHTML = '<span class="icon-h2s-stop-2"></span> 중지';
        this.applyStartButton.id = 'bop-diag-apply-stop-button';
        this.isRunning = true;
    }

    updateButtonToStart() {
        this.applyStartButton.innerHTML = '<span class="icon-play3"></span> 시작';
        this.applyStartButton.id = 'bop-diag-apply-start-button';
        this.isRunning = false;
    }

    async toggleStartStop(event) {
        event.preventDefault();
        
        if (this.isRunning) {
            if (confirm('중지하시겠습니까?')) {
                alert('중지되었습니다.');
                this.updateButtonToStart();
            }
        } else {
            if (confirm('시작 하시겠습니까?')) {
                await this.sendDataToApi();  // await 추가
            }
        }
    }

    ///////////////////////////////////////////////////////////////////////////////////////////////
    // 프로그레스바
    async checkModelStatus() {
        try {
            const config = await getCurrentConfig();  // await 추가
            const response = await fetch(
                `js/bop/get_model_status.php?` +
                `powerplant_id=${encodeURIComponent(config.powerplant_id)}` +  // config 객체에서 참조
                `&fuelcell_id=${encodeURIComponent(config.fuelcell_id)}`       // config 객체에서 참조
            );
            const data = await response.json();
            
            if (data.status === 'true') {
                this.showRunningStatus();
            } else {
                this.hideRunningStatus();
            }
        } catch (error) {
            console.warn('모델 상태 확인 중 오류:', error);
        }
    }

    showRunningStatus() {
        if (this.statusElement) {
          this.statusElement.style.display = 'block';
          if (this.statusTextElement) {
            this.statusTextElement.textContent = '동작중';
          }
        }
    }

    hideRunningStatus() {
        if (this.statusElement) {
          this.statusElement.style.display = 'none';
        }
    }
}

// 싱글톤 인스턴스를 위한 변수 추가
let diagModelSelectorInstance = null;
export function getDiagModelSelector() {
  if (!diagModelSelectorInstance) {
    diagModelSelectorInstance = new DiagModelSelector();
  }
  return diagModelSelectorInstance;
}

// 페이지 로드 시 DiagModelSelector 인스턴스 생성
document.addEventListener('DOMContentLoaded', () => {
  getDiagModelSelector();
});
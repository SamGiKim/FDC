import { SessionService } from '../config/get_session.js';
import FacilityNameService from '../config/get_facility_name.js';
import { loadLocale } from '../config/i18n.js';

class FuelcellListManager {
    // 클릭 핸들러 함수 추가
    static handleFuelcellClick(powerplantId, groupId, fuelcellId, event) {
        event.preventDefault();
        const url = `index.html?plant=${powerplantId}&group=${groupId}&fuelcell=${fuelcellId}`;
        window.location.replace(url);
        return false;
    }

    // 상태 코드를 다국어 텍스트로 변환하는 함수
    static async getStatusText(statusCode) {
        const locale = localStorage.getItem('locale') || 'ko';
        const messages = await loadLocale(locale);
        
        const statusMap = {
            '-1': 'dashboard.status.stop',     // 정지/stop
            '0': 'dashboard.status.normal',    // 정상/normal
            '1': 'dashboard.status.alert',     // 주의/alert
            '2': 'dashboard.status.warn',      // 경고/warn
            '3': 'dashboard.status.critical'   // 심각/critical
        };
        
        const key = statusMap[statusCode.toString()];
        if (!key) return statusCode.toString(); // 매핑되지 않은 코드는 그대로 반환
        
        // 키를 통해 다국어 메시지 찾기
        const keys = key.split('.');
        let value = messages;
        
        keys.forEach(k => {
            if (value && value[k]) {
                value = value[k];
            } else {
                value = null;
            }
        });
        
        return value || statusCode.toString(); // 값이 없으면 원래 코드 반환
    }

      // 상태 코드에 따른 CSS 클래스 반환
      static getStatusClass(statusCode) {
        const statusMap = {
            '-1': 'stop-C',
            '0': 'normal-C',
            '1': 'watchout-C',
            '2': 'warning-C',
            '3': 'critical-C'
        };
        
        return statusMap[statusCode.toString()] || 'normal-C';
    }



    static async updateGroupList() {
        try {
            // DOM 요소 확인을 위한 재시도 로직 추가
            let retryCount = 0;
            let tbody;
            
            while (!tbody && retryCount < 5) {
                tbody = document.getElementById('fuelcell-list');
                if (!tbody) {
                    await new Promise(resolve => setTimeout(resolve, 100)); // 100ms 대기
                    retryCount++;
                    console.log(`tbody 요소 찾기 시도 ${retryCount}`);
                }
            }
    
            if (!tbody) {
                throw new Error('테이블 요소를 5회 시도 후에도 찾을 수 없습니다');
            }
    
            console.log('tbody 요소 찾음:', tbody);
    
            // 세션 정보 가져오기
            const sessionInfo = await SessionService.getSessionInfo();
            console.log('세션 정보:', sessionInfo);
    
            if (!sessionInfo.account_powerplants || sessionInfo.account_powerplants.length === 0) {
                throw new Error('사용 가능한 발전소가 없습니다');
            }
    
            const powerplantId = sessionInfo.account_powerplants[0];
            console.log('선택된 발전소 ID:', powerplantId);
    
            // Redis에서 데이터 가져오기
            const response = await axios.get(`js/config/get_redis_data.php?key=${powerplantId}_dash_total_web`);
            console.log('Redis 응답:', response.data);
            console.log('연료전지 목록:', response.data.fuelcell_list);
    
            if (!response.data || !response.data.fuelcell_list) {
                throw new Error('연료전지 데이터를 찾을 수 없습니다');
            }
    
            const fuelcellList = response.data.fuelcell_list;
            console.log('처리할 연료전지 목록:', fuelcellList);
    
            tbody.innerHTML = ''; // 기존 내용 비우기
    
             // 모든 행을 생성하기 전에 상태 텍스트 변환 준비
             const statusPromises = Object.entries(fuelcellList).map(async ([fuelcellId, data]) => {
                const statusText = await this.getStatusText(data.fuelcell_status);
                const statusClass = this.getStatusClass(data.fuelcell_status);
                return { fuelcellId, data, statusText, statusClass };
            });
            
            // 모든 상태 텍스트 변환 완료 대기
            const rowsData = await Promise.all(statusPromises);
            
            // 변환된 상태 텍스트로 행 생성
            const rows = rowsData.map(({ fuelcellId, data, statusText, statusClass }) => `
            <tr>
                <td onclick="(function(e) {
                    e = e || window.event;
                    e.preventDefault();
                    const url = 'index.html?plant=${powerplantId}&group=${data.group_id}&fuelcell=${fuelcellId}';
                    window.history.replaceState({}, '', url);
                    window.location.href = url;
                    return false;
                })(event)">${data.fuelcell_name}</td>
                <td>${data.group_name}</td>
                <td>${data.e_prod_per_cap}</td>
                <td>${data.t_prod_per_cap}</td>
                <td> - <span class="normal-C">(-)</span></td>
                <td class="${statusClass}">${statusText}</td>
            </tr>
            `);
    
            // 모든 행을 한번에 DOM에 추가
            tbody.innerHTML = rows.join('');
            console.log('테이블 업데이트 완료');
    
        } catch (error) {
            console.error('연료전지 목록 업데이트 실패:', error);
        }
    }
    static startAutoUpdate(interval = 5000) {  // 5초마다 업데이트
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // 즉시 한 번 실행
        this.updateGroupList();
        
        // 5초마다 실행
        this.updateInterval = setInterval(() => {
            this.updateGroupList();
        }, interval);
    }

    
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 즉시 한 번 실행
    FuelcellListManager.updateGroupList();
    
    // 5초마다 실행
    setInterval(() => {
        FuelcellListManager.updateGroupList();
    }, 5000);  // 5000ms = 5초
});

export default FuelcellListManager;
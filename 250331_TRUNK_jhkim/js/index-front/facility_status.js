import { SessionService } from '../config/get_session.js';

class FacilityStatusManager {
    static async updateFacilityStatus() {
        try {
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

            if (!response.data || !response.data.facilities) {
                throw new Error('시설 상태 데이터를 찾을 수 없습니다');
            }

            const facilities = response.data.facilities;
            console.log('시설 상태:', facilities);

            // 상태 업데이트
            const statusRow = document.getElementById('group-status');
            if (statusRow) {
                statusRow.innerHTML = `
                    <td class="total-count">${facilities.total}</td>
                    <td class="normal-C">${facilities.norm}</td>
                    <td class="watchout-C">${facilities.caut}</td>
                    <td class="warning-C">${facilities.warn}</td>
                    <td class="critical-C">${facilities.crit}</td>
                    <td class="stop-C">${facilities.stop}</td>
                `;
            }

        } catch (error) {
            console.error('시설 상태 업데이트 실패:', error);
        }
    }

    static startAutoUpdate(interval = 5000) {  // 5초마다 업데이트
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        
        // 즉시 한 번 실행
        this.updateFacilityStatus();
        
        // 5초마다 실행
        this.updateInterval = setInterval(() => {
            this.updateFacilityStatus();
        }, interval);
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    // 즉시 한 번 실행
    FacilityStatusManager.updateFacilityStatus();
    
    // 5초마다 실행
    setInterval(() => {
        FacilityStatusManager.updateFacilityStatus();
    }, 5000);  // 5000ms = 5초
});

export default FacilityStatusManager;

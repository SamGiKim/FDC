import { SessionService } from '../config/get_session.js';

class FuelcellGroupListManager {
    static async updateGroupList() {
        try {
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
            console.log('그룹 목록:', response.data.fuelcell_group_list);  // 추가

            if (!response.data || !response.data.fuelcell_group_list) {
                throw new Error('그룹 데이터를 찾을 수 없습니다');
            }

            const groupList = response.data.fuelcell_group_list;
            console.log('처리할 그룹 목록:', groupList);  // 추가

            const tbody = document.getElementById('group-list');
            console.log('tbody 요소:', tbody);  // 추가
            
            if (!tbody) {
                throw new Error('테이블 요소를 찾을 수 없습니다');
            }

            tbody.innerHTML = '';

            // 모든 행을 한번에 생성
            const rows = Object.entries(groupList).map(([groupId, data]) => {
                console.log('처리중인 그룹:', { groupId, data });  // 디버깅용
                return `
                    <tr>
                        <td>${data.group_name}</td>
                        <td>${data.e_prod_per_cap}</td>
                        <td>${data.t_prod_per_cap}</td>
                        <td>${data.fuelcell_count || 0}</td>
                        <td class="normal-C">0</td>
                        <td class="watchout-C">0</td>
                        <td class="warning-C">0</td>
                        <td class="critical-C">0</td>
                        <td class="stop-C">0</td>
                        <td>${data.group_rate}</td>
                    </tr>
                `;
            });

            tbody.innerHTML = rows.join('');

        } catch (error) {
            console.error('연료전지 그룹 목록 업데이트 실패:', error);
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
    FuelcellGroupListManager.updateGroupList();
    
    // 5초마다 실행
    setInterval(() => {
        FuelcellGroupListManager.updateGroupList();
    }, 5000);  // 5000ms = 5초
});

export default FuelcellGroupListManager;
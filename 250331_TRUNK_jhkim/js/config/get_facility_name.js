// js/config/get_facility_name.js
import { SessionService } from './get_session.js';

class FacilityNameService {
    static async getPlantName() {
        try {
            const sessionInfo = await SessionService.getSessionInfo();
            // 여기서 powerplant_id가 아닌 account_powerplants[0]를 사용해야 함
            const powerplantId = sessionInfo.account_powerplants[0];  // 수정된 부분
            
            const response = await axios.get('js/config/get_powerplant_info.php', {
                params: { powerplant_id: powerplantId }
            });
            
            return response.data.powerplant_name;
        } catch (error) {
            console.error('발전소 이름 조회 실패:', error);
            throw error;
        }
    }

    static async getGroupName(groupId) {
        try {
            const sessionInfo = await SessionService.getSessionInfo();
            const powerplantId = sessionInfo.powerplant_id;
            
            const response = await axios.get('js/config/get_group_info.php', {
                params: { 
                    powerplant_id: powerplantId,
                    group_id: groupId
                }
            });
            
            return response.data.group_name;
        } catch (error) {
            console.error('그룹 이름 조회 실패:', error);
            throw error;
        }
    }

    static async getFuelcellName(fuelcellId) {
        try {
            const sessionInfo = await SessionService.getSessionInfo();
            const powerplantId = sessionInfo.powerplant_id;
            
            const response = await axios.get('js/config/get_fuelcell_info.php', {
                params: { 
                    powerplant_id: powerplantId,
                    fuelcell_id: fuelcellId
                }
            });
            
            return response.data.fuelcell_name;
        } catch (error) {
            console.error('연료전지 이름 조회 실패:', error);
            throw error;
        }
    }

    static async updateAllTitles() {
        try {
            const plantName = await this.getPlantName();
            
            // 모든 발전소 이름 표시 요소 업데이트
            const titleElements = document.querySelectorAll('[data-i18n="system_title"]');
            titleElements.forEach(element => {
                element.textContent = `${plantName} 연료전지 관제 시스템`;
            });
        } catch (error) {
            console.error('이름 업데이트 실패:', error);
        }
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    FacilityNameService.updateAllTitles();
});

export default FacilityNameService
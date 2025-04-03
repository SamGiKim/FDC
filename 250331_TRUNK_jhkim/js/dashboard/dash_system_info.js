import { loadAllData } from '../config/redis_dataManager.js';

const SystemInfoManager = {
    loadSystemData: function() {
        loadAllData()
            .then(data => {
                console.log('Raw Fetched Data:', data);
                if (data && data.system_info) {
                    this.updateSystemInfo(data.system_info);
                } else {
                    console.error('유효한 시스템 정보를 찾을 수 없습니다.');
                    this.updateSystemInfo(getDefaultSystemInfo());
                }
            })
            .catch(error => {
                console.error('데이터를 불러오는 데 실패했습니다.', error);
                this.updateSystemInfo(getDefaultSystemInfo());
            });
    },

    updateSystemInfo: function(systemInfo) {
        // 필요한 모든 요소가 존재하는지 확인
        const typeElement = document.getElementById('type');
        const capacityElement = document.getElementById('capacity');
        const addressElement = document.getElementById('address');
        const installDateElement = document.getElementById('install_date');
        
        // 요소가 존재하지 않으면 조용히 함수 종료
        if (!typeElement || !capacityElement || !addressElement || !installDateElement) {
            return;
        }
    
        // 요소가 모두 존재할 때만 업데이트 진행
        typeElement.innerText = systemInfo.type || '-';
        capacityElement.innerText = systemInfo.capacity || '-';
        addressElement.innerText = systemInfo.address || '-';
        installDateElement.innerText = systemInfo.install_date || '-';
    }
};

// 기본 시스템 정보 반환 함수
function getDefaultSystemInfo() {
    return {
        type: 'N/A',
        capacity: 'N/A',
        address: 'N/A',
        install_date: 'N/A'
    };
}

export default SystemInfoManager;

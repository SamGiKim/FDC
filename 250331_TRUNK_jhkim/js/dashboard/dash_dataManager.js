import { fuelcellConfig, getFuelcellSectionId, getSelectedFuelcell } from '../config/fuelcellSelector.js';

const baseDataUrl = "http://fuelcelldr.nstek.com:11180/FDC/Proj/mjkoo/js/config/redis_config.php";
let currentSection =  getFuelcellSectionId(Object.keys(fuelcellConfig[0]));

let cachedData = null;

export async function loadData() {
    if (cachedData) return cachedData;

    try {
        const url = `${baseDataUrl}?section=${encodeURIComponent(currentSection)}`;
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();

        // console.log('Raw Data:', result);

        if (result.error) {
            throw new Error(result.error);
        }
        
        if (!result.data || typeof result.data !== 'object' || !result.data.value || typeof result.data.value !== 'object') {
            throw new Error('Invalid data structure');
        }
        
        cachedData = result.data.value;
        return cachedData;
    } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error);
        throw error;
    }
}

export function setDefaultSection(sectionId) {
    currentSection = sectionId;
    cachedData = null; // 섹션이 변경되면 캐시 초기화
}

export const startDataRefresh = (callback, interval = 10000) => {
    const refreshData = () => {
        loadData().then(data => {
            cachedData = data;
            callback(data);
        }).catch(error => {
            console.error('데이터 로딩 중 오류:', error);
        });
    };
    refreshData();
    setInterval(refreshData, interval);
};

export async function loadAllData() {
    return loadData();
}
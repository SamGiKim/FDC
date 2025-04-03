import { getSelectedFuelcell, extractInfoFromSectionId, getCurrentConfig  } from "./fuelcellSelector.js";

const baseDataUrl = "js/config/redis_config.php"; // 기본 데이터 URL
let currentSection = null;  
let cachedData = null;

export function getCurrentSection() {
    return currentSection;
}

// 섹션 ID 생성 함수
function createSectionId(config) {
    return `${config.powerplant_id}_${config.fuelcell_id}_dash_web`;
}

// 데이터 로드 이벤트 리스너 추가
document.addEventListener('fuelcellChanged', async (event) => {
    const { plant, fuelcell } = event.detail;
    const sectionId = `${plant}_${fuelcell}_dash_web`;
    await setDefaultSection(sectionId);
    
    const newData = await loadAllData();
    if (newData) {
        document.dispatchEvent(new CustomEvent('dataLoaded', { detail: newData }));
    }
});

export async function setDefaultSection(section = null) {
    try {
        if (!section) {
            const config = await getCurrentConfig();
            section = createSectionId(config);
        }
        
        // Promise가 전달된 경우 해결
        if (section instanceof Promise) {
            section = await section;
        }
        
        if (typeof section !== 'string' || !section.trim()) {
            throw new Error('유효하지 않은 섹션: ' + section);
        }
        
        currentSection = section;
        cachedData = null;
        console.log('섹션이 설정되었습니다:', section);
    } catch (error) {
        console.error('섹션 설정 실패:', error);
        throw error;
    }
}


async function loadData(forceRefresh = false) {
    try {
        const currentSection = getCurrentSection();
        console.log('현재 섹션 ID:', currentSection);

        if (!currentSection) {
            console.log('섹션이 없음, 현재 설정에서 섹션 생성 시도');
            await setDefaultSection();
        }

        const url = `js/config/redis_config.php?section=${currentSection}`;
        console.log('요청 URL:', url);

        const response = await fetch(url);
        console.log('서버 응답 상태:', response.status);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const responseData = await response.json();
        console.log('받은 데이터:', responseData);

        // 데이터 구조 확인 및 처리
        if (responseData.data && responseData.data.value) {
            // value 객체를 반환
            return responseData.data.value;
        } else if (responseData.error) {
            console.log('섹션을 찾을 수 없음. 현재 섹션:', currentSection);
            
            if (!forceRefresh) {
                console.log('3초 후 재시도...');
                await new Promise(resolve => setTimeout(resolve, 3000));
                return await loadData(true);
            }
            return await getDefaultData();
        }

        return await getDefaultData();

    } catch (error) {
        console.error('데이터 로드 중 상세 에러:', error);
        return await getDefaultData();
    }
}

async function getDefaultData() {
    return {
        fuelcell_id: await getSelectedFuelcell() || "", 
        stack_info: {},
        realtime_production: { e: 0, t: 0 },
        real_per_production: { e: 0, t: 0 },
        operation_rate: {},
        e_production: {},
        t_production: {},
        e_capacity: {},
        e_operation: {},
        result_event: {},
        BOP: {},
        HW_Alert: {}
    };
}

export const startDataRefresh = (callback, interval = 50000) => {
    const refreshData = () => {
        loadData(true).then(data => {
            callback(data);
        }).catch(error => {
            console.error('데이터 로딩 중 오류:', error);
        });
    };
    refreshData();
    return setInterval(refreshData, interval);
};

export async function loadAllData() {
    return loadData(true);
}

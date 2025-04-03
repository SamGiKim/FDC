import { getSelectedFuelcell, fuelcellConfig } from '../config/fuelcellSelector.js';

export async function updateModelName() {
    try {
        const modelNameElement = document.querySelector('.model-apply-name');
        if (!modelNameElement) {
            // console.warn('모델명 요소를 찾을 수 없습니다.');
            return;
        }

        // URL 파라미터에서 값 가져오기 (최우선)
        const urlParams = new URLSearchParams(window.location.search);
        let plant = urlParams.get('plant');
        let fuelcell = urlParams.get('fuelcell');

        // URL 파라미터가 없으면 선택된 값 사용
        if (!plant || !fuelcell) {
            const selectedFuelcell = await getSelectedFuelcell();
            if (!selectedFuelcell) {
                console.warn('선택된 연료전지 정보를 찾을 수 없습니다.');
                modelNameElement.textContent = '연료전지 미선택';  // 메시지 수정
                return;
            }

            const fuelcellData = fuelcellConfig[selectedFuelcell];
            if (!fuelcellData) {
                console.warn('연료전지 설정을 찾을 수 없습니다.');
                modelNameElement.textContent = '설정 없음';  // 메시지 수정
                return;
            }

            plant = fuelcellData.plant;
            fuelcell = fuelcellData.fuelcell;
        }

        if (!plant || !fuelcell) {
            console.warn('필요한 파라미터가 없습니다:', { plant, fuelcell });
            modelNameElement.textContent = '파라미터 누락';  // 메시지 수정
            return;
        }

        const url = `js/bop/get_model_apply.php?plant=${encodeURIComponent(plant)}&fuelcell=${encodeURIComponent(fuelcell)}`;
        console.log('모델명 요청 URL:', url);

        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            credentials: 'include'
        });

        if (!response.ok) {
            console.warn('모델명 데이터 로드 실패:', response.status);
            modelNameElement.textContent = '로드 실패';  // 메시지 수정
            return;
        }

        const data = await response.json();
        
        if (!data || !data.data) {
            console.warn('유효하지 않은 모델명 데이터:', data);
            modelNameElement.textContent = '적용된 모델 없음';  // 메시지 수정
            console.log(`${plant}_${fuelcell}_model_apply 데이터가 없습니다.`);  // Redis 키 정보 추가
            return;
        }

        modelNameElement.textContent = data.data;

    } catch (error) {
        console.warn('모델명 업데이트 실패:', error);
        const modelNameElement = document.querySelector('.model-apply-name');
        if (modelNameElement) {
            modelNameElement.textContent = '오류 발생';  // 메시지 수정
        }
    }
}

// 페이지 로드 시 자동 업데이트
document.addEventListener('DOMContentLoaded', () => {
    updateModelName().catch(error => {
        console.warn('초기 모델명 업데이트 실패:', error);
    });
});

// 주기적 업데이트 설정 (선택적)
setInterval(() => {
    updateModelName().catch(error => {
        console.warn('주기적 모델명 업데이트 실패:', error);
    });
}, 5000); // 5초마다 업데이트

// AVHA_state.js 전류/전압/수소/공기 현황
import { getCurrentConfig } from '../config/fuelcellSelector.js';

// Chart.js는 이미 script 태그에서 로드되었으므로 별도의 등록이 필요 없습니다.

document.addEventListener('DOMContentLoaded', function() {
    // 초기 데이터 로드 및 주기적 업데이트 설정
    fetchAndUpdateData();
    const intervalId = setInterval(fetchAndUpdateData, 5000);

    // 설정 변경 시 데이터 업데이트
    document.addEventListener('configChanged', fetchAndUpdateData);

    // 페이지 이탈 시 인터벌 정리 (선택사항)
    window.addEventListener('unload', () => clearInterval(intervalId));
});

async function fetchAndUpdateData() {
    try{
        const{ powerplant_id, fuelcell_id} = getCurrentConfig();
        const response = await fetch('js/stack/get_AVHA_value.php', {
            method:'POST',
            headers:{
                'Content-Type' : 'application/json',
            },
            body:JSON.stringify({
                powerplant_id,
                fuelcell_id
            })
        });

        const data = await response.json();
        updateValues(data.data || null);
    }catch(error){
        console.error('데이터 조회 오류:', error);
        updateValues(null);
    }
}


function updateValues(data) {
    // DOM 요소 가져오기
    const ampereValueElement = document.getElementById('ampere-value');
    const voltValueElement = document.getElementById('volt-value');
    const hydroValueElement = document.getElementById('hydro-value');
    const airValueElement = document.getElementById('air-value');
    const stoiH2ValueElement = document.getElementById('stoi-h2-value');
    const stoiAirValueElement = document.getElementById('stoi-air-value');

    // 데이터가 있는 경우 각 요소에 값을 할당, 없으면 '-' 표시
    if (ampereValueElement) ampereValueElement.textContent = data ? (data['Current'] || '-') : '-';
    if (voltValueElement) voltValueElement.textContent = data ? (data['Voltage'] || '-') : '-';
    if (hydroValueElement) hydroValueElement.textContent = data ? (data['MFC1(H2)'] || '-') : '-';
    if (airValueElement) airValueElement.textContent = data ? (data['MFM3(Air)'] || '-') : '-';
    if (stoiH2ValueElement) stoiH2ValueElement.textContent = data ? (data['Stoi(H2)'] || '-') : '-';
    if (stoiAirValueElement) stoiAirValueElement.textContent = data ? (data['Stoi(Air)'] || '-') : '-';
}


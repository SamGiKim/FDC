import { getCurrentConfig } from '../config/fuelcellSelector.js';

// Redis에서 BOP SOH 값을 가져와 표시하는 함수
async function fetchAndDisplayBopSoh() {
  try {
    const config = await getCurrentConfig();
    const { powerplant_id, fuelcell_id } = config;
    
    fetch(`js/bop/get_bop_soh.php?powerplantId=${powerplant_id}&fuelcellId=${fuelcell_id}`)
      .then(response => response.json())
      .then(data => {
          const bopSohElement = document.getElementById('bop-quality-index');
          if (bopSohElement) {
              if (data.error || !data.success) {
                  console.error('BOP SOH 가져오기 오류:', data.error);
                  bopSohElement.textContent = '-';
                  return;
              }
              
              // 데이터가 있으면 표시, 없으면 '-' 표시
              bopSohElement.textContent = data.data || '-';
          } else {
              console.error('bop-quality-index 요소를 찾을 수 없습니다.');
          }
      })
      .catch(error => {
          console.error('오류:', error);
          const bopSohElement = document.getElementById('bop-quality-index');
          if (bopSohElement) {
              bopSohElement.textContent = '-';
          }
      });
  } catch (error) {
    console.error('발전소 및 연료전지 정보 가져오기 오류:', error);
    const bopSohElement = document.getElementById('bop-quality-index');
    if (bopSohElement) {
        bopSohElement.textContent = '-';
    }
  }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
  fetchAndDisplayBopSoh();
  
  // 필요한 경우 주기적으로 업데이트
  setInterval(fetchAndDisplayBopSoh, 60000); // 1분마다 업데이트
});

// 연료전지 변경 이벤트 리스너 추가
document.addEventListener('fuelcellChanged', () => {
  fetchAndDisplayBopSoh();
});
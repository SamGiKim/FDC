// search_redisDataHandler.js
import { copySelectedFiles } from './stack_search.js';
import { getSelectedFuelcell, getFuelcellConfig } from '../config/fuelcellSelector.js';

// Redis 데이터 가져오기 및 처리
export async function fetchRedisDataAndUpdate() {
    const selectedFuelcell = getSelectedFuelcell();
    const redisKey = `${selectedFuelcell}_fdu_prg`; // Redis 키를 연료전지 ID로 변경
    const url = `js/stack/unitControl_redis.php?key=${encodeURIComponent(redisKey)}`;
  
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
  
        if (result.error) {
            throw new Error(result.error);
        }
  
        // CMD 값 확인
        if (result.data && typeof result.data === 'string') {
            const parsedData = JSON.parse(result.data);
            if (parsedData.CMD === 'EIS') {
                // MySQL에서 가장 최근의 NO 값을 가진 데이터 가져오기
                await fetchLatestDataFromMySQL();
            }
        }
    } catch (error) {
        console.error('Redis 데이터를 불러오는 데 실패했습니다.', error);
    }
  }
  
  // MySQL에서 가장 최근의 NO 값을 가진 데이터 가져오기
  async function fetchLatestDataFromMySQL() {
    const selectedFuelcell = getSelectedFuelcell();
    try {
        const response = await fetch(`js/stack/get_latest_data.php?fuelcell=${selectedFuelcell}`); // 연료전지 ID 전달
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
  
        if (result.success) {
            // 가장 최근의 NO 값을 가진 데이터 처리
            const latestData = result.data; // 가장 최근 데이터
            console.log('가장 최근 데이터:', latestData);

            // 전체 체크박스 해제 및 마지막 데이터 체크
            updateCheckboxes(latestData.NO);
  
            copySelectedFiles(); // 그래프 생성 함수 호출
        } else {
            console.error('데이터를 가져오는 데 실패했습니다:', result.message);
        }
    } catch (error) {
        console.error('MySQL 데이터를 불러오는 데 실패했습니다.', error);
    }
  }

  
// 전체 체크박스 해제 및 마지막 데이터 체크
function updateCheckboxes(latestNo) {
    const checkboxes = document.querySelectorAll('input[type="checkbox"][name="search-checkbox"]');
    
    // 전체 체크박스 해제
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });

    // 마지막 추가된 NO를 가진 데이터 체크
    const latestCheckbox = Array.from(checkboxes).find(checkbox => checkbox.getAttribute('data-no') === latestNo.toString());
    if (latestCheckbox) {
        latestCheckbox.checked = true;
    }
}

  
  // DOMContentLoaded 이벤트에서 초기화
  document.addEventListener('DOMContentLoaded', () => {
    fetchRedisDataAndUpdate(); // 자동 실행
  });
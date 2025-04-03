// parent_eventManager.js 
// DOM loadded 됐을 때, event handling만 하는 것

import { loadData, startDataRefresh } from './parent_dataManager.js';
import { parentBarManager } from './parent_bar.js';
// import { parentRealTimeManager } from './parent_realTime.js';

/**********************************************************************************/
document.addEventListener('DOMContentLoaded', function () {
  //startDataRefresh 함수의 콜백에서 반환된 설정 데이터 저장
  // 이후 다른 함수나 이벤트 핸들러에서 이 데이터를 참조할 때 사용
  // 설정 파일에서 로드된 데이터가 필요한 경우, currentConf 변수를 통해 접근(callback)
  let currentConf = null;

  // 차트 초기화 함수 호출
  initializeCharts();

  // 초기 데이터 로드 및 차트 생성
  loadData().then(conf => {
    currentConf = conf;
    initializeCharts(); // 차트 초기화
    // parentRealTimeManager.loadRealTimeProductionData(); // 실시간 생산량 데이터 로드
  });

  // [전기생산량/열생산량]
  function initializeCharts() {
    const chartIds = {
      'e_t_hour': ['e_t_hour_1'],
      'e_t_day': ['e_t_day_1'],
      'e_t_month': ['e_t_month_1']
    };

    Object.keys(chartIds).forEach(section => {
      loadData(section).then(conf => {
        if (conf && typeof conf === 'object' && Object.keys(conf).length > 0) {
          const data = parentBarManager.parseDayMonthConf(conf, section);
          chartIds[section].forEach(chartId => {
            parentBarManager.createChart(chartId, data, section);
          });
        } else {
          console.warn(`차트 초기화 실패: ${section}에 대한 유효한 데이터가 없습니다.`);
        }
      }).catch(error => {
        console.error(`차트 초기화 중 오류 발생 (${section}):`, error);
      });
    });
  }
  /**********************************************************************************/
  // 초기 데이터 로드 및 차트 생성
  loadData().then(conf => {
    // console.log(conf);
    currentConf = conf;
    initializeCharts(); // [전기생산량/열생산량]
    // parentRealTimeManager.loadRealTimeProductionData(); //[실시간생산량]
  });

  /**********************************************************************************/

  // 주기적 데이터 업데이트 및 차트 업데이트
  startDataRefresh(conf => {
    currentConf = conf;
    if (currentConf && typeof currentConf === 'object' && Object.keys(currentConf).length > 0) {
      ['e_t_hour', 'e_t_day', 'e_t_month'].forEach(section => {
        loadData(section).then(data => {
          if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            parentBarManager.updateCharts([`${section}_1`], data, section);
          } else {
            console.warn(`차트 업데이트 실패: ${section}에 대한 유효한 데이터가 없습니다.`);
          }
        }).catch(error => {
          console.error(`차트 업데이트 중 오류 발생 (${section}):`, error);
        });
      });
    } else {
      console.warn('데이터 새로고침 실패: 유효한 데이터가 없습니다.');
    }
  });

  // select 요소의 onchange 이벤트 핸들러 함수
  document.getElementById('site-select').addEventListener('change', redirectToIndex);
});

// select 요소의 onchange 이벤트 핸들러 함수
function redirectToIndex() {
  var selectElement = document.getElementById("site-select");
  var selectedValue = selectElement.value;

  if (selectedValue) {
    var newPath;

    switch (selectedValue) {
      case "0":
        newPath = "index-front.html"; // 부안발전소를 선택한 경우
        break;
      case "1":
        newPath = "index_stk1.html"; // 1호기를 선택한 경우
        break;
      case "2":
        newPath = "index.html"; // 2호기를 선택한 경우
        break;
      default:
        break;
    }

    window.location.href = newPath;
  }
}
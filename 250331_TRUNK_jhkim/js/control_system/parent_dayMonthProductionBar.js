// parent_dayMonthProductionBar.js
import { startDataRefresh } from './parent_dataManager.js';

// 차트 데이터를 업데이트하는 함수
function updateChartData(data) {
  console.log("업데이트할 차트 데이터:",  data);

  // 데이터 존재 여부 확인
  const eDayData = data['e_day'] ? transformDataToChartData(data['e_day']) : null;
  const eHourData = data['e_hour'] ? transformDataToChartData(data['e_hour']) : null;
  const eMonthData = data['e_month'] ? transformDataToChartData(data['e_month']) : null;
  const tDayData = data['t_day'] ? transformDataToChartData(data['t_day']) : null;
  const tHourData = data['t_hour'] ? transformDataToChartData(data['t_hour']) : null;
  const tMonthData = data['t_month'] ? transformDataToChartData(data['t_month']) : null;

  // 차트 생성 또는 업데이트 (데이터가 null이 아닌 경우에만 실행)
  if (eDayData) createOrUpdateChart('e_day_1', eDayData);
  if (eHourData) createOrUpdateChart('e_hour_1', eHourData);
  if (eMonthData) createOrUpdateChart('e_month_1', eMonthData);
  if (tDayData) createOrUpdateChart('t_day_1', tDayData);
  if (tHourData) createOrUpdateChart('t_hour_1', tHourData);
  if (tMonthData) createOrUpdateChart('t_month_1', tMonthData);
}

// 데이터를 차트 형식에 맞게 변환하는 함수
function transformDataToChartData(dataSection) {
  if (!dataSection) {
    // 데이터 섹션이 없는 경우, 빈 차트 데이터 반환
    return {
      labels: [],
      datasets: [{
        label: 'production',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 1
      }]
    };
  }

  // 정상적인 데이터 변환 로직
  return {
    labels: Object.keys(dataSection).map(key => key.split('_')[2]),
    datasets: [{
      label: 'production',
      data: Object.values(dataSection),
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1
    }]
  };
}

// 차트를 생성하거나 업데이트하는 함수
function createOrUpdateChart(canvasId, data) {
  let chart = Chart.getChart(canvasId); // Chart.js 3.x 버전
  console.log(`차트 ${chart ? "업데이트" : "생성"}:`,  canvasId);
  if (chart) {
    chart.data = data;
    chart.update();
  } else {
    const ctx = document.getElementById(canvasId).getContext('2d');
    chart = new Chart(ctx, {
      type: 'bar',
      data: data,
      options: {
        scales: {
          x: {
            ticks: {
              autoSkip: true,
              maxRotation: 0,
              minRotation: 0,
              font: {
                size: 12
              }
            }
          },
          y: {
            beginAtZero: true
          }
        },
        responsive: true,
        maintainAspectRatio: false
      }
    });
  }
}

// 데이터 새로고침 시작
startDataRefresh(updateChartData, 10000);

document.addEventListener('DOMContentLoaded', function () {
  // 초기 차트 로드
  startDataRefresh(updateChartData, 10000);
});

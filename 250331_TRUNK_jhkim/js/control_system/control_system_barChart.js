//control_systel_barChart.js
import { startDataRefresh, processChartData } from './control_system_dataManager.js';

let hourlyChart, dailyChart, monthlyChart;

function createChart(ctx, labels, electricityData, heatData, title) {
  return new Chart(ctx, {
      type: 'bar',
      data: {
          labels: labels,
          datasets: [
              {
                  label: '전력생산량',
                  data: electricityData,
                  backgroundColor: 'rgba(0, 123, 255, 0.5)',
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 1,
                  type: 'bar',
                  yAxisID: 'y-axis',
              },
              {
                  label: '전력생산량',
                  data: electricityData,
                  borderColor: 'rgba(0, 123, 255, 1)',
                  borderWidth: 2,
                  type: 'line',
                  fill: false,
                  pointRadius: 0,
                  yAxisID: 'y-axis',
                  tension: 0.4,
              },
              {
                  label: '열생산량',
                  data: heatData,
                  backgroundColor: 'rgba(255, 0, 0, 0.5)',
                  borderColor: 'rgba(255, 0, 0, 1)',
                  borderWidth: 1,
                  type: 'bar',
                  yAxisID: 'y-axis',
              },
              {
                  label: '열생산량',
                  data: heatData,
                  borderColor: 'rgba(255, 0, 0, 1)',
                  borderWidth: 2,
                  type: 'line',
                  fill: false,
                  pointRadius: 0,
                  yAxisID: 'y-axis',
                  tension: 0.4,
              }
          ]
      },
      options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
              x: {
                  title: {
                      display: true,
                      text: title
                  }
              },
              'y-axis': {
                  type: 'linear',
                  position: 'left',
                  title: {
                      display: true,
                      text: '생산량 (kW)'
                  },
                  min: 0,
              }
          },
          plugins: {
              legend: {
                  display: true,
                  position: 'top',
                  labels: {
                      filter: function(item, chart) {
                          // 막대 그래프 레이블만 표시 (짝수 인덱스)
                          return item.datasetIndex % 2 === 0;
                      }
                  }
              }
          }
      }
  });
}


export function initializeCharts() {
    const hourlyCtx = document.getElementById('e_t_hour_1').getContext('2d');
    const dailyCtx = document.getElementById('e_t_day_1').getContext('2d');
    const monthlyCtx = document.getElementById('e_t_month_1').getContext('2d');

    hourlyChart = createChart(hourlyCtx, [], [], [], '시간');
    dailyChart = createChart(dailyCtx, [], [], [], '일');
    monthlyChart = createChart(monthlyCtx, [], [], [], '월');

    startDataRefresh(updateCharts);
}

function updateCharts(data) {
    const processedData = processChartData(data);

    updateChart(hourlyChart, processedData.hourly);
    updateChart(dailyChart, processedData.daily);
    updateChart(monthlyChart, processedData.monthly);
}

function updateChart(chart, data) {
    chart.data.labels = data.labels;
    chart.data.datasets[0].data = data.electricity;
    chart.data.datasets[1].data = data.electricity;
    chart.data.datasets[2].data = data.heat;
    chart.data.datasets[3].data = data.heat;
    chart.update();
}
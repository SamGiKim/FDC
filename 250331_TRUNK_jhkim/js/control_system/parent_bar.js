//parent_bar.js
import { loadData } from './parent_dataManager.js';

const parentBarManager = {
  charts: {},

  loadDayMonthProductionBarData: function (chartId, section) {
    return loadData(section)
      .then(data => {
        if (Object.keys(data).length > 0) {
          this.updateChart(chartId, data, section);
        } else {
          console.log("새로운 데이터가 없습니다.");
        }
      })
      .catch(error => {
        console.error('CONF 파일을 불러오는 데 실패했습니다.', error);
      });
  },

  parseDayMonthConf: function (conf, section) {
    const result = { electricity: [], heat: [] };
    const prefixes = section === 'e_t_hour' ? ['e_production_', 't_production_'] : ['production_'];

    prefixes.forEach(prefix => {
        for (const key in conf) {
            if (key.startsWith(prefix)) {
                const timeUnit = key.split('_')[2];
                const value = conf[key];
                if (!isNaN(value)) {
                    let label = `${timeUnit}${section.includes('hour') ? '시' : section.includes('day') ? '일' : '월'}`;
                    if (section === 'e_t_hour') {
                        if (prefix === 'e_production_') {
                            result.electricity.push({ label, value });
                        } else {
                            result.heat.push({ label, value });
                        }
                    } else {
                        result.electricity.push({ label, value });
                    }
                }
            }
        }
    });

    return result;
},

  createChart: function (chartId, data, section) {
    const canvasElement = document.getElementById(chartId);
    if (!canvasElement) {
      console.error(`Canvas 요소를 찾을 수 없음: ${chartId}`);
      return;
    }
    const ctx = canvasElement.getContext('2d');
    if (!ctx) {
      console.error(`Canvas 컨텍스트를 찾을 수 없음: ${chartId}`);
      return;
    }

    if (this.charts[chartId]) {
      this.charts[chartId].destroy();
    }

  },


  updateCharts: function (chartIds, conf, section) {
    const data = this.parseDayMonthConf(conf, section);
  
    chartIds.forEach(chartId => {
      if (this.charts[chartId]) {
        this.charts[chartId].data.labels = data.electricity.map(item => item.label);
        this.charts[chartId].data.datasets.forEach((dataset, index) => {
          dataset.data = (index < 2) ? data.electricity.map(item => item.value) : data.heat.map(item => item.value);
        });
        this.charts[chartId].update();
      } else {
        this.createChart(chartId, data, section);
      }
    });
  },
  

  getChartOptions: function (section) {
    return {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { 
          display: true,
          labels: {
            filter: function(item, chart) {
              return !item.text.includes('(kW)') || item.datasetIndex % 2 === 0;
            }
          }
        }
      },
      scales: {
        'y-electricity': {
          type: 'linear',
          position: 'left',
          beginAtZero: true,
          title: {
            display: true,
            text: '전기생산량 (kW)'
          }
        },
        'y-heat': {
          type: 'linear',
          position: 'right',
          beginAtZero: true,
          title: {
            display: true,
            text: '열생산량 (kW)'
          }
        },
        x: {
          title: {
            display: true,
            text: section.includes('hour') ? '시' : section.includes('day') ? '일' : '월'
          }
        }
      },
      animation: false,
      interaction: {
        mode: 'index',
        intersect: false,
      },
    };
  }
};



export { parentBarManager };
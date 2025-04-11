import { SessionService } from '../config/get_session.js';

// 발전소 대시보드 좌측 발전량/가동율 관련 모두 : key: `${firstPowerplant}_dash_total_web`
class RealtimeGraph {
  static redisData = null;
  static hourlyChart = null;
  static dailyChart = null;
  static monthlyChart = null;

  // Redis 데이터 가져오기
  static async fetchRedisData() {
      try {
          const powerplants = await SessionService.getPowerplants();
          const firstPowerplant = powerplants[0];

          const response = await axios.get('js/config/get_redis_data.php', {
              params: {
                  key: `${firstPowerplant}_dash_total_web`
              }
          });

          // 문자열로 온 데이터를 파싱
          let data = response.data;
          if (typeof data === 'string') {
              data = JSON.parse(data);
          }

          // 데이터 검증
          if (!data || !data.realtime_prod_per_gen || !data.dt_et_prod) {
              console.warn('데이터 형식이 올바르지 않습니다');
              return null;
          }

          this.redisData = data;
          return this.redisData;
      } catch (error) {
          console.warn('Redis 데이터 조회 실패:', error);
          return null;
      }
  }

  
  // 실시간 생산량 값 업데이트
// 실시간 생산량 값 업데이트
static updateCurrentProduction() {
    try {
        if (!this.redisData?.realtime_prod_per_gen) {
            throw new Error('생산량 데이터가 없습니다');
        }

        const { e_prod, t_prod, e_rate, t_rate } = this.redisData.realtime_prod_per_gen;

        // 전기 생산량 업데이트
        const currentKWElement = document.getElementById('current-kW');
        const currentKWInput = document.querySelector('#current .input-kW');
        if (currentKWElement) {
            const eValue = parseFloat(e_prod).toFixed(2);
            currentKWElement.textContent = eValue;
            if (currentKWInput) {
                currentKWInput.value = eValue;
            }
        }

        // 열 생산량 업데이트
        const heatKWElement = document.getElementById('heat-kW');
        const heatKWInput = document.querySelector('#heat .input-kW');
        if (heatKWElement) {
            const tValue = parseFloat(t_prod).toFixed(2);
            heatKWElement.textContent = tValue;
            if (heatKWInput) {
                heatKWInput.value = tValue;
            }
        }

        // 전기 가동률 업데이트
        const currentPercentElement = document.getElementById('current-percent');
        const currentPercentInput = document.querySelector('#current .input-percent');
        if (currentPercentElement) {
            const eRateValue = parseFloat(e_rate).toFixed(2);
            currentPercentElement.textContent = eRateValue;
            if (currentPercentInput) {
                currentPercentInput.value = eRateValue;
            }
        }

        // 열 가동률 업데이트
        const heatPercentElement = document.getElementById('heat-percent');
        const heatPercentInput = document.querySelector('#heat .input-percent');
        if (heatPercentElement) {
            const tRateValue = parseFloat(t_rate).toFixed(2);
            heatPercentElement.textContent = tRateValue;
            if (heatPercentInput) {
                heatPercentInput.value = tRateValue;
            }
        }

        // gaugeChart 함수 호출
        if (typeof gaugeChart === 'function') {
            gaugeChart('#current');
            gaugeChart('#heat');
        }

    } catch (error) {
        console.error('실시간 생산량 업데이트 실패:', error);
    }
}



  // 실시간 발전량/가동율 그래프 업데이트
  static updateRealtimeGraph() {
    try {
        if (!this.redisData?.realtime_prod_per_gen?.d_prod) {
            console.warn('그래프 데이터가 없습니다');
            return;
        }

        const chartElement = document.getElementById('e_t_hour_1');
        if (!chartElement) {
            console.warn('차트 엘리먼트를 찾을 수 없습니다: e_t_hour_1');
            return;
        }

        // 기존 차트 정리
        if (this.hourlyChart) {
            this.hourlyChart.destroy();
            this.hourlyChart = null;
        }

        // Chart.js 내부 레지스트리 정리
        const existingChart = Chart.getChart(chartElement);
        if (existingChart) {
            existingChart.destroy();
        }

        // 잠시 대기
        setTimeout(() => {
            // 데이터 준비
            const d_prod = this.redisData.realtime_prod_per_gen.d_prod;
            const hours = Array.from({length: 24}, (_, i) => i);
            const electricityData = new Array(24).fill(null);
            const heatData = new Array(24).fill(null);

            Object.entries(d_prod).forEach(([hour, data]) => {
                let hourIndex = parseInt(hour);
                if (hour === "00") hourIndex = 0;
                if (!isNaN(hourIndex) && hourIndex >= 0 && hourIndex < 24) {
                    electricityData[hourIndex] = data.e;
                    heatData[hourIndex] = data.t;
                }
            });

            // 새 차트 생성
            const ctx = chartElement.getContext('2d');
            this.hourlyChart = new Chart(ctx, this.getHourlyChartConfig(electricityData, heatData, hours));
        }, 100); // 100ms 대기

    } catch (error) {
        console.warn('그래프 업데이트 실패:', error);
    }
}

  // 차트 설정 반환
  static getHourlyChartConfig(electricityData, heatData, hours) {
      return {
          type: 'bar',
          data: {
              labels: hours.map(h => `${h}`),
              datasets: [
                  {
                      label: 'Electricity Production',
                      data: electricityData,
                      backgroundColor: 'rgba(0, 123, 255, 0.5)',
                      borderColor: 'rgba(0, 123, 255, 1)',
                      borderWidth: 1,
                      type: 'bar',
                      yAxisID: 'y-electricity',
                  },
                  {
                      label: 'Electricity Production',
                      data: electricityData,
                      borderColor: 'rgba(0, 123, 255, 1)',
                      borderWidth: 2,
                      type: 'line',
                      fill: false,
                      pointRadius: 0,
                      yAxisID: 'y-electricity',
                      tension: 0.4,
                  },
                  {
                      label: 'Thermal Production',
                      data: heatData,
                      backgroundColor: 'rgba(255, 0, 0, 0.5)',
                      borderColor: 'rgba(255, 0, 0, 1)',
                      borderWidth: 1,
                      type: 'bar',
                      yAxisID: 'y-heat',
                  },
                  {
                      label: 'Thermal Production',
                      data: heatData,
                      borderColor: 'rgba(255, 0, 0, 1)',
                      borderWidth: 2,
                      type: 'line',
                      fill: false,
                      pointRadius: 0,
                      yAxisID: 'y-heat',
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
                        text: '시간'
                    }
                },
                'y-electricity': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Electricity Production (kW)'
                    },
                    // 최대값을 데이터의 최대값보다 약간 더 크게 설정
                    suggestedMax: Math.max(...electricityData.filter(v => v !== null)) * 1.2 || 10,
                    min: 0,
                },
                'y-heat': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Thermal Production (kW)'
                    },
                    // 최대값을 데이터의 최대값보다 약간 더 크게 설정
                    suggestedMax: Math.max(...heatData.filter(v => v !== null)) * 1.2 || 10,
                    min: 0,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
              plugins: {
                  legend: {
                      display: true,
                      position: 'top',
                      labels: {
                          filter: function(item, chart) {
                              return item.datasetIndex % 2 === 0;
                          }
                      }
                  }
              }
          }
      };
  }


  
    // 일별 발전량 그래프 업데이트
    static updateDailyGraph() {
      try {
          if (!this.redisData?.dt_et_prod) {
              console.warn('일별 그래프 데이터가 없습니다');
              return;
          }

          const chartElement = document.getElementById('e_t_day_1');
          if (!chartElement) {
              console.warn('차트 엘리먼트를 찾을 수 없습니다: e_t_day_1');
              return;
          }

          // 기존 차트 정리
          if (this.dailyChart) {
              this.dailyChart.destroy();
              this.dailyChart = null;
          }

          // Chart.js 내부 레지스트리 정리
          const existingChart = Chart.getChart(chartElement);
          if (existingChart) {
              existingChart.destroy();
          }

          // 잠시 대기
          setTimeout(() => {
              // 데이터 준비
              const dt_et_prod = this.redisData.dt_et_prod;
              const days = Array.from({length: 31}, (_, i) => i + 1);
              const electricityData = new Array(31).fill(null);
              const heatData = new Array(31).fill(null);

              Object.entries(dt_et_prod).forEach(([day, data]) => {
                  const dayIndex = parseInt(day) - 1;
                  if (dayIndex >= 0 && dayIndex < 31) {
                      electricityData[dayIndex] = data.e;
                      heatData[dayIndex] = data.t;
                  }
              });

              // 새 차트 생성
              const ctx = chartElement.getContext('2d');
              this.dailyChart = new Chart(ctx, this.getDailyChartConfig(electricityData, heatData, days));
          }, 100); // 100ms 대기

      } catch (error) {
          console.warn('일별 그래프 업데이트 실패:', error);
      }
  }

  // 일별 차트 설정 반환
  static getDailyChartConfig(electricityData, heatData, days) {
      return {
          type: 'bar',
          data: {
              labels: days.map(d => `${d}`),
              datasets: [
                  {
                      label: 'Electricity Production',
                      data: electricityData,
                      backgroundColor: 'rgba(0, 123, 255, 0.5)',
                      borderColor: 'rgba(0, 123, 255, 1)',
                      borderWidth: 1,
                      type: 'bar',
                      yAxisID: 'y-electricity',
                  },
                  {
                      label: 'Electricity Production',
                      data: electricityData,
                      borderColor: 'rgba(0, 123, 255, 1)',
                      borderWidth: 2,
                      type: 'line',
                      fill: false,
                      pointRadius: 0,
                      yAxisID: 'y-electricity',
                      tension: 0.4,
                  },
                  {
                      label: 'Thermal Production',
                      data: heatData,
                      backgroundColor: 'rgba(255, 0, 0, 0.5)',
                      borderColor: 'rgba(255, 0, 0, 1)',
                      borderWidth: 1,
                      type: 'bar',
                      yAxisID: 'y-heat',
                  },
                  {
                      label: 'Thermal Production',
                      data: heatData,
                      borderColor: 'rgba(255, 0, 0, 1)',
                      borderWidth: 2,
                      type: 'line',
                      fill: false,
                      pointRadius: 0,
                      yAxisID: 'y-heat',
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
                        text: '일' 
                    }
                },
                'y-electricity': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Electricity Production (kWh)'
                    },
                    suggestedMax: Math.max(...electricityData.filter(v => v !== null)) * 1.2 || 100,
                    min: 0,
                },
                'y-heat': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Thermal Production (kWh)'
                    },
                    suggestedMax: Math.max(...heatData.filter(v => v !== null)) * 1.2 || 100,
                    min: 0,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
              plugins: {
                  legend: {
                      display: true,
                      position: 'top',
                      labels: {
                          filter: function(item, chart) {
                              return item.datasetIndex % 2 === 0;
                          }
                      }
                  }
              }
          }
      };
  }


// 월별 발전량 그래프 업데이트
static updateMonthlyGraph() {
    try {
        if (!this.redisData?.mt_et_prod) {
            console.warn('월별 그래프 데이터가 없습니다');
            return;
        }

        const chartElement = document.getElementById('e_t_month_1');
        if (!chartElement) {
            console.warn('차트 엘리먼트를 찾을 수 없습니다: e_t_month_1');
            return;
        }

        // 기존 차트 정리
        if (this.monthlyChart) {
            this.monthlyChart.destroy();
            this.monthlyChart = null;
        }

        // Chart.js 내부 레지스트리 정리
        const existingChart = Chart.getChart(chartElement);
        if (existingChart) {
            existingChart.destroy();
        }

        // 데이터 준비
        const mt_et_prod = this.redisData.mt_et_prod;
        const months = Array.from({length: 12}, (_, i) => i + 1);
        const electricityData = new Array(12).fill(null);
        const heatData = new Array(12).fill(null);

        Object.entries(mt_et_prod).forEach(([month, data]) => {
            const monthIndex = parseInt(month) - 1;
            if (monthIndex >= 0 && monthIndex < 12) {
                electricityData[monthIndex] = data.e;
                heatData[monthIndex] = data.t;
            }
        });

        // 새 차트 생성
        const ctx = chartElement.getContext('2d');
        this.monthlyChart = new Chart(ctx, this.getMonthlyChartConfig(electricityData, heatData, months));

    } catch (error) {
        console.warn('월별 그래프 업데이트 실패:', error);
    }
}

// 월별 차트 설정 반환
static getMonthlyChartConfig(electricityData, heatData, months) {
    return {
        type: 'bar',
        data: {
            labels: months.map(m => `${m}`),
            datasets: [
                {
                    label: 'Electricity Production',
                    data: electricityData,
                    backgroundColor: 'rgba(0, 123, 255, 0.5)',
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 1,
                    type: 'bar',
                    yAxisID: 'y-electricity',
                },
                {
                    label: 'Electricity Production',
                    data: electricityData,
                    borderColor: 'rgba(0, 123, 255, 1)',
                    borderWidth: 2,
                    type: 'line',
                    fill: false,
                    pointRadius: 0,
                    yAxisID: 'y-electricity',
                    tension: 0.4,
                },
                {
                    label: 'Thermal Production',
                    data: heatData,
                    backgroundColor: 'rgba(255, 0, 0, 0.5)',
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 1,
                    type: 'bar',
                    yAxisID: 'y-heat',
                },
                {
                    label: 'Thermal Production',
                    data: heatData,
                    borderColor: 'rgba(255, 0, 0, 1)',
                    borderWidth: 2,
                    type: 'line',
                    fill: false,
                    pointRadius: 0,
                    yAxisID: 'y-heat',
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
                        text: '월' 
                    }
                },
                'y-electricity': {
                    type: 'linear',
                    position: 'left',
                    title: {
                        display: true,
                        text: 'Electricity Production (kWh)'
                    },
                    suggestedMax: Math.max(...electricityData.filter(v => v !== null)) * 1.2 || 100,
                    min: 0,
                },
                'y-heat': {
                    type: 'linear',
                    position: 'right',
                    title: {
                        display: true,
                        text: 'Thermal Production (kWh)'
                    },
                    suggestedMax: Math.max(...heatData.filter(v => v !== null)) * 1.2 || 100,
                    min: 0,
                    grid: {
                        drawOnChartArea: false,
                    },
                }
            },
            plugins: {
                legend: {
                    display: true,
                    position: 'top',
                    labels: {
                        filter: function(item, chart) {
                            return item.datasetIndex % 2 === 0;
                        }
                    }
                }
            }
        }
    };
}

// updateAll 메서드에 월별 그래프 업데이트 추가
static async updateAll() {
    try {
        await this.fetchRedisData();
        this.updateCurrentProduction();
        
        // 그래프 업데이트를 Promise로 감싸서 처리
        const updateGraphs = async () => {
            // 시간별 그래프 업데이트
            await new Promise((resolve) => {
                if (this.hourlyChart) {
                    this.hourlyChart.destroy();
                    this.hourlyChart = null;
                }
                const hourlyElement = document.getElementById('e_t_hour_1');
                const existingHourly = Chart.getChart(hourlyElement);
                if (existingHourly) {
                    existingHourly.destroy();
                }
                setTimeout(() => {
                    this.updateRealtimeGraph();
                    resolve();
                }, 100);
            });

            // 일별 그래프 업데이트
            await new Promise((resolve) => {
                if (this.dailyChart) {
                    this.dailyChart.destroy();
                    this.dailyChart = null;
                }
                const dailyElement = document.getElementById('e_t_day_1');
                const existingDaily = Chart.getChart(dailyElement);
                if (existingDaily) {
                    existingDaily.destroy();
                }
                setTimeout(() => {
                    this.updateDailyGraph();
                    resolve();
                }, 100);
            });

            // 월별 그래프 업데이트
            await new Promise((resolve) => {
                if (this.monthlyChart) {
                    this.monthlyChart.destroy();
                    this.monthlyChart = null;
                }
                const monthlyElement = document.getElementById('e_t_month_1');
                const existingMonthly = Chart.getChart(monthlyElement);
                if (existingMonthly) {
                    existingMonthly.destroy();
                }
                setTimeout(() => {
                    this.updateMonthlyGraph();
                    resolve();
                }, 100);
            });
        };

        await updateGraphs();
    } catch (error) {
        console.warn('데이터 업데이트 실패:', error);
    }
}

  // 초기화 및 주기적 업데이트 설정
  static async initialize() {
      await this.updateAll();
      // 5초마다 모든 데이터 업데이트
      setInterval(() => this.updateAll(), 5000);
  }
}

// DOM이 로드되면 초기화
document.addEventListener('DOMContentLoaded', () => {
  RealtimeGraph.initialize();
});
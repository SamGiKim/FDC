// dash_bar_chart.js
import { loadAllData } from '../config/redis_dataManager.js';
import { ensureDataLoaded } from '../config/fuelcellSelector.js';

const productionBarChartManager = {
    charts: {}, // 차트 인스턴스 저장 객체

    initBarCharts: function() {
        this.createChart('eProduction-bar', 'e_hour');
        this.createChart('tProduction-bar', 't_hour');
        this.setupEventListeners();
        this.setupDataUpdatedListener();
         
        // 초기 로드 시 현재 선택된 섹션의 데이터로 차트 업데이트
        this.updateAllCharts();
    },

    setupEventListeners: function() {
        document.querySelectorAll('.e_production_time, .t_production_time').forEach(elem => {
            elem.addEventListener('click', () => {
                const chartId = elem.classList.contains('e_production_time') ? 'eProduction-bar' : 'tProduction-bar';
                const prefix = elem.classList.contains('e_production_time') ? 'e_' : 't_';
                this.updateChart(chartId, prefix + elem.previousElementSibling.value);
            });
        });
    },

    setupDataUpdatedListener: function() {
        document.addEventListener('dataUpdated', () => {
            this.updateAllCharts();
        });
    },

    updateAllCharts: async function() {
    try {
        // 데이터가 로드될 때까지 대기
        await ensureDataLoaded();
        
        const data = await loadAllData();
        if (data && (data.e_production || data.t_production)) {
            this.updateChart('eProduction-bar', 'e_hour', data);
            this.updateChart('tProduction-bar', 't_hour', data);
        } else {
            console.log("새로운 데이터가 없습니다.");
        }
    } catch (error) {
        console.error('데이터를 불러오는 데 실패했습니다.', error);
    }
},

    createChart: function(chartId, section) {
        const canvas = document.getElementById(chartId);
        if (!canvas) {
            // console.error(`Canvas 요소를 찾을 수 없음: ${chartId}`);
            return;
        }
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            // console.error(`Canvas 컨텍스트를 가져올 수 없음: ${chartId}`);
            return;
        }

        // 기존 차트 인스턴스가 있으면 제거
        if (this.charts[chartId]) {
            this.charts[chartId].destroy();
        }

        const label = section.startsWith('e_') ? '전기생산량(kW)' : '열생산량(kW)';
        const backgroundColor = section.startsWith('e_') ? "rgba(0, 123, 255, 0.5)" : "pink";

        this.charts[chartId] = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [],
                datasets: [{
                    label: label,
                    data: [],
                    borderWidth: 1,
                    barThickness: 10,
                    backgroundColor: backgroundColor
                }]
            },
            options: this.getChartOptions(section),
            animation: true
        });

        this.updateChart(chartId, section);
    },

    updateChart: async function(chartId, section, newData = null) {
        if (!this.charts[chartId]) {
            // console.error(`차트 인스턴스를 찾을 수 없음: ${chartId}`);
            return;
        }

        const updateChartData = (data) => {
            if (data && (data.e_production || data.t_production)) {
                const productionData = section.startsWith('e_') ? data.e_production : data.t_production;
                const parsedData = this.parseProductionBarConf(productionData, section);
    
                // 차트 데이터 설정
                this.charts[chartId].data.labels = parsedData.map(item => item.label);
                this.charts[chartId].data.datasets[0].data = parsedData.map(item => item.value);
            } else {
                // 기본값으로 차트 데이터 설정
                console.log("새로운 데이터가 없습니다. 기본값으로 업데이트합니다.");
                const defaultData = this.parseProductionBarConf({}, section); // 빈 데이터 처리
                this.charts[chartId].data.labels = defaultData.map(item => item.label);
                this.charts[chartId].data.datasets[0].data = defaultData.map(item => item.value);
            }
    
            // 차트 옵션 업데이트
            this.charts[chartId].options = this.getChartOptions(section);
            this.charts[chartId].update();
        };
    
        if (newData) {
            updateChartData(newData);
        } else {
            try {
                // 데이터가 로드될 때까지 대기
                await ensureDataLoaded();
                
                const data = await loadAllData();
                updateChartData(data);
            } catch (error) {
                console.error('데이터를 불러오는 데 실패했습니다.', error);
                // 기본값으로 차트 업데이트
                const defaultData = this.parseProductionBarConf({}, section); // 빈 데이터 처리
                this.charts[chartId].data.labels = defaultData.map(item => item.label);
                this.charts[chartId].data.datasets[0].data = defaultData.map(item => item.value);
                this.charts[chartId].options = this.getChartOptions(section);
                this.charts[chartId].update();
            }
        }
    },
    
    parseProductionBarConf: function(data, section) {
        const result = [];
        const today = new Date();
        const year = today.getFullYear().toString();
        const currentMonth = (today.getMonth() + 1).toString().padStart(2, '0');
    
        if (section.endsWith('hour')) {
            for (let i = 0; i < 24; i++) {
                const hour = i.toString().padStart(2, '0');
                const value = data[year]?.[currentMonth]?.[today.getDate().toString().padStart(2, '0')]?.[hour] || 0;
                result.push({ label: hour, value });
            }
        } else if (section.endsWith('day')) {
            for (let i = 1; i <= 31; i++) {
                const day = i.toString().padStart(2, '0');
                const value = data[year]?.[currentMonth]?.[day]?.total || 0;
                result.push({ label: day, value });
            }
        } else if (section.endsWith('month')) {
            for (let i = 1; i <= 12; i++) {
                const month = i.toString().padStart(2, '0');
                const value = data[year]?.[month]?.total || 0;
                result.push({ label: month, value });
            }
        }
    
        return result;
    },
    
    getChartOptions: function(section) {
        return {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        title: function(tooltipItems) {
                            const label = tooltipItems[0].label;
                            if (section.endsWith('hour')) {
                                return `${label}시 데이터`;
                            } else if (section.endsWith('day')) {
                                return `${label}일 데이터`;
                            } else if (section.endsWith('month')) {
                                return `${label}월 데이터`;
                            }
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true
                        // text: 'kW',
                    },
                    ticks: { font: { size: 10 } }
                },
                x: {
                    ticks: {
                        maxRotation: 0,
                        minRotation: 0,
                        font: { size: 10 }
                    }
                }
            },
            animation: false
        };
    }
};

export { productionBarChartManager };
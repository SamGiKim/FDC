// dash_realtime_production.js
import { loadAllData } from '../config/redis_dataManager.js';

const realTimeProductionManager = {
    doughnutCharts: {}, // 하프 도넛 차트 인스턴스 저장 객체

    updateCharts: function (realtimeData, perData) {
        // 필요한 canvas 요소들이 있는지 체크
        if (!document.getElementById('realtime-eProduction') || !document.getElementById('realtime-tProduction')) {
            return;
        }
        // console.log('Updating charxts with:', realtimeData, perData); // 디버깅을 위한 로그 추가

        // 퍼센티지 값을 그대로 사용
        const ePercentage = perData.e || 0;
        const tPercentage = perData.t || 0;

        // 전기 발전량 차트 업데이트
        this.createHalfDoughnutChart('realtime-eProduction', ePercentage, '전기발전량', '#4CB9E7');
        // 열 발전량 차트 업데이트
        this.createHalfDoughnutChart('realtime-tProduction', tPercentage, '열 발전량', '#FF8F8F');

        // 퍼센티지 업데이트
        const ePercentageElement = document.querySelector('.realtime-e-percentage');
        const tPercentageElement = document.querySelector('.realtime-t-percentage');
        if (ePercentageElement) ePercentageElement.textContent = `${ePercentage}%`;
        if (tPercentageElement) tPercentageElement.textContent = `${tPercentage}%`;

        // 하단의 숫자 데이터 업데이트
        const eBottomElement = document.querySelector('.e-bottom-side');
        const tBottomElement = document.querySelector('.t-bottom-side');
        if (eBottomElement) eBottomElement.innerHTML = this.formatPower(realtimeData.e || 0);
        if (tBottomElement) tBottomElement.innerHTML = this.formatPower(realtimeData.t || 0);

        console.log('Charts updated'); // 디버깅을 위한 로그 추가
    },

    // 전력 단위 변환 함수
    formatPower: function (powerValue) {
        const power = Number(powerValue);
        if (power >= 1000) {
            return (power / 1000).toFixed(2) + ' <sub>kW</sub>';
        } else {
            return power.toFixed(2) + ' <sub>W</sub>';
        }
    },

    createHalfDoughnutChart: function (canvasId, productionPercent, label, color) {
        const ctx = document.getElementById(canvasId).getContext('2d');

        const options = {
            circumference: 180,
            rotation: 270,
            cutout: '80%',
            tooltips: {
                callbacks: {
                    label: function (tooltipItem) {
                        return tooltipItem.formattedValue + '%';
                    }
                }
            },
            hover: { mode: null },
            title: {
                display: true,
                text: label
            }
        };

        if (this.doughnutCharts[canvasId]) {
            this.doughnutCharts[canvasId].data.datasets[0].data = [productionPercent, 100 - productionPercent];
            this.doughnutCharts[canvasId].options = options;
            this.doughnutCharts[canvasId].update();
        } else {
            this.doughnutCharts[canvasId] = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [productionPercent, 100 - productionPercent],
                        backgroundColor: [color, 'lightgrey'],
                        borderWidth: 0
                    }]
                },
                options: options
            });
        }
    }
};

export default realTimeProductionManager;

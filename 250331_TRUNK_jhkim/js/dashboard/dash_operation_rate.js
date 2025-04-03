const operationRateManager = {
    currentTimeUnit: 'day',

    initOperationRate: function() {
        // console.log('initOperationRate 호출됨');
        this.setupEventListeners();
        document.addEventListener('dataUpdated', (e) => {
            // console.log('dataUpdated 이벤트 수신됨', e.detail);
            this.updateOperationRate(e.detail);
        });
    },

    setupEventListeners: function() {
        // console.log('setupEventListeners 호출됨');
        const timeUnits = ['total', 'year', 'month', 'day'];
        timeUnits.forEach(unit => {
            const button = document.getElementById(`operationRate-${unit}`);
            if (button) {
                button.addEventListener('click', () => {
                    // console.log(`${unit} 버튼 클릭됨`);
                    this.currentTimeUnit = unit;
                    this.updateData();
                });
            } else {
                // console.warn(`operationRate-${unit} 버튼을 찾을 수 없습니다.`);
            }
        });
    },

    updateData: function() {
        // console.log('updateData 호출됨');
        document.dispatchEvent(new CustomEvent('refreshData'));
    },

    updateOperationRate: function(data) {
        // console.log('updateOperationRate 호출됨', data);
        if (!data || !data.e_operation) {
            // console.warn('유효한 생산량 데이터가 없습니다.');
            return;
        }
    
        const e_operation = data.e_operation;
        // operation_rate가 없는 경우를 대비해 기본값 설정
        const operation_rate = data.operation_rate || {};
    
        let productionValue, rateValue;
    
        const today = new Date();
        const year = today.getFullYear().toString();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
    
        switch (this.currentTimeUnit) {
            case 'total':
                productionValue = e_operation.total || 0;
                rateValue = operation_rate.total || 0;
                break;
            case 'year':
                productionValue = e_operation[year]?.total || 0;
                rateValue = operation_rate[year]?.total || 0;
                break;
            case 'month':
                productionValue = e_operation[year]?.[month]?.total || 0;
                rateValue = operation_rate[year]?.[month]?.total || 0;
                break;
            case 'day':
                productionValue = Object.values(e_operation[year]?.[month]?.[day] || {}).reduce((sum, val) => sum + (val || 0), 0);
                rateValue = operation_rate[year]?.[month]?.[day]?.total || 0;
                break;
        }
    
        // console.log('계산된 값:', { productionValue, rateValue });
        this.updateDOMElements(productionValue, rateValue);
        this.updateChartDisplay(this.currentTimeUnit);
        this.updateChart(rateValue);
    },
    
    // 1000 Wh 넘어가면 kWh로 표시
    updateDOMElements: function(production, rate) {
        try {
            const operationValueElement = document.querySelector('.operation-result');
            const operationUnitElement = document.querySelector('.result-unit');
            const operationRateElement = document.querySelector('.operation-rate');
            
            if (!operationValueElement || !operationUnitElement || !operationRateElement) {
                console.warn('운영률 표시 요소를 찾을 수 없습니다.');
                return;
            }
    
            // 생산량 처리
            if (!production || isNaN(production)) {
                console.warn('유효하지 않은 생산량:', production);
                operationValueElement.textContent = '--';
                operationUnitElement.textContent = '';
            } else if (production >= 10000) {
                operationValueElement.textContent = '--';
                operationUnitElement.textContent = '';
            } else if (production >= 1000) {
                operationValueElement.textContent = `${(production / 1000).toFixed(2)}`;
                operationUnitElement.textContent = 'kWh';
            } else {
                operationValueElement.textContent = `${production.toFixed(2)}`;
                operationUnitElement.textContent = 'Wh';
            }
    
            // 가동률 처리
            if (!rate || isNaN(rate)) {
                console.warn('유효하지 않은 가동률:', rate);
                operationRateElement.textContent = '--';
            } else if (rate >= 100) {
                operationRateElement.textContent = '--';
            } else {
                operationRateElement.textContent = `${(rate).toFixed(2)}`;
            }
        } catch (error) {
            console.warn('운영률 업데이트 실패:', error);
            // 에러를 조용히 처리
        }
    },

    updateChartDisplay: function(timeUnit) {
        ['total', 'year', 'month', 'day'].forEach(unit => {
            const button = document.getElementById(`operationRate-${unit}`);
            if (button) {
                button.style.color = unit === timeUnit ? '#000' : '#BEBEBE';
                button.style.fontWeight = unit === timeUnit ? '800' : '500';
            }
        });
    },

    updateChart: function(rate) {
        const chartElement = document.querySelector('#operation-rate-rect');
        if (chartElement) {
            const percentage = rate*100;
            chartElement.setAttribute('width', `${percentage}%`);
            chartElement.setAttribute('fill', '#36A2EB');  // 파란색으로 설정
        }
    }
};

export { operationRateManager };
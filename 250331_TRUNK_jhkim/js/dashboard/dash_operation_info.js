export const OperationInfoManager = {
    initOperationInfo: function() {
        // console.log('OperationInfoManager 초기화');
        document.addEventListener('dataUpdated', (e) => {
            // console.log('dataUpdated 이벤트 수신:', e.detail);
            this.updateOperationInfo(e.detail);
        });
    },

    updateOperationInfo: function(data) {
        // console.log('운영 정보 업데이트 데이터:', data);

        if (!data || !data.e_production) {
            // console.warn('유효한 운전 정보 데이터가 없습니다.', data);
            return;
        }
    
        const e_production = data.e_production;
        // console.log('e_production 데이터:', e_production);
    
        // 날짜 계산
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear().toString();

        // console.log('현재 날짜:', year, month, day);
        // console.log('e_production 데이터:', e_production);
    
        // 생산량 데이터 추출
        let dailyProduction = '-';
        if (e_production[year]?.[month]?.[day]?.total) {
            dailyProduction = e_production[year][month][day].total;
        }
        // console.log('일일 생산량:', dailyProduction);
    
        let monthlyProduction = '-';
        if (e_production[year]?.[month]?.total) {
            monthlyProduction = e_production[year][month].total;
        }
        // console.log('월 생산량:', monthlyProduction);
    
        let yearlyProduction = '-';
        if (e_production[year]?.total) {
            yearlyProduction = e_production[year].total;
        }
        // console.log('연간 생산량:', yearlyProduction);
    
        const totalProduction = e_production.total || '-';
        // console.log('총 생산량:', totalProduction);
    
        // DOM 요소 확인
        const todayElement = document.querySelector('#e_today td:nth-child(2)');
        const monthElement = document.querySelector('#e_this_month td:nth-child(2)');
        const yearElement = document.querySelector('#e_this_year td:nth-child(2)');
        const totalElement = document.querySelector('#e_total td:nth-child(2)');
    
        // DOM 요소 존재 확인
        if (!todayElement || !monthElement || !yearElement || !totalElement) {
            // console.error('DOM 요소를 찾을 수 없습니다.');
            return;
        }
    
        // UI 업데이트
        try {
            todayElement.innerText = dailyProduction === '-' ? '-' : this.formatValue(dailyProduction);
            monthElement.innerText = monthlyProduction === '-' ? '-' : this.formatValue(monthlyProduction);
            yearElement.innerText = yearlyProduction === '-' ? '-' : this.formatValue(yearlyProduction);
            totalElement.innerText = totalProduction === '-' ? '-' : this.formatValue(totalProduction);
        } catch (error) {
            // console.error('UI 업데이트 중 오류 발생:', error);
        }
    },
    
    formatValue: function(value) {
        if (typeof value !== 'number') {
            // console.warn('유효하지 않은 값:', value);
            return '-';
        }
        return value >= 1000 ? `${(value / 1000).toFixed(2)} kWh` : `${value.toFixed(2)} Wh`;
    }
}
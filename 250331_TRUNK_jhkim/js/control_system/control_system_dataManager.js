// control_system_dataManager.js
// index-front-realdata.html에 쓰인다
export async function fetchData() {
    try {
        const response = await fetch('/fuelcell_data/mock_data.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('데이터를 가져오는 중 오류 발생:', error);
        return null;
    }
}

export function startDataRefresh(callback, interval = 10000) {
    const refreshData = async () => {
        const data = await fetchData();
        if (data) {
            callback(data);
        }
    };

    refreshData(); // 초기 실행
    return setInterval(refreshData, interval);
}

export function processChartData(data) {
    return {
        hourly: {
            labels: Object.keys(data.e_hour).map(key => key.split('_')[2]),
            electricity: Object.values(data.e_hour),
            heat: Object.values(data.t_hour)
        },
        daily: {
            labels: Object.keys(data.e_day).map(key => key.split('_')[2]),
            electricity: Object.values(data.e_day),
            heat: Object.values(data.t_day)
        },
        monthly: {
            labels: Object.keys(data.e_month).map(key => key.split('_')[2]),
            electricity: Object.values(data.e_month),
            heat: Object.values(data.t_month)
        }
    };
}
// dash_hwAlert.js 
//HW 센서 정보 + 시스템 구조도에서 흰색 hw 정보
// HW_Alert 에서 값 가져옴
const HWAlertManager = {
    updateHWAlertStatus: function (hwAlertData) {
        console.log("Received HW Alert Data:", hwAlertData);

        const updateAlertElementById = (id, value) => {
            const element = document.getElementById(id);
            if (element) {
                element.classList.toggle("warning", value === true);
            }
        };

        const updateAlertElementByDataKey = (key, value) => {
            const element = document.querySelector(`#hw-sensor-info .sensor[data-key="${key}"]`);
            if (element) {
                element.classList.toggle("warning", value === true);
            }
        };

        // 데이터가 중첩된 객체일 경우
        Object.entries(hwAlertData).forEach(([category, alerts]) => {
            Object.entries(alerts).forEach(([key, value]) => {
                // ID 기반 업데이트
                updateAlertElementById(key, value);
                // data-key 기반 업데이트
                updateAlertElementByDataKey(key, value);
            });
        });
    }
};

export default HWAlertManager;
const FaultDiagManager = {
    updateFaultDiagStatus: function(faultData) {
        // HTML 요소 업데이트
        Object.entries(faultData).forEach(([category, items]) => {
            Object.entries(items).forEach(([key, value]) => {
                // 센서 요소 업데이트
                const sensorElement = document.querySelector(`#fault-diagnosis-list .sensor[data-key="${key}"]`);
                if (sensorElement) {
                    sensorElement.classList.toggle("warning", value === true);
                    
                    // flame 요소 업데이트
                    let flameElement;
                    if (sensorElement.classList.contains('air')) {
                        flameElement = document.querySelector('.blower-flame');
                    } else if (sensorElement.classList.contains('water')) {
                        flameElement = document.querySelector('.humidifier-flame');
                    } else if (sensorElement.classList.contains('heat')) {
                        flameElement = document.querySelector('.heat-exchanger-flame');
                    }

                    if (flameElement) {
                        flameElement.classList.toggle("warning", value === true);
                    }
                }

                // SVG 요소 업데이트
                const svgElement = document.querySelector(`.modal-warning rect#${key}`);
                if (svgElement) {
                    svgElement.classList.toggle("warning", value === true);
                }
            });
        });
    },

    clearAllWarnings: function() {
        // 모든 sensor 요소에서 warning 클래스 제거
        document.querySelectorAll('#fault-diagnosis-list .sensor').forEach(sensor => {
            sensor.classList.remove('warning', 'sample');
        });

        // 모든 SVG rect 요소에서 warning 클래스 제거
        document.querySelectorAll('.modal-warning rect').forEach(rect => {
            rect.classList.remove('warning', 'sample');
        });

        // flame 요소들에서 warning 클래스 제거
        const flameElements = [
            '.blower-flame',
            '.humidifier-flame',
            '.heat-exchanger-flame'
        ];
        
        flameElements.forEach(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.remove('warning', 'sample');
            }
        });

        // 특정 HTML 요소에서 warning 클래스 제거
        const specialElements = {
            "Before_MFM": ".A-before-MFM-s",
            "After_MFM": ".A-after-MFM-s"
        };

        Object.values(specialElements).forEach(selector => {
            const specialElement = document.querySelector(selector);
            if (specialElement) {
                specialElement.classList.remove('warning', 'sample');
            }
        });
    },

    initSensorClickEvents: function() {
        const faultDiagnosisList = document.querySelector('#fault-diagnosis-list');
        if (faultDiagnosisList) {
            faultDiagnosisList.addEventListener('click', (event) => {
                const sensor = event.target.closest('.sensor');
                if (sensor) {
                    // console.log("Sensor clicked:", sensor.getAttribute('data-key'));
                    const key = sensor.getAttribute('data-key');
                    this.toggleSampleClass(sensor, key);
                    
                    // 이벤트 전파 중지
                    event.stopPropagation();
                }
            });
        } else {
            // console.error("Fault diagnosis list not found");
        }
    },

    toggleSampleClass: function(sensorElement, key) {
        console.log("Toggling warning class for:", key);
        
        // 센서 요소에 'warning sample' 클래스 추가
        sensorElement.classList.add('warning', 'sample');
        console.log("Added warning class to sensor element");

        // SVG 요소 업데이트 (특정 ID를 가진 rect만 선택)
        const svgElement = document.querySelector(`.modal-warning rect#${key}`);
        if (svgElement) {
            svgElement.classList.add('warning', 'sample');
            console.log("Added warning class to SVG element");
        }

        // 그룹 요소 업데이트
        let flameElement;
        if (sensorElement.classList.contains('air')) {
            flameElement = document.querySelector('.blower-flame');
        } else if (sensorElement.classList.contains('water')) {
            flameElement = document.querySelector('.humidifier-flame');
        } else if (sensorElement.classList.contains('heat')) {
            flameElement = document.querySelector('.heat-exchanger-flame');
        }

        if (flameElement) {
            flameElement.classList.add('warning', 'sample');
            console.log(`Added warning class to flame element: ${flameElement.className}`);
        }

        // 특정 HTML 요소에 warning 클래스 추가
        const specialElements = {
            "Before_MFM": ".A-before-MFM-s",
            "After_MFM": ".A-after-MFM-s"
        };

        const specialSelector = specialElements[key];
        if (specialSelector) {
            const specialElement = document.querySelector(specialSelector);
            if (specialElement) {
                specialElement.classList.add('warning', 'sample');
                console.log(`Added warning class to special element: ${specialSelector}`);
            } else {
                console.log(`Special element not found for selector: ${specialSelector}`);
            }
        }

        // 6초 후 'warning' 클래스 제거
        setTimeout(() => {
            sensorElement.classList.remove('warning', 'sample');
            if (svgElement) {
                svgElement.classList.remove('warning', 'sample');
            }
            if (flameElement) {
                flameElement.classList.remove('warning', 'sample');
            }

            // 추가된 요구 사항: 특수 HTML 요소에서 warning 클래스 제거
            if (specialSelector) {
                const specialElement = document.querySelector(specialSelector);
                if (specialElement) {
                    specialElement.classList.remove('warning', 'sample');
                }
            }
            console.log("Removed warning class after 8 seconds");
        }, 8000);
    },

    init: function() {
        console.log("Initializing FaultDiagManager");
        this.initSensorClickEvents();

        // 이벤트 리스너 추가
        const clearAlertsBtn = document.getElementById('clear-alerts-btn');
        if (clearAlertsBtn) {
            clearAlertsBtn.addEventListener('click', () => {
                this.clearAllWarnings();
            });
        } else {
            console.error("Clear alerts button not found");
        }
    }
};

export default FaultDiagManager;

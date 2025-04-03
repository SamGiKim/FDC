// qoe.js
const QoeManager = {
    initQoe: function() {
        // 데이터 업데이트 이벤트 리스너 등록
        document.addEventListener('dataUpdated', (e) => {
            this.updateQoeInfo(e.detail);
        });
    },

    loadQoeData: function() {
        // 데이터 새로고침 이벤트 발생
        document.dispatchEvent(new CustomEvent('refreshData'));
    },

    updateQoeInfo: function(data) {
        // data 객체에서 soh 값을 추출
        const sohValue = data?.soh !== undefined ? data.soh : 'N/A';
        
        // sohValue 요소 업데이트
        const sohElement = document.getElementById('sohValue');
        if (sohElement) {
            // 숫자인 경우 소수점 1자리까지 표시
            if (typeof sohValue === 'number') {
                sohElement.innerText = sohValue.toFixed(1);
            } else {
                sohElement.innerText = sohValue;
            }
        } else {
            console.warn('sohValue 요소를 찾을 수 없습니다.');
        }
    }
};

export { QoeManager };
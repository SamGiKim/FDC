import { SessionService }  from '../config/get_session.js';
import FacilityNameService from '../config/get_facility_name.js';

class EventListManager {
    static async updateEventList() {
        try {
            const sessionInfo = await SessionService.getSessionInfo();
            if (!sessionInfo.account_powerplants || sessionInfo.account_powerplants.length === 0) {
                throw new Error('사용 가능한 발전소가 없습니다');
            }
            const powerplantId = sessionInfo.account_powerplants[0];
    
            // 데이터 요청 전 로그
            console.log('알람 로그 요청:', powerplantId);
    
            const response = await axios.get('js/index-front/get_alarm_log.php', {
                params: { powerplant_id: powerplantId }
            });
    
            // 응답 데이터 자세히 확인
            // console.log('알람 로그 응답 전체:', response);
            // console.log('알람 로그 데이터:', response.data);
            // console.log('데이터 타입:', typeof response.data);
            // console.log('데이터 길이:', Array.isArray(response.data) ? response.data.length : '배열 아님');
    
            const alarmList = Array.isArray(response.data) ? response.data : [];
            
            const tbody = document.getElementById('index-front-alarm-log');
            if (!tbody) {
                throw new Error('테이블 요소를 찾을 수 없습니다');
            }
    
            // tbody 상태 확인
            // console.log('tbody 요소:', tbody);
    
            tbody.innerHTML = ''; // 기존 내용 비우기
    
            const rows = alarmList.map(alarm => {
                // 데이터 확인
                // console.log('처리중인 알람:', alarm);
    
                const dateTime = new Date(alarm.time);
                const date = dateTime.toISOString().split('T')[0];
                const time = dateTime.toLocaleTimeString('ko-KR', {
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                    hour12: false
                });
    
                return `
                    <tr>
                        <td><span class="date-div">${date}</span>${time}</td>
                        <td>${alarm.group_id || '-'}</td>
                        <td>${alarm.fuelcell_id || '-'}</td>
                        <td>${alarm.comment || '-'}</td>
                        <td>${alarm.status || '-'}</td>
                        <td>-</td>
                    </tr>
                `;
            });
    
            // 생성된 rows 확인
            // console.log('생성된 행:', rows);
    
            tbody.innerHTML = rows.join('');
    
        } catch (error) {
            console.error('알람 로그 업데이트 실패:', error);
        }
    }
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    EventListManager.updateEventList();
});

export default EventListManager;
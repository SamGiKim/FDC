import { SessionService } from '../config/get_session.js';

class EventListManager {
    static async updateEventList() {
        try {
            const sessionInfo = await SessionService.getSessionInfo();
            if (!sessionInfo.account_powerplants || sessionInfo.account_powerplants.length === 0) {
                throw new Error('사용 가능한 발전소가 없습니다');
            }
            const powerplantId = sessionInfo.account_powerplants[0];
            const alarmTypeSelect = document.getElementById('alarmTypeSelect-front');
            const alarmCountSelect = document.getElementById('alarmCountSelect-front');
            const type = alarmTypeSelect ? alarmTypeSelect.value : '전체';
            const limit = alarmCountSelect ? alarmCountSelect.value : '10';

            const response = await axios.get('js/index-front/front_alarm.php', {
                params: {
                    plant: powerplantId,
                    type: type,
                    limit: limit,
                    filters: '전항목'
                }
            });
            const alarmList = Array.isArray(response.data) ? response.data : [];
            const tbody = document.getElementById('index-front-alarm-log');
            if (!tbody) {
                throw new Error('테이블 요소를 찾을 수 없습니다');
            }

            tbody.innerHTML = ''; // 기존 내용 비우기
            const rows = alarmList.map(alarm => {
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
            tbody.innerHTML = rows.join('');
        } catch (error) {
            console.error('알람 로그 업데이트 실패:', error);
        }
    }
}

// 페이지 로드 시 + 드롭다운 변경 시 실행
document.addEventListener('DOMContentLoaded', () => {
    EventListManager.updateEventList();
    document.getElementById('alarmTypeSelect-front')?.addEventListener('change', () => {
        EventListManager.updateEventList();
    });
    document.getElementById('alarmCountSelect-front')?.addEventListener('change', () => {
        EventListManager.updateEventList();
    });
});

export default EventListManager;

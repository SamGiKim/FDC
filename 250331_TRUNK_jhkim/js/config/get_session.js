export class SessionService {
    // 쿠키에서 세션 해시 가져오기
    static getSessionHash() {
        // console.log('전체 쿠키 문자열:', document.cookie); // 전체 쿠키 확인

        const cookies = document.cookie.split(';');
        // console.log('분리된 쿠키 배열:', cookies); // 쿠키 분리 결과 확인

        for (let cookie of cookies) {
            const [name, value] = cookie.trim().split('=');
            // console.log('쿠키 파싱:', { name, value }); // 각 쿠키의 이름과 값 확인
            
            if (name === 'SESS_ID') {
                // console.log('SESS_ID 찾음:', value);
                return value;
            }
        }
        
        console.error('SESS_ID를 찾을 수 없음. 사용 가능한 쿠키들:', cookies);
        throw new Error('세션 ID를 찾을 수 없습니다');
    }

    static async getSessionInfo() {
        try {
            const sessionHash = this.getSessionHash();
            // console.log('세션 해시값으로 요청:', sessionHash);
            
            const response = await axios.get('js/config/session_redis.php', {
                params: { 
                    session_hash: sessionHash  // session_hash로 파라미터 이름 변경
                }
            });
            
            // console.log('session_redis.php 응답:', response.data);
            
            if (!response.data.redis_connection) {
                throw new Error('Redis 연결 실패');
            }
            
            if (!response.data.session_data) {
                throw new Error(response.data.error || '세션 데이터를 찾을 수 없습니다');
            }
            
            return response.data.session_data;  // 이미 파싱된 세션 데이터
        } catch (error) {
            console.error('세션 정보 조회 실패:', error);
            throw error;
        }
    }

    // 회사 ID 가져오기
    static async getCompanyId() {
        try {
            const sessionInfo = await this.getSessionInfo();
            const companyId = sessionInfo.company_id;
            
            // company_id로 DB 설정 업데이트
            await axios.post('js/config/update_db_config.php', {
                company_id: companyId
            });
            
            return companyId;
        } catch (error) {
            console.error('회사 정보 조회 실패:', error);
            throw error;
        }
    }

    // 권한 정보 가져오기
    static async getAccountRole() {
        try {
            const sessionInfo = await this.getSessionInfo();
            return sessionInfo.account_role;
        } catch (error) {
            console.error('권한 정보 조회 실패:', error);
            throw error;
        }
    }

    // 발전소 목록 가져오기
    static async getPowerplants() {
        try {
            const sessionInfo = await this.getSessionInfo();
            return sessionInfo.account_powerplants;
        } catch (error) {
            console.error('발전소 목록 조회 실패:', error);
            throw error;
        }
    }

    // 현재 선택된 발전소 ID 가져오기
    static async getCurrentPowerplantId() {
        try {
            // URL에서 plant 파라미터 확인
            const urlParams = new URLSearchParams(window.location.search);
            let powerplantId = urlParams.get('plant');

            // URL에 없으면 로컬 스토리지에서 확인
            if (!powerplantId) {
                powerplantId = localStorage.getItem('selected_powerplant');
            }

            // 둘 다 없으면 권한 있는 첫 번째 발전소
            if (!powerplantId) {
                const powerplants = await this.getPowerplants();
                powerplantId = powerplants[0];
                localStorage.setItem('selected_powerplant', powerplantId);
            }

            return powerplantId;
        } catch (error) {
            console.error('현재 발전소 ID 조회 실패:', error);
            throw error;
        }
    }
}


/*
127.0.0.1:6379[1]> get session:048aba41393faa47271849f3627dca520ab9a45e2337a76a3009250368656e96a8ae5b4d6f5f7ba964cadb8c0f2975f8df76431289d35e297327e63c3afed7c0e7
"{\"company_id\":\"3030\",\"account_id\":\"test\",\"account_role\":\"LocalAdmin\",\"session_ipaddr\":\"192.168.100.1\",\"session_created_at\":1740387494}"
*/
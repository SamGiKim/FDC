.
├── **/home/nstek/h2_system/patch_active/FDC/Proj/TRUNK**
├── common_modules.php        # 공통 모듈 파일
│   - 언어 선택기 (한국어/영어) 구현
│   - 세션 관리 및 시설 이름 가져오기 기능
│   - i18n (다국어) 초기화 및 언어 변경 기능
│   - 콘솔 로깅 설정 (개발/프로덕션 모드 true/false)
│
├── navbar.php               # 메인 네비게이션 바 구현(연료전지 레벨 네비바)
│   - 대시보드, BOP, Stack 등 주요 페이지 네비게이션
│   - 발전소, 그룹, 연료전지 선택 드롭다운 메뉴
│   - 페이지 이동 및 URL 파라미터 관리
│   - 동적 네비게이션 상태 관리
│
├── primary_navbar.php       # 상단 네비게이션 바 구현(발전소 레벨 네비바)
│   - 발전소 연료전지 관제 시스템 타이틀 표시
│   - 단순화된 네비게이션 (대시보드, 관리자 페이지)
│   - 연료전지 선택기 및 언어 선택 기능
│   - 세션 및 사용자 인증 관리
│
├── index-front.html         #  발전소 대시보드 페이지
│   - 실시간 성능 데이터 표시
│   - 알람 로그 관리
│   - 연료전지 그룹 및 목록 표시
│
├── admin.html               # 관리자 설정 페이지
│   - 사용자 관리
│   - 시스템 설정
│   - 권한 관리
│
├── index.html               # 대시보드 페이지
│   - 실시간 운영 정보
│   - 시스템 상태 표시
│   - 성능 지표 모니터링
│
├── bop.html                 # BOP 진단 페이지
│   - BOP 센서 데이터 분석
│   - 정상 데이터 학습
│   - 센서 레이블링
│
├── stack.html               # 스택 진단 페이지
│   - 스택 성능 분석
│   - 진단 로그 관리
│   - 북마크 및 태그 관리
│
├── aitraining.html          # AI 학습 관리 페이지(개발 중단됨)
│   - 고장 레이블 관리
│   - 센서 데이터 학습
│   - 모델 상태 관리
│
├── **js**
│   ├── **config**
│   │   ├── [기본 설정]
│   │   ├── config.php        # 기본 설정 파일
│   │   │   - 데이터베이스 접속 정보
│   │   │   - 파일 시스템 경로 설정
│   │   │   - 로그 파일 경로 설정
│   │   │   - 세션 기반 DB 선택
│   │   ├── db_config.php        # MySQL 데이터베이스 연결 설정
│   │   │   - PDO 기반 데이터베이스 연결
│   │   │   - 세션 기반 동적 데이터베이스 선택
│   │   │   - 에러 처리 및 로깅
│   │   ├── update_db_config.php # 데이터베이스 선택 업데이트
│   │   │   - 회사별 데이터베이스 전환
│   │   │   - 세션에 현재 데이터베이스 저장
│   │   │
│   │   ├── [핵심 모듈]
│   │   ├── fuelcellSelector.js  # 연료전지 선택 및 관리 핵심 모듈
│   │   │   - 사이트 구조 관리
│   │   │   │   ∙ 발전소/그룹/연료전지 계층 구조 관리
│   │   │   │   ∙ 세션 기반 사용자별 발전소 접근 권한 처리
│   │   │   │
│   │   │   - 연료전지 설정 관리
│   │   │   │   ∙ 전역 설정 객체 (fuelcellConfig) 관리
│   │   │   │   ∙ 기본 연료전지 설정
│   │   │   │   ∙ 연료전지별 섹션 ID 생성 및 관리
│   │   │   │
│   │   │   - URL 파라미터 처리
│   │   │   │   ∙ plant/group/fuelcell 파라미터 처리
│   │   │   │   ∙ URL 기반 상태 관리
│   │   │   │   ∙ 히스토리 관리
│   │   │   │
│   │   │   - 이벤트 시스템
│   │   │   │   ∙ fuelcellChanged 이벤트
│   │   │   │   ∙ dataLoaded 이벤트
│   │   │   │   ∙ fuelcellConfigLoaded 이벤트
│   │   │   │
│   │   │   - 데이터 동기화
│   │   │   │   ∙ Redis 데이터 관리자와 연동
│   │   │   │   ∙ 실시간 데이터 업데이트
│   │   │   │   ∙ 모델 이름 업데이트
│   │   │  
│   │   ├── redis_dataManager.js   # index.html Redis 연료전지 데이터 관리 모듈
│   │   │   - Redis 키 패턴: {발전소ID}_{연료전지ID}_dash_web
│   │   │   - 연료전지 실시간 데이터 처리
│   │   │   │   ∙ stack_info
│   │   │   │   ∙ realtime_production
│   │   │   │   ∙ real_per_production
│   │   │   │   ∙ operation_rate
│   │   │   │   ∙ e_production, t_production
│   │   │   │   ∙ e_capacity, e_operation
│   │   │   │   ∙ result_event
│   │   │   │   ∙ BOP
│   │   │   │   ∙ HW_Alert
│   │   │   - 기본 데이터 구조 제공
│   │   │
│   │   ├── redis_config.php  # Redis 연결 및 데이터 처리 설정
│   │   │   - CORS 설정 및 헤더 관리
│   │   │   - Redis 서버 연결 (127.0.0.1:6379)
│   │   │   - 섹션별 데이터 조회
│   │   │   - JSON 응답 처리
│   │   │   - 에러 핸들링 및 로깅
│   │   │
│   │   ├── [데이터 조회]
│   │   ├── get_redis_data.php     # Redis 데이터 조회 처리
│   │   │   - Redis 키 패턴: {key} (URL 파라미터로 전달)
│   │   │   - JSON 데이터 유효성 검증
│   │   │   - 에러 처리 및 응답 포맷팅
│   │   │
│   │   ├── get_site_structure.php       # 전체 사이트 구조 데이터 조회
│   │   │   - 발전소/그룹/연료전지 계층 구조
│   │   │   - 사용자 권한 기반 필터링
│   │   │   - fuelcellConfig 데이터 구성
│   │   │
│   │   ├── get_facility_name.js         # 시설 이름 관리
│   │   │   - 표시 이름 포맷팅
│   │   │
│   │   ├── get_powerplant_info.php      # 발전소 정보 조회
│   │   │   - 발전소 기본 정보
│   │   │   - 위치, 용량 등 상세 정보
│   │   │
│   │   ├── get_group_info.php           # 그룹 상세 정보
│   │   │   - 그룹 상세 구성 정보
│   │   │   - 소속 연료전지 목록
│   │   │
│   │   ├── get_fuelcell_info.php        # 연료전지 상세 정보
│   │   │   - 연료전지 상세 스펙
│   │   │   - 운영 상태 정보
│   │   │
│   │   ├── get_model_groups.php         # 모델 그룹 정보 조회
│   │   │   - URL 파라미터: powerplant_id, fuelcell_id
│   │   │   -/FDC/{$powerplant_id}/{$fuelcell_id}/BOP/MODEL/
│   │   │   - 해당 연료전지의 모델 그룹 목록 반환
│   │   │
│   │   ├── [세션 관리]
│   │   ├── get_session.js         # 세션 관리 클라이언트 모듈
│   │   │   - 쿠키 키: SESS_ID
│   │   │   - 세션 데이터 조회 및 관리:
│   │   │   │   ∙ company_id (회사 DB 선택에 사용)
│   │   │   │   ∙ account_role (권한 관리)
│   │   │   │   ∙ account_powerplants (접근 가능 발전소 목록)
│   │   │   - URL 파라미터 'plant' 처리
│   │   │   - localStorage: selected_powerplant
│   │   ├── session_redis.php      # Redis 세션 데이터 조회
│   │   │   - Redis 키 패턴: session:{session_hash}
│   │   │   - 세션 데이터 구조:
│   │   │   │   ∙ company_id
│   │   │   │   ∙ account_id
│   │   │   │   ∙ account_role
│   │   │   │   ∙ session_ipaddr
│   │   │   │   ∙ session_created_at
│   │   │
│   │   ├── [유틸리티]
│   │   ├── modelSelector.js             # 모델 그룹 선택 관리
│   │   │   - 모델 그룹 선택 UI 관리
│   │   │   - localStorage: selectedModelGroup
│   │   │   - 이벤트 처리:
│   │   │   │   ∙ modelGroupChanged (모델 그룹 변경)
│   │   │   │   ∙ fuelcellChanged (연료전지 변경)
│   │   │   - 데이터 연동:
│   │   │   │   ∙ 연료전지별 모델 그룹 로드
│   │   │   │   ∙ 선택된 모델 그룹 데이터 로드
│   │   │   - 자동 초기화 및 상태 복원
│   │   │
│   │   ├── i18n.js           # 다국어 처리 모듈
│   │   │   - 언어 리소스 로드 (loadLocale)
│   │   │   - 번역 적용 (applyTranslations)
│   │   │   - 초기 언어 설정 (initI18n)
│   │   │   - 언어 변경 처리 (changeLanguage)
│   │   │   - 로컬 스토리지 기반 언어 설정 저장
│   │
│   ├── **locales**                # 다국어 지원 리소스 디렉토리
│   │   ├── en.json           # 영어 번역 파일
│   │   └── ko.json           # 한국어 번역 파일
│   │   
│   ├── **index-front**             # index-front.html(발전소 대시보드) 페이지 모듈
│   │   │   - 모든 실시간 데이터는 'js/config/get_redis_data.php'에서 수신
│   │   │   - fuelcellSelector.js의 선택 상태에 따라 데이터 필터링
│   │ 
│   │   ├── facility_status.js # 발전소 시설 상태 관리
│   │   │   - 세션에서 발전소 ID 가져오기
│   │   │   - Redis에서 시설 상태 데이터 조회 ({발전소ID}dash_total_web)
│   │   │   - 정상/주의/경고/위험/정지 상태별 시설 수 표시
│   │   │   - 5초 간격 자동 업데이트
│   │ 
│   │   ├── event_list.js         # 알람 로그 처리
│   │   │   - 알람 상태 실시간 업데이트
│   │   │
│   │   ├── get_alarm_log.php     # 알람 로그 데이터 조회
│   │   │   - 데이터베이스 알람 이력 조회
│   │   │   - 시간별 알람 이력 반환
│   │   │
│   │   ├── fuelcell_group_list.js # 연료전지 그룹 목록
│   │   │   - get_group_list.php로 그룹 정보 조회
│   │   │   - get_site_structure.php로 사이트 구조 조회
│   │   │   - 그룹 계층 구조 표시
│   │   │
│   │   ├── fuelcell_list.js      # 연료전지 목록
│   │   │   - get_fuelcell_info.php로 상세 정보 조회
│   │   │   - 연료전지 상태 표시 및 관리
│   │   │   - 목록 필터링 및 정렬
│   │   │   - 클릭 시 상세 페이지 이동 (URL 파라미터 처리)
│   │   │
│   │   ├── realtime_graph.js     # 실시간 발전량/가동율, 일별, 월별 발전/열생산 현황 그래프 표시
│   │   │   - 성능/생산량 데이터 그래프 렌더링
│   │   │   - 그래프 스케일 및 범례 관리
│   │   │   - 실시간 데이터 시각화
│   │
│   ├── **setting**                   # admin.html(관리자 설정) 페이지 모듈
│   │   │
│   │   ├── [공통 설정]
│   │   ├── setting_common.js # 공통 설정 관리
│   │   │   - 관리자 페이지 모든 조회함수 포함
│   │   │   - 모달 컨트롤 기능(modalSW)
│   │   │   - 체크박스 리스너 관리
│   │   │   - 테이블 데이터 업데이트 함수
│   │   ├── get_users.php         # 전체 사용자 목록
│   │   ├── get_powerplants.php   # 발전소 목록 조회
│   │   ├── get_groups.php    # 그룹 목록 조회
│   │   ├── get_fuelcell_groups.php #  연료전지-그룹 관계 목록 조회
│   │   ├── get_fuelcells.php     # 연료전지 목록 조회
│   │   ├── get_fuelcells_by_powerplant.php # 발전소별 연료전지 조회
│   │   ├── pagination.php        # 페이지네이션 처리
│   │   ├── redis_admin_update.php # 관리 기능에서 데이터 변경 시 Redis 업데이트
│   │   │   - 발전소, 그룹, 연료전지 CRUD 발생 시 대시보드 데이터 갱신
│   │   │   - Redis 키 형식: {발전소ID}dash_total_web, {발전소ID}{연료전지ID}dash_web
│   │   │   - 데이터베이스와 Redis 캐시 간 동기화 처리
│   │   │
│   │   ├── [발전소 관리]
│   │   ├── setting_powerplant.js # 발전소 설정 관리
│   │   ├── add_powerplants.php   # 발전소 추가
│   │   ├── update_powerplant.php # 발전소 수정
│   │   ├── delete_powerplant.php # 발전소 삭제
│   │   │
│   │   ├── [그룹 관리]
│   │   ├── setting_group.js  # 그룹 설정 관리
│   │   ├── add_groups.php    # 그룹 추가
│   │   ├── update_group.php  # 그룹 수정
│   │   ├── delete_group.php  # 그룹 삭제
│   │   ├── connect_group_fuelcells.php # 그룹-연료전지 연결 
│   │   ├── get_groups_by_powerplant.php # 발전소별 그룹 목록
│   │   │
│   │   ├── [연료전지 관리]
│   │   ├── setting_fuelcell.js   # 연료전지 설정 관리
│   │   ├── add_fuelcells.php     # 연료전지 추가
│   │   ├── update_fuelcell.php   # 연료전지 수정
│   │   ├── delete_fuelcell.php   # 연료전지 삭제
│   │   │
│   │   ├── [사용자 관리]
│   │   ├── setting_user.js       # 사용자 설정 관리
│   │   ├── add_user.php          # 일반 사용자 추가
│   │   ├── add_local_admin.php   # 로컬 관리자 추가
│   │   │   - LocalAdmin 권한 계정 생성 전용
│   │   │   - 사용자 역할(role)이 "LocalAdmin"일 때 호출됨
│   │   ├── add_local_user.php    # 로컬 사용자 추가
│   │   │   - User 권한 계정 생성 전용
│   │   │   - 사용자 역할(role)이 "User"일 때 호출됨
│   │   ├── update_user.php       # 사용자 정보 수정
│   │   ├── delete_user.php       # 사용자 삭제
│   │   ├── search_user.php       # 사용자 검색
│   │
│   ├── **dashboard**                  # index.html(연료전지 대시보드) 관련 모듈
│   │   │
│   │   ├── [연료전지 선택기]
│   │   ├── ../config/fuelcellSelector.js  # 연료전지 선택 관리
│   │   │
│   │   ├── [Redis 데이터 파일]
│   │   ├── ../config/redis_dataManager.js   # Redis 데이터 관리
│   │   │   - 연료전지 데이터 캐싱 및 실시간 조회
│   │   │   - 섹션 ID 형식: {발전소ID}{연료전지ID}_dash_web
│   │   │
│   │   ├── [Redis 데이터 받아와 보여주는 위젯]
│   │   ├── dash_dataManager.js   # 대시보드 데이터 관리
│   │   │   - redis_dataManager.js와 연동
│   │   │   - 실시간 데이터 캐싱 및 배포
│   │   │   - 컴포넌트별 데이터 필터링
│   │   │
│   │   ├── dash_eventManager.js  # 대시보드 이벤트 관리
│   │   │   - 컴포넌트 초기화 관리
│   │   │   - fuelcellChanged 이벤트 처리
│   │   │   - dataLoaded 이벤트 처리
│   │   │
│   │   ├── dash_qoe.js           # SoH 지수
│   │   │   - 품질 경험 지표 계산
│   │   │   - 성능 데이터 기반 분석
│   │   │
│   │   ├── dash_operation_rate.js # 발전량/가동률 정보
│   │   │   - 시간/일간 가동률 계산
│   │   │   - operation_rate 데이터 사용
│   │   │
│   │   ├── dash_realtime_production.js # 실시간 생산량
│   │   │   - 전기/열 생산량 표시
│   │   │   - realtime_production 데이터 사용
│   │   │
│   │   ├── dash_bopDiagram.js    # 시스템 구조도
│   │   │   - BOP 상태 다이어그램
│   │   │   - BOP 데이터 시각화
│   │   │
│   │   ├── dash_bar_chart.js     # 성능 차트
│   │   │   - 성능 지표 차트 표시
│   │   │   - e_production, t_production 데이터 사용
│   │   │
│   │   ├── dash_alarm.js         # 알람 로그
│   │   │   - load_alarm.php와 통신
│   │   │   - 실시간 알람 표시
│   │   │
│   │   ├── load_alarm.php        # 알람 데이터 로드
│   │   │   - Redis 알람 데이터 조회
│   │   │   - 알람 이력 필터링
│   │   │
│   │   ├── dash_faultDiag.js     # 고장 진단 리스트
│   │   │   - result_event 데이터 처리
│   │   │   - 고장 진단 결과 표시
│   │   │
│   │   ├── dash_hwAlert.js       # HW센서정보
│   │   │   - HW_Alert 데이터 처리
│   │   │   - 하드웨어 상태 모니터링
│   │   │
│   │   ├── dash_operation_info.js # 운전 정보 표시
│   │   │   - 운전 상태 및 모드 표시
│   │   │   - redis_dataManager.js 실시간 데이터 구독
│   │   │
│   │   ├── dash_system_info.js   # 시스템 정보 표시
│   │   │   - 연료전지 기본 정보 표시
│   │   │   - get_fuelcell_info.php 데이터 사용
│   │   │
│   ├── **bop**                   # bop.html(BOP 진단) 관련 모듈
│   │   
│   │   ├── [연료전지 선택기]
│   │   ├── ../config/fuelcellSelector.js  # 연료전지 선택 관리
│   │   │
│   │   ├── [모델 그룹 선택 위젯]
│   │   ├── ../config/modelSelector.js  # 모델 그룹 선택 핵심 모듈
│   │   │   - 발전소/연료전지별 사용 가능한 모델 그룹 목록 로드
│   │   │   - 모델 그룹 선택 UI 관리 및 드롭다운 컨트롤
│   │   │   - localStorage에 선택된 모델 그룹(selectedModelGroup) 저장
│   │   │   - 모델 변경 시 modelGroupChanged 이벤트 발생
│   │   │   - fuelcellChanged 이벤트 감지 시 모델 목록 자동 갱신
│   │   │
│   │   ├── modelName.js               # 현재 적용된 모델 표시 모듈
│   │   │   - Redis에서 '{plant}_{fuelcell}_model_apply' 키 값 조회
│   │   │   - UI에 현재 적용된 모델 이름 실시간 표시
│   │   │   - 5초마다 자동 갱신으로 모델 적용 상태 모니터링
│   │   │   - 연료전지 변경 시 표시 정보 자동 업데이트
│   │   │
│   │   ├── get_model_apply.php        # 모델 적용 상태 조회
│   │   │   - Redis에서 현재 적용된 모델 정보 조회
│   │   │   - plant/fuelcell 파라미터 기반 데이터 필터링
│   │   │   - 적용 상태 및 시간 정보 JSON 형식 반환
│   │   │
│   │   ├── [BOP 진단 적용 위젯]
│   │   ├── bopDiagApply.js           # BOP 진단 모델 적용 핵심 관리 모듈
│   │   │   - 진단 모델 선택 및 적용 UI 구현 (DiagModelSelector 클래스)
│   │   │   - 모델 적용 및 학습 시작/중지 기능 제공
│   │   │   - 날짜 범위 선택기로 학습 데이터 기간 설정
│   │   │
│   │   ├── get_model_status.php       # 모델 실행 상태 조회
│   │   │   - Redis에서 '{plant}_{fuelcell}_model_status' 키 값 확인
│   │   │   - 모델의 실행 상태(true/false) 반환
│   │   │   - bopDiagApply.js가 5초마다 호출하여 상태 갱신
│   │   │
│   │   ├── update_DB_bop_diag_apply.php    # DB 모델 적용 정보 저장
│   │   │   - api_modelapply 테이블에 모델 적용 정보 저장
│   │   │   - 기존 레코드 존재 시 UPDATE, 없을 경우 INSERT 처리
│   │   │   - powerplant_id, group_id, fuelcell_id, model_name 저장
│   │   │   - PDO 기반 데이터베이스 트랜잭션 처리
│   │   │
│   │   ├── update_Redis_bop_diag_apply.php # Redis 모델 적용 정보 저장
│   │   │   - '{plant}_{fuelcell}_model_apply' 키에 모델명 저장
│   │   │   - 다른 모듈(modelName.js)이 이 키를 참조하여 UI 업데이트
│   │   │   - 출력 버퍼 제어로 안정적 JSON 응답 제공
│   │   │
│   │   ├── [정상 데이터 학습 위젯]
│   │   ├── normalDataTraining.js      # 정상 데이터 학습 관리 모듈
│   │   │   - 정상 운전 데이터 기반 모델 학습 기능 제공
│   │   │   - 데이터 유형별 처리 (시간 범위 선택 또는 파일 선택)
│   │   │   - 선택된 데이터를 API 서버로 전송하여 학습 요청
│   │   │   - 날짜와 시간 포맷 처리 및 파일명 생성 로직 구현
│   │   │   - 체크박스 선택 기반의 데이터 수집 및 검증
│   │   │
│   │   ├── [BOP 정상 학습 데이터 위젯]
│   │   ├── bopNormalData.js          # BOP 정상 학습 데이터 관리 핵심 모듈
│   │   │   - 정상 데이터 테이블 초기화 및 이벤트 리스너 설정
│   │   │   - 시간 범위 기반 정상 데이터 추가 기능
│   │   │   - 파일(LST) 추가 및 관리 UI 구현
│   │   │   - 선택된 데이터로 정상 학습 파일 생성 기능
│   │   │   - 체크박스 기반 다중 선택 및 삭제 기능
│   │   │   - API 서버와 통신하여 데이터 병합 요청(nm_merge)
│   │   │
│   │   ├── get_normal_data.php        # 정상 데이터 목록 조회
│   │   │   - 발전소/연료전지 기준 정상 데이터 검색
│   │   │   - type=1(시간 범위) 또는 type=2(파일명) 데이터 필터링
│   │   │   - JSON 형식으로 데이터 반환
│   │   │
│   │   ├── add_normal_data_time.php   # 시간 범위 정상 데이터 추가
│   │   │   - 선택된 날짜/시간 범위 정보 저장
│   │   │   - 중복 데이터 검증 및 오류 처리
│   │   │   - type=1 형식으로 DB 저장
│   │   │
│   │   ├── delete_normal_data.php     # 정상 데이터 삭제
│   │   │   - 선택된 항목들의 일괄 삭제 처리
│   │   │   - 데이터 유형(type)에 따른 처리 분기
│   │   │   - 트랜잭션 기반 안전한 삭제 처리
│   │   │
│   │   ├── check_file_exists.php      # 파일명 중복 검사
│   │   │   - 정상 데이터 생성 시 파일명 중복 체크
│   │   │   - BOP/MODEL 디렉토리 내 파일 존재 여부 확인
│   │   │   - 파일시스템 및 데이터베이스 기반 검증
│   │   │
│   │   ├── get_normal_data_file_list.php # LST 파일 목록 조회
│   │   │   - 발전소/연료전지별 사용 가능한 LST 파일 목록 제공
│   │   │   - 파일 추가 및 부가 모달에서 사용
│   │   │   - 디렉토리 기반 파일 목록 수집
│   │   │
│   │   ├── add_new_file_name.php      # 새 LST 파일 데이터 추가
│   │   │   - 선택된 LST 파일들을 데이터베이스에 등록
│   │   │   - type=2 형식으로 파일명만 DB 저장
│   │   │   - 중복 파일명 검사 및 오류 처리
│   │   │
│   │   ├── append_lst_into_data.php   # LST 파일 분석하여 시간 데이터 추출
│   │   │   - LST 파일 내용 분석하여 날짜/시간 정보 추출
│   │   │   - 중복 검사 후 새 시간 범위만 데이터베이스에 추가
│   │   │   - 추가된 항목과 중복 항목 목록 반환
│   │   │
│   │   ├── [BOP 센서 라벨링 데이터 위젯]
│   │   ├── [BOP 센서 라벨링 시스템]
│   │   ├── bopSensorLabelingData.js   # BOP 센서 라벨링 데이터 관리 모듈
│   │   │   - 센서 오류 코드 매핑(errorCodeMapping) 객체 제공
│   │   │   - 라벨링 데이터 목록 표시 및 페이지네이션 처리
│   │   │   - 시간 범위 기반 센서 라벨링 데이터 추가/수정/삭제
│   │   │   - 날짜 클릭 시 이벤트 데이터 로드 및 캘린더 연동
│   │   │   - 모달 기반의 상세 정보 보기 및 수정 인터페이스
│   │   │
│   │   ├── get_sensor_labeling_data.php    # 라벨링 데이터 목록 조회
│   │   │   - 발전소/연료전지 기준 라벨링 데이터 검색
│   │   │   - 페이지네이션 지원(현재 페이지, 항목 수 파라미터)
│   │   │   - 에러 코드 기반 필터링 기능
│   │   │   - JSON 형식으로 데이터 및 페이지 정보 반환
│   │   │
│   │   ├── get_sensor_labeling_data_by_id.php # ID별 라벨링 상세 조회
│   │   │   - 특정 ID의 라벨링 데이터 상세 정보 제공
│   │   │   - 시작/종료 시간, 에러 코드, 온습도, 설명 등 포함
│   │   │   - 모달에서 상세 정보 표시 시 사용
│   │   │
│   │   ├── add_sensor_labeling_data.php    # 라벨링 데이터 추가
│   │   │   - 시간 범위, 에러 코드, 온습도, 설명 정보 저장
│   │   │   - 발전소/연료전지 정보와 함께 데이터베이스에 저장
│   │   │   - 중복 검사 및 데이터 유효성 검증
│   │   │
│   │   ├── update_sensor_labeling_data.php    # 라벨링 데이터 수정
│   │   │   - 기존 라벨링 데이터의 모든 필드 업데이트
│   │   │   - 에러 코드, 시간 범위, 온습도, 설명 수정 지원
│   │   │   - 트랜잭션 기반 안전한 데이터 업데이트
│   │   │
│   │   ├── delete_sensor_labeling_data.php # 라벨링 데이터 삭제
│   │   │   - 선택된 라벨링 데이터 ID 기반 삭제
│   │   │   - 단일 또는 다중 항목 삭제 지원
│   │   │   - 삭제 결과 및 성공/실패 메시지 반환
│   │   │
│   │   ├── get_event.php              # 이벤트 데이터 조회
│   │   │   - 특정 날짜(년/월/일)의 이벤트 데이터 검색
│   │   │   - 발전소/연료전지 기준 필터링
│   │   │   - API 이벤트(type=0)와 검색 이벤트(type=1) 구분 제공
│   │   │   - CSV 형식으로 데이터 반환 (행 단위 이벤트 정보)
│   │   │
│   │   ├── bop_HWSensorList.js       # HW BOP 센서 리스트
│   │   │   - 하드웨어 센서 목록 UI
│   │   │   - 센서 상태 모니터링
│   │   │   - 센서 선택 기능
│   │   │
│   │   ├── [기타]
│   │   ├── bop_soh.js                # Soh 위젯
│   │   ├── get_bop_soh.php          # Soh 데이터 조회
│   │
│   ├── **stack**                      # stack.html 페이지 관련 모듈
│   │   │
│   │   ├── [연료전지 선택기]
│   │   ├── ../config/fuelcellSelector.js  # 연료전지 선택 관리
│   │   │   - 연료전지 선택 UI 컴포넌트 관리
│   │   │   - localStorage에 선택된 연료전지 정보 저장
│   │   │   - fuelcellChanged 이벤트 발생 및 처리
│   │   │
│   │   ├── [SIN/PULSE 검색 위젯]
│   │   ├── stack_search.js            # 스택 데이터 검색/표시 (핵심 모듈)
│   │   │   - SIN/PULSE 모드 전환 및 각 모드별 UI 관리
│   │   │   │   ∙ initializeTypeSelector(): 검색 유형 UI 초기화
│   │   │   │   ∙ updateEisOptions(): 선택된 타입에 따라 검색 옵션 변경
│   │   │   │
│   │   │   - 고급 검색 기능
│   │   │   │   ∙ initializeSearchConditions(): 검색 조건 초기화
│   │   │   │   ∙ getSearchDateRange(): 날짜 범위 처리
│   │   │   │   ∙ 필드별 비교 조건(over/under) 지원
│   │   │   │   ∙ resetSearchConditions(): 검색 조건 초기화
│   │   │   │
│   │   │   - 데이터 처리 및 표시
│   │   │   │   ∙ fetchData(): API 호출 및 결과 가져오기
│   │   │   │   ∙ displayResults(): 검색 결과 테이블 렌더링
│   │   │   │   ∙ updateTable(): 테이블 데이터 동적 업데이트
│   │   │   │   ∙ displayPagination(): 페이지네이션 UI 구현
│   │   │   │
│   │   │   - 그래프 관련 기능
│   │   │   │   ∙ copyFilesForGraph(): 그래프 데이터 파일 복사 처리
│   │   │   │   ∙ handleFileOperations(): 파일 작업 처리
│   │   │   │   ∙ saveMaxValueToFile(): 최대값 설정 저장
│   │   │   │   ∙ clearSelectedDirectory(): 임시 파일 폴더 정리
│   │   │   │
│   │   │   - 북마크 및 데이터 관리
│   │   │   │   ∙ getBookmarkTabs(): 북마크 탭 로드
│   │   │   │   ∙ handleTabClick(): 탭 전환 처리
│   │   │   │   ∙ addBookmark(), deleteBookmarks(): 북마크 CRUD
│   │   │   │   ∙ handleDeleteItems(): 선택된 아이템 삭제
│   │   │   │   ∙ updateBigoInDatabase(): 비고 필드 실시간 업데이트
│   │   │   │
│   │   │   - 이벤트 처리 시스템
│   │   │   │   ∙ setupEventListeners(): 전체 이벤트 리스너 등록
│   │   │   │   ∙ initCheckboxStateAndSelectAll(): 체크박스 상태 관리
│   │   │   │   ∙ handleSelectAllChange(): 전체 선택 처리
│   │   │   │   ∙ handleDateCellClick(): 날짜 셀 클릭 이벤트 처리
│   │   │
│   │   ├── stack_search.php           # 검색 데이터 처리
│   │   │   - SIN/PULSE 데이터 검색 처리
│   │   │   - GET 파라미터: page, perPage, powerplant_id, fuelcell_id, type(SIN/PULSE), bookmarkId
│   │   │   - 페이지네이션 지원(기본 100건)
│   │   │   - 검색 조건 지원: 날짜 범위, 라벨, 비고(#키워드 구분), 오류코드(MERR)
│   │   │   - 필드별 상세조건검색 지원(over/under)
│   │   │
│   │   ├── copyFileForGraph.php       # 그래프용 파일 복사
│   │   │   - 검색 결과 파일을 그래프용 디렉토리로 복사
│   │   │   - 파일명에 색상코드 추가 처리
│   │   │   - 검색 테이블의 좌표 데이터(X1, X2, Y1, Y2) 함께 반환
│   │   │   - 원본 파일 경로는 발전소/연료전지 ID와 날짜 기반으로 구성
│   │   │
│   │   ├── update_bigo.php            # 비고 업데이트
│   │   ├── update_error_code.php      # 에러 코드 업데이트
│   │   ├── stack_label_update.php     # 라벨 업데이트
│   │   ├── delete_files_in_selected.php  # 그래프용 임시 폴더 초기화
│   │   │   - 그래프 표시를 위해 복사된 모든 파일 삭제
│   │   │   - /home/nstek/h2_system/patch_active/FDC/work/bjy/impedance/selected/ 디렉토리 내 파일 제거
│   │   │
│   │   ├── delete_search_data.php     # 검색 데이터 삭제
│   │   │   - 북마크/일반 모드별 테이블 삭제 처리
│   │   │   - 선택 항목 영구 제거
│   │   │
│   │   ├── delete_selected_file.php   # 그래프 파일 삭제
│   │   │   - 검색 테이블 정보 기반 파일 삭제
│   │   │   - 색상코드 포함 관련 파일 일괄 제거
│   │   │
│   │   ├── saveMaxValue.php           # 그래프 최대값 저장
│   │   │   - 최대값 파라미터 처리 및 저장
│   │   │   - 설정 파일 경로 관리
│   │   │
│   │   ├── get_data_detail.php        # 항목 상세 정보 조회
│   │   │   - 번호 기준 데이터 조회
│   │   │   - JSON 형식 결과 반환
│   │   │
│   │   ├── [스택 검색 위젯의 태그 관리]
│   │   ├── stack_tag_manager.js        # 태그 관리 UI
│   │   │   - 태그 CRUD 인터페이스
│   │   │   - 태그 드래그앤드롭 정렬
│   │   │   - 태그 필터링 기능
│   │   ├── save_tag.php               # 태그 저장
│   │   │   - 새 태그 생성
│   │   │   - 태그 정보 업데이트
│   │   ├── load_tags.php              # 태그 로드
│   │   │   - 저장된 태그 목록 조회
│   │   │   - 태그별 메타데이터 로드
│   │   ├── delete_tag.php             # 태그 삭제
│   │   │   - 태그 및 연관 데이터 삭제
│   │   │   - 참조 무결성 확인
│   │   ├── update_tag_order.php       # 태그 순서 업데이트
│   │   │   - 태그 순서 저장
│   │   │   - 순서 변경 이력 관리
│   │   │
│   │   ├── [스택 검색 위젯의 북마크 관리]
│   │   ├── add_bookmark.php           # 북마크 추가
│   │   │   - 새 북마크 생성
│   │   ├── delete_bookmark.php        # 북마크 삭제
│   │   │   - 북마크 제거
│   │   │   - 연관 파일 정리
│   │   ├── get_bookmark.php           # 북마크 조회
│   │   │   - 북마크 목록 로드
│   │   │   - 상세 정보 조회
│   │   ├── update_bookmark.php        # 북마크 수정
│   │   ├── save_bookmark_data.php     # 북마크(북마크-항목 매핑)를 데이터베이스 저장
│   │   ├── copyFileForBookmark.php    # 북마크용 파일 복사
│   │   │   - 북마크 관련 파일 복제
│   │   │   - 메타데이터 복사
│   │   ├── color_map.php             # 색상 맵 조회
│   │   │
│   │   ├── [유닛 컨트롤 위젯]
│   │   ├── unitControl.js             # 유닛 제어 UI
│   │   │   - 진단 장비 상태 모니터링
│   │   │   - 다양한 진단 모드(connect, run, pulse) 지원
│   │   │   - 연료전지 변경 시 자동 상태 업데이트
│   │   │
│   │   ├── unitControl_redis.php      # Redis 데이터 처리
│   │   │   - 게이트웨이 상태 정보 처리
│   │   │   - 데이터 새로고침 시점 추적
│   │   │   │   ∙ {발전소ID}_{연료전지ID}_fdu_prg: 게이트웨이 상태 정보
│   │   │   │   ∙ {발전소ID}_{연료전지ID}_fdu_uploaded: 데이터 새로고침 시점
│   │   │
│   │   ├── search_updateEIS.js        # 자동 EIS 측정 결과 처리
│   │   │   - Redis를 통한 측정 완료 감지 및 후처리
│   │   │   - EIS 명령 실행 후 자동으로 최신 데이터 체크
│   │   │   - 새 측정 데이터를 SIN 데이터 테이블에서 자동 선택 및 그래프 생성
│   │   │
│   │   ├── get_latest_data.php        # 연료전지별 최신 측정 데이터 조회
│   │   │   - 특정 연료전지의 가장 최근 측정값 반환
│   │   │   - search_updateEIS.js에서 호출되어 자동화 지원
│   │   │   - 새 EIS 측정 완료 시 해당 데이터 식별에 사용
│   │   │
│   │   ├── [AVHA 전료/전압/수소/공기 현황 위젯]
│   │   ├── AVHA_state.js              # 전류/전압/수소/공기 상태
│   │   │   - 연료전지 주요 운전 파라미터 실시간 모니터링
│   │   │   │   ∙ 전류(Current), 전압(Voltage) 데이터 표시
│   │   │   │   ∙ 수소(MFC1-H2), 공기(MFM3-Air) 유량 정보 시각화
│   │   │
│   │   ├── get_AVHA_value.php         # AVHA 값 조회
│   │   │
│   │   ├── [기타/유틸리티]
│   │   ├── stack_diagnosis_log.js      # 진단 로그 위젯
│   │   ├── stack_stack_diagnosis.js    # 스택 진단 위젯
│   │   ├── get_bop_date_on_search.php    # BOP 페이지 데이터로 STACK 페이지 그래프 생성
│   │   │   - 타임스탬프 기반 날짜 데이터 검색
│   │   │   - 검색 결과의 순서 정보 제공
│   │   │   - JSON 형식 응답 처리
│   │   │
│   │   ├── stack_dataManager.js        # 진단로그/스택진단 데이터 관리
│   │   │   - CSV 파일 데이터 로드 및 자동 갱신
│   │   │   - 진단 로그 데이터 파싱 및 변환
│   │   │   - 스택 진단 데이터 구조화
│   │   │
│   │   ├── stack_eventManager.js       # 스택 이벤트 처리
│   │   │   - 진단 로그 데이터 페이징 표시
│   │   │   - 페이지 네비게이션 인터페이스 관리
│   │   │   - 체크박스 선택 기능 제공
│   │   ├── color_map.php             # 색상 맵 조회
│   │
│   ├── **aitraining**                         # aitraining.html  관련 모듈(개발 중단됨)
│   │   
│   │   ├── [핵심 모듈]
│   │   ├── ../config/stackSelector.js  # 이전 연료전지 선택 관리, 삭제된 파일
│   │   ├── ../config/fuelcellSelector.js  파일 기준으로 리팩토링 필요하지만, 개발 중단돼서 추후 개발계획에 따라 달라짐.
│   │   ├── modelSelector.js     # 모델 그룹 선택 관리 핵심 모듈
│   │   │   - 모델 그룹 선택 UI 관리
│   │   │   - localStorage에 선택된 모델 그룹 저장
│   │   │   - modelGroupChanged 이벤트 발행 및 처리
│   │   │   - 연료전지 변경 시 모델 그룹 목록 자동 갱신
│   │   │
│   │   ├── [학습 모델 검증]
│   │   ├── fault_label_list.js        # 고장 라벨 목록 관리 및 모델 검증
│   │   │   - 고장 데이터 목록 표시 및 필터링
│   │   │   - 검증 대상 데이터 선택 및 API 전송
│   │   │   - 날짜 선택 시 그래프 연동
│   │   │   - 에러 코드 선택 이벤트 처리
│   │   │
│   │   ├── get_fault_label_list.php   # 고장 라벨 데이터 조회
│   │   │   - 연료전지별 고장 이벤트 목록 조회
│   │   │   - 모델 그룹별 검증 점수 조회
│   │   │   - 에러 코드 기반 필터링
│   │   │   - 날짜별 정렬 처리
│   │   │
│   │   ├── get_progress.php           # 검증 진행상태 조회
│   │   │   - Redis에서 검증 진행상황 조회
│   │   │   - 진행률, 완료 항목 수, 상태 정보 제공
│   │   │   - 검증 작업 모니터링 지원
│   │   │
│   │   ├── [센서 데이터 관리 위젯]
│   │   ├── hw_sensor_table_list.js    # 하드웨어 센서 데이터 테이블
│   │   │   - 센서 선택에 따른 데이터 테이블 표시
│   │   │   - 센서별 CSV 파일 로드 및 파싱
│   │   │   - 선택된 센서의 그래프 생성(init_aitraining_graph_2 호출)
│   │   │   - 모델 그룹 및 연료전지 변경 이벤트 처리
│   │   │
│   │   ├── get_hw_sensor_table_list.php # 센서 데이터 CSV 파일 조회
│   │   │   - 모델 그룹 디렉토리에서 센서별 CSV 파일 로드
│   │   │   - 파일 경로: /home/nstek/h2_system/FDC/{powerplant_id}/{fuelcell_id}/BOP/MODEL/{modelGroup}/{fileName}
│   │   │   - CSV 데이터를 JSON 형식으로 변환하여 반환
│   │   │   - 파일 존재 여부 검증 및 오류 처리
│   │   │   
│   │   ├── sensorList.js              # 센서 목록 관리
│   │   │   - 고장진단 결과 표시
│   │   │   - 센서 데이터 표시 및 필터링
│   │   │
│   │   ├── get_model_data.php         # 모델 데이터 조회
│   │   │   - 선택된 모델의 상세 정보 조회
│   │   │   - 학습 이력 및 성능 정보 제공
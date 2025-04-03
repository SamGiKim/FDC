├── **/home/nstek/h2_system/patch_active/FDC/Proj/TRUNK**
├── common_modules.php        # 언어 선택, 콘솔로그 관리  모듈
├── navbar.php               # 메인 네비게이션 바 컴포넌트(연료전지 레벨 네비바)
├── primary_navbar.php       # 상단 네비게이션 바 컴포넌트(발전소 레벨 네비바)
├── index-front.html         # 발전소 대시보드 페이지
├── admin.html               # 관리자 설정 페이지
├── index.html               # 대시보드 페이지
├── bop.html                 # BOP 진단 페이지
├── stack.html               # 스택 진단 페이지
├── aitraining.html          # AI 학습 관리 페이지(개발 중단됨)
│   
├── **js**
│   ├── **config**
│   │   ├── [기본 설정]
│   │   ├── config.php # 기본 설정 파일 (DB, 경로, 로그)
│   │   ├── db_config.php # MySQL 데이터베이스 연결 설정
│   │   ├── update_db_config.php # 데이터베이스 선택 업데이트
│   │   
│   │   ├── [핵심 모듈]
│   │   ├── fuelcellSelector.js # 연료전지 선택 및 관리 핵심 모듈
│   │   │   - URL 파라미터 처리
│   │   │   - 선택기 UI 관리
│   │   │   - 사이트 구조 로딩
│   │   ├── redis_dataManager.js # index.html Redis 연료전지 데이터 관리 모듈
│   │   │   - {발전소ID}{연료전지ID}_dash_web 형식 섹션 처리
│   │   │   - 실시간 데이터 로딩
│   │   ├── redis_config.php  # Redis 연결 및 데이터 처리 설정
│   │ 
│   │   ├── [데이터 조회]
│   │   ├── get_redis_data.php # Redis 데이터 조회 처리
│   │   ├── get_site_structure.php # 전체 사이트 구조 데이터 조회
│   │   ├── get_facility_name.js # 발전소, 그룹, 연료전지 이름 조회
│   │   │   - 화면에 표시할 시설 이름 포맷팅
│   │   ├── get_powerplant_info.php # 발전소 정보 조회
│   │   ├── get_group_info.php # 그룹 상세 정보
│   │   ├── get_fuelcell_info.php # 연료전지 상세 정보
│   │   ├── get_model_groups.php # 모델 그룹 조회
│   │ 
│   │   ├── [세션 관리]
│   │   ├── get_session.js # 세션 관리 클라이언트 모듈
│   │   ├── session_redis.php # Redis 세션 데이터 조회
│   │ 
│   │   ├── [유틸리티]
│   │   ├── modelSelector.js # 모델 그룹 선택 관리
│   │   │   - localStorage: selectedModelGroup
│   │   ├── i18n.js # 다국어 처리 모듈
│   │   │   - 언어 전환 기능
│   │   │
│   ├── **locales**                # 다국어 지원 리소스 디렉토리
│   │   ├── en.json           # 영어 번역 파일
│   │   └── ko.json           # 한국어 번역 파일
│   │
│   ├── **index-front**                # index-front.html(발전소 대시보드) 페이지 모듈
│   │   ├── facility_status.js #설비 현황 
│   │   ├── fuelcell_group_list.js # 연료전지 그룹 리스트 
│   │   ├── fuelcell_list.js     # 연료전지 리스트 
│   │   ├── event_list.js        # 알람 로그 
│   │   ├── get_alarm_log.php # 알람 로그 조회
│   │   ├── realtime_graph.js # 실시간 그래프 
│   │   
│   ├── **setting**                    # admin.html(관리자 설정) 페이지 모듈
│   │   │
│   │   ├── [공통 설정]
│   │   ├── setting_common.js     # 공통 설정 관리(관리자 페이지 모든 조회함수 포함)
│   │   ├── get_users.php         # 전체 사용자 목록
│   │   ├── get_powerplants.php   # 발전소 목록 조회
│   │   ├── get_groups.php    # 그룹 목록 조회
│   │   ├── get_fuelcell_groups.php #  연료전지-그룹 관계 목록 조회
│   │   ├── get_fuelcells.php     # 연료전지 목록 조회
│   │   ├── get_fuelcells_by_powerplant.php # 발전소별 연료전지 조회
│   │   ├── pagination.php        # 페이지네이션 처리
│   │   ├── redis_admin_update.php  # 발전소, 그룹, 연료전지 CRUD 발생시 대시보드 데이터 업데이트 요청
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
│   │   ├── connect_group_fuelcells.php # 그룹-연료전지 연결 위젯
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
│   │   ├── add_local_user.php    # 로컬 사용자 추가
│   │   ├── update_user.php       # 사용자 정보 수정
│   │   ├── delete_user.php       # 사용자 삭제
│   │   ├── search_user.php       # 사용자 검색
│   │   
│   ├── **dashboard**                  # index.html(연료전지 대시보드) 페이지 관련 모듈
│   │   │
│   │   ├── [연료전지 선택기]
│   │   ├── ../config/fuelcellSelector.js  # 연료전지 선택 관리
│   │   │
│   │   ├── [Redis 데이터 파일]
│   │   ├── ../config/redis_dataManager.js   # Redis 데이터 관리
│   │   │
│   │   ├── [Redis 데이터 받아와 보여주는 위젯]
│   │   ├── dash_eventManager.js  # 대시보드 전체 위젯 이벤트 관리
│   │   ├── dash_system_info.js   # 시스템 정보 
│   │   ├── dash_operation_info.js # 운전 정보 표시
│   │   ├── dash_operation_rate.js # 발전량/가동률 정보
│   │   ├── dash_realtime_production.js # 실시간 생산량
│   │   ├── dash_bar_chart.js     # 전기/열 생산량 막대 차트
│   │   ├── dash_bopDiagram.js    # BOP 다이어그램
│   │   ├── dash_alarm.js         # 알람 로그
│   │   ├── load_alarm.php        # 알람 데이터 로드
│   │   ├── dash_hwAlert.js       # HW 센서정보
│   │   ├── dash_faultDiag.js     # 고장 진단
│   │   ├── dash_qoe.js           # Soh
│   │
│   ├── **bop**                  # bop.html(BOP 진단) 관련 모듈
│   │   │
│   │   ├── [연료전지 선택기]
│   │   ├── ../config/fuelcellSelector.js  # 연료전지 선택 관리
│   │   │
│   │   ├── [모델 그룹 선택 위젯]
│   │   ├── ../config/modelSelector.js  # 모델링 그룹 선택
│   │   ├── modelName.js               # 현재 적용 모델
│   │   ├── get_model_apply.php        # 모델 적용 상태 조회
│   │   │
│   │   ├── [BOP 진단 적용 위젯]
│   │   ├── bopDiagApply.js           # BOP 진단 적용
│   │   ├── get_model_status.php       # 모델 상태 조회
│   │   ├── update_DB_bop_diag_apply.php    # DB 진단 결과 저장
│   │   ├── update_Redis_bop_diag_apply.php # Redis 진단 결과 저장
│   │   │
│   │   ├── [정상 데이터 학습 위젯]
│   │   ├── normalDataTraining.js      # 정상 데이터 학습
│   │   │
│   │   ├── [BOP 정상 학습 데이터 위젯]
│   │   ├── bopNormalData.js          # BOP 정상 학습 데이터 관리 핵심 모듈
│   │   ├── get_normal_data.php        # 정상 데이터 목록 조회
│   │   ├── add_normal_data_time.php   # 시간 범위 정상 데이터 추가
│   │   ├── delete_normal_data.php     # 정상 데이터 삭제
│   │   ├── check_file_exists.php      # 파일명 중복 검사
│   │   ├── get_normal_data_file_list.php # LST 파일 목록 조회
│   │   ├── add_new_file_name.php      # 새 LST 파일 데이터 추가
│   │   ├── append_lst_into_data.php   # LST 파일 분석하여 시간 데이터 추출
│   │   │
│   │   ├── [BOP 센서 라벨링 데이터 위젯]
│   │   ├── bopSensorLabelingData.js   # BOP 센서 라벨링 데이터
│   │   ├── get_event.php             # 이벤트 데이터 조회
│   │   ├── bop_HWSensorList.js       # HW BOP 센서 리스트
│   │   ├── add_sensor_labeling_data.php    # 레이블링 데이터 추가
│   │   ├── delete_sensor_labeling_data.php # 레이블링 데이터 삭제
│   │   ├── get_sensor_labeling_data.php    # 레이블링 데이터 조회
│   │   ├── get_sensor_labeling_data_by_id.php # ID별 레이블링 조회
│   │   ├── update_sensor_labeling_data.php    # 레이블링 데이터 수정
│   │   │
│   │   ├── [기타]
│   │   ├── bop_soh.js                # Soh 위젯
│   │   ├── get_bop_soh.php          # Soh 데이터 조회
│   │
│   │
│   ├── **stack**                      # stack.html 페이지 관련 모듈
│   │   │
│   │   ├── [연료전지 선택기]
│   │   ├── ../config/fuelcellSelector.js  # 연료전지 선택 관리
│   │   │
│   │   ├── [SIN/PULSE 검색 위젯]
│   │   ├── stack_search.js            # 스택 데이터 검색/표시
│   │   ├── stack_search.php           # 검색 데이터 처리
│   │   ├── copyFileForGraph.php       # 그래프용 파일 복사
│   │   ├── update_bigo.php            # 비고 업데이트
│   │   ├── update_error_code.php      # 에러 코드 업데이트
│   │   ├── stack_label_update.php     # 라벨 업데이트
│   │   ├── delete_files_in_selected.php  # 선택 파일 삭제
│   │   ├── delete_search_data.php     # 검색 데이터 삭제
│   │   ├── delete_selected_file.php   # 선택 파일 삭제
│   │   ├── get_pulse_name.php         # 펄스 이름 조회
│   │   ├── saveMaxValue.php           # 최대값 저장
│   │   ├── get_data_detail.php         # 상세 데이터 조회
│   │   │
│   │   ├── [SIN/PULSE 위젯 -  태그 관리]
│   │   ├── stack_tag_manager.js        # 태그 관리 
│   │   ├── save_tag.php               # 태그 저장
│   │   ├── load_tags.php              # 태그 로드
│   │   ├── delete_tag.php             # 태그 삭제
│   │   ├── update_tag_order.php       # 태그 순서 업데이트
│   │   │
│   │   ├── [SIN/PULSE 위젯 - 북마크 관리]
│   │   ├── add_bookmark.php           # 북마크 추가
│   │   ├── delete_bookmark.php        # 북마크 삭제
│   │   ├── get_bookmark.php           # 북마크 조회
│   │   ├── update_bookmark.php        # 북마크 수정
│   │   ├── save_bookmark_data.php     # 북마크(북마크-항목 매핑)를 데이터베이스 저장
│   │   ├── copyFileForBookmark.php    # 실제 파일을 북마크 디렉토리에 복사
│   │
│   │   ├── [유닛 컨트롤 위젯]
│   │   ├── unitControl.js             # 유닛 제어 UI
│   │   ├── unitControl_redis.php      # Redis 데이터 처리
│   │   ├── search_updateEIS.js        # EIS 데이터 업데이트
│   │   ├── get_latest_data.php        # 최신 데이터 조회
│   │   │
│   │   ├── [AVHA 전료/전압/수소/공기 현황 위젯]
│   │   ├── AVHA_state.js              # 전류/전압/수소/공기 상태
│   │   ├── get_AVHA_value.php         # AVHA 값 조회
│   │   │
│   │   ├── [기타]
│   │   ├── stack_diagnosis_log.js      # 진단 로그 위젯
│   │   ├── stack_stack_diagnosis.js    # 스택 진단 위젯
│   │   ├── get_bop_date_on_search.php    # BOP-STACK 페이지 연동
│   │   ├── stack_dataManager.js        # 진단로그 및 스택진단 데이터 관리
│   │   ├── stack_eventManager.js       # 스택 이벤트 처리
│   │   ├── color_map.php             # 색상 맵 조회
│   │
│   ├── **aitraining**                         # aitraining.html  관련 모듈
│   │   │
│   │   ├── ai_dataManager.js          # AI 데이터 관리
│   │   ├── ai_eventManager.js         # AI 이벤트 관리
│   │   ├── get_model_data.php         # 모델 데이터 조회
│   │   ├── get_progress.php           # 진행상태 조회
│   │   ├── fault_label_list.js        # 학습 모델 검증 - 고장 라벨링 리스트
│   │   ├── faultDiagnosisData.php     # 고장 진단 데이터
│   │   ├── get_fault_label_list.php   # 고장 레이블 조회
│   │   ├── hw_sensor_table_list.js    # HW 센서 테이블
│   │   ├── sensorList.js              # 고장 진단 리스트, 로스프 센서 리스트
│   │   ├── get_hw_sensor_table_list.php # 센서 테이블 조회
│   │   ├── check_file_exists.php      # 파일 존재 확인
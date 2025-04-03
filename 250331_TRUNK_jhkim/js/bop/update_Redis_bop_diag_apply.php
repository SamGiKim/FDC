<?php
// update_Redis_bop_diag_apply.php BOP 진단 적용의 모델 클릭시 
// Redis 키값 업데이트 (stkId_model_apply 형식으로 저장)

require_once '../config/redis_config.php'; // Redis 연결 설정 파일 포함

// 새로운 응답 배열 생성
$response = [
    'success' => false,
    'message' => '',
    'error' => null
];

// 필수 요소가 전달되지 않은 경우 에러 응답
if (!isset($_GET['modelName']) ||
    !isset($_GET['powerplant_id'])||
    !isset($_GET['group_id'])||
    !isset($_GET['fuelcell_id'])) {
    $response['message'] = '필수 변수 누락되었습니다';
    $response['error'] = 'Missing parameters';
} else {
    $modelName = $_GET['modelName']; // modelName을 가져옴
    $powerplant_id = $_GET['powerplant_id'];
    $group_id = $_GET['group_id'];
    $fuelcell_id = $_GET['fuelcell_id'];
        
    // Redis 키 생성 - 새로운 형식으로 변경
    $redisKey = "{$powerplant_id}_{$fuelcell_id}_model_apply";

    try {
        // Redis에 모델 이름 저장
        $redis->set($redisKey, $modelName); // fuelcellId_model_apply 형식으로 저장
        $response['success'] = true;
        $response['message'] = '모델이 Redis에 저장되었습니다.';
    } catch (Exception $e) {
        $response['message'] = 'Redis 오류: ' . $e->getMessage();
        $response['error'] = 'Redis error';
    }
}

// 이전 출력 버퍼 지움 : 현재 버퍼에 저장된 내용 삭제(출력 버퍼에 불필요한 데이터 있을 때, 예외 발생 시)
// 이후 header()와 echo를 사용하여 클린한 JSON 응답 보낼 수 있음
ob_clean();

// JSON 응답 출력

// header 함수를 echo 직전으로 이동시켜서 
// 1. 출력 버퍼 제어 2. 오류 방지 3. 유연성 4. ob_clean 사용하고 있기 때문에 새롭게 헤더 설정하고 새로운 내용 출력하는것이 안전
header('Content-Type: application/json');
echo json_encode($response);
exit; // header와 echo를 호출하여 JSON 응답을 클라이언트에 보내고 이후의 코드 실행 막기위해 사용
?>
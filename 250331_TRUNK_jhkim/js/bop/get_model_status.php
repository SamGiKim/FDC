<?php
header('Content-Type: application/json');

// CORS 헤더 설정 (필요한 경우)
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

// GET 파라미터 검증
$powerplant_id = isset($_GET['powerplant_id']) ? $_GET['powerplant_id'] : null;
$fuelcell_id = isset($_GET['fuelcell_id']) ? $_GET['fuelcell_id'] : null;

if (!$powerplant_id || !$fuelcell_id) {
    echo json_encode([
        'success' => false,
        'message' => '필수 파라미터가 누락되었습니다',
        'status' => 'false'
    ]);
    exit;
}

// Redis 키 설정
$key = "{$powerplant_id}_{$fuelcell_id}_model_status";

// Redis 연결 및 데이터 가져오기
$redis = new Redis();
$response = [
    'error' => null,
    'status' => 'false'
];

try {
    // Redis에 연결
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);

    // Redis에서 데이터 가져오기
    $value = $redis->get($key);

    if ($value !== false) {
        $response['status'] = $value;
    }
} catch (Exception $e) {
    $response['error'] = 'Redis 연결 오류: ' . $e->getMessage();
}

echo json_encode($response);
?>
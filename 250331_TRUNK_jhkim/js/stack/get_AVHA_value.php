<?php
header('Content-Type: application/json');

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

// POST 데이터 받기
$input = json_decode(file_get_contents('php://input'), true);
$powerplant_id = $input['powerplant_id'] ?? null;
$fuelcell_id = $input['fuelcell_id'] ?? null;

if (!$powerplant_id || !$fuelcell_id) {
    echo json_encode([
        'success' => false,
        'message' => '필수 파라미터가 누락되었습니다.'
    ]);
    exit;
}

// Redis 키 생성 (예: SE01_F001_stm_web)
$key = $powerplant_id . '_' . $fuelcell_id . '_stm_web';

// Redis 연결 및 데이터 가져오기
$redis = new Redis();
$response = [
    'success' => false,
    'data' => null,
    'message' => ''
];

try {
    // Redis에 연결
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);

    // Redis에서 데이터 가져오기
    $value = $redis->get($key);

    if ($value === false) {
        throw new Exception('데이터를 찾을 수 없습니다.');
    }

    // JSON 문자열을 배열로 디코딩
    $decodedValue = json_decode($value, true);
    if ($decodedValue === null) {
        throw new Exception('잘못된 JSON 데이터입니다.');
    }

    $response['success'] = true;
    $response['data'] = $decodedValue;
    
} catch (Exception $e) {
    $response['message'] = '데이터 조회 중 오류가 발생했습니다: ' . $e->getMessage();
} finally {
    if ($redis) {
        $redis->close();
    }
}

echo json_encode($response);
?>
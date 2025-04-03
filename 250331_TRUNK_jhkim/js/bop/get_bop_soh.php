<?php
// CORS 허용 설정
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json; charset=UTF-8");

// 에러 핸들링 설정
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Redis 연결 설정
$redis = new Redis();
try {
    $redis->connect('127.0.0.1', 6379);
} catch (Exception $e) {
    echo json_encode([
        'error' => 'Redis 연결 실패: ' . $e->getMessage()
    ]);
    exit;
}

// 요청 파라미터 검증
if (!isset($_GET['powerplantId']) || !isset($_GET['fuelcellId'])) {
    echo json_encode([
        'error' => '필수 파라미터 누락: powerplantId와 fuelcellId가 필요합니다.'
    ]);
    exit;
}

$powerplantId = $_GET['powerplantId'];
$fuelcellId = $_GET['fuelcellId'];

// Redis 키 구성
$redisKey = "{$powerplantId}_{$fuelcellId}_bop_soh";

// Redis에서 데이터 조회
try {
    $data = $redis->get($redisKey);
    
    if ($data === false) {
        echo json_encode([
            'error' => '데이터가 없습니다.',
            'key' => $redisKey
        ]);
    } else {
        echo json_encode([
            'success' => true,
            'data' => $data
        ]);
    }
} catch (Exception $e) {
    echo json_encode([
        'error' => 'Redis 데이터 조회 실패: ' . $e->getMessage(),
        'key' => $redisKey
    ]);
}

// Redis 연결 종료
$redis->close();
?>
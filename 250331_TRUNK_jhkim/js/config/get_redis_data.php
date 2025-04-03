<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

try {
    if (!isset($_GET['key'])) {
        throw new Exception('Redis key가 필요합니다');
    }

    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);  // 데이터베이스 1 선택

    $key = $_GET['key'];
    $data = $redis->get($key);

    if ($data === false) {
        throw new Exception('Redis 데이터를 찾을 수 없습니다');
    }

    // JSON 데이터 디코딩 후 다시 인코딩 (유효성 검사)
    $decoded = json_decode($data, true);
    if ($decoded === null) {
        throw new Exception('유효하지 않은 JSON 데이터');
    }

    echo $data;  // 원본 JSON 문자열 반환

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
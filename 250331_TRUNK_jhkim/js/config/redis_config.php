<?php
// 기존 CORS 설정 유지
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// 기존 OPTIONS 요청 처리 유지
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

    exit(0);
}

$redis = new Redis();
header('Content-Type: application/json');

try {
    // Redis 연결
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);

    if (!isset($_GET['section'])) {
        throw new Exception('No section specified');
    }

    $section = $_GET['section'];
    error_log("Requested section: " . $section);  // 디버깅용
    
    $value = $redis->get($section);
    
    if ($value === false) {
        echo json_encode([
            'directory_accessible' => true,
            'redis_connection' => true,
            'error' => 'Section not found',
            'requested_section' => $section
        ]);
        exit;
    }

    // 데이터가 있는 경우 그대로 반환
    $decoded_value = json_decode($value, true);
    if ($decoded_value === null && json_last_error() !== JSON_ERROR_NONE) {
        echo json_encode([
            'directory_accessible' => true,
            'redis_connection' => true,
            'data' => ['section' => $section, 'value' => $value]
        ]);
    } else {
        echo json_encode([
            'directory_accessible' => true,
            'redis_connection' => true,
            'data' => ['section' => $section, 'value' => $decoded_value]
        ]);
    }

} catch (Exception $e) {
    error_log("Redis error: " . $e->getMessage());
    echo json_encode([
        'directory_accessible' => true,
        'redis_connection' => false,
        'error' => $e->getMessage()
    ]);
}
?>
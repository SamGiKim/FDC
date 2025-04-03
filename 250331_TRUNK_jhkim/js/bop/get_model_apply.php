<?php
// 캐시 방지를 위한 헤더 추가
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');
header('Cache-Control: post-check=0, pre-check=0', false);
header('Pragma: no-cache');
header('Content-Type: application/json');

header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

// 요청 파라미터 로깅
error_log("Received parameters: " . print_r($_GET, true));

// CORS 설정
if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
}

try {
    $plant = isset($_GET['plant']) ? $_GET['plant'] : null;
    $fuelcell = isset($_GET['fuelcell']) ? $_GET['fuelcell'] : null;

    if (!$plant || !$fuelcell) {
        echo json_encode(['data' => null]);
        exit;
    }

    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);

    $key = "{$plant}_{$fuelcell}_model_apply";
    
    if (!$redis->exists($key)) {
        echo json_encode(['data' => null]);
        exit;
    }

    $value = $redis->get($key);
    echo json_encode(['data' => $value]);

} catch (Exception $e) {
    error_log("Error in get_model_apply.php: " . $e->getMessage());
    echo json_encode(['data' => null]);
}
?>
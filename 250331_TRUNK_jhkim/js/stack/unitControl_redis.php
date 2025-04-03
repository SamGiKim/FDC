<?php
// unitControlRedis.php

if (isset($_SERVER['HTTP_ORIGIN'])) {
    header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
    header('Access-Control-Allow-Credentials: true');
    header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
        header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
    
    if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
        header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    
    exit(0);
}

header('Content-Type: application/json');

require_once '../config/config.php';
require_once '../config/db_config.php';

$redis = new Redis();
$response = ['success' => false, 'data' => null];

try {
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);
    
    if (isset($_GET['key'])) {
        $key = $_GET['key'];
        $data = $redis->get($key);
        
        if ($data !== false) {
            // fdu_uploaded 키인 경우 타임스탬프 값만 반환
            if (strpos($key, 'fdu_uploaded') !== false) {
                $response['success'] = true;
                $response['data'] = $data;  // 타임스탬프 값
            } 
            // fdu_prg 키인 경우 전체 데이터 반환
            else {
                $response['success'] = true;
                $response['data'] = $data;  // Gateway 상태 데이터
            }
        } else {
            $response['message'] = '데이터가 없습니다.';
        }
    } else {
        $response['message'] = 'Redis 키가 제공되지 않았습니다.';
    }
} catch (Exception $e) {
    $response['message'] = 'Redis 오류: ' . $e->getMessage();
}

echo json_encode($response);
?>
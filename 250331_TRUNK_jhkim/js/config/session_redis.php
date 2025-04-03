<?php
header('Content-Type: application/json');
header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
header('Access-Control-Allow-Credentials: true');

$response = [
    'redis_connection' => false,
    'error' => null,
    'session_data' => null
];

try {
    $redis = new Redis();
    $redis->connect('127.0.0.1', 6379);
    $redis->select(1);  // 세션 데이터베이스 선택
    $response['redis_connection'] = true;

    if (isset($_GET['session_hash'])) {
        $sessionKey = 'session:' . $_GET['session_hash'];
        $sessionData = $redis->get($sessionKey);
        
        if ($sessionData !== false) {
            // 세션 데이터가 JSON 형식인지 확인
            $decodedData = json_decode($sessionData, true);
            if ($decodedData !== null) {
                $response['session_data'] = $decodedData;
            } else {
                $response['error'] = 'Invalid session data format';
            }
        } else {
            $response['error'] = 'Session not found';
        }
    } else {
        $response['error'] = 'No session hash provided';
    }

} catch (Exception $e) {
    $response['error'] = 'Redis connection error: ' . $e->getMessage();
}

echo json_encode($response);
?>
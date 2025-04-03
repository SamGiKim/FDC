<?php
header('Content-Type: application/json');

require_once '../config/config.php';
require_once '../config/db_config.php';

$response = [
    'success' => false,
    'data' => null,
    'message' => ''
];

try {
    // GET으로 전달된 fuelcell 파라미터 확인
    $fuelcell = isset($_GET['fuelcell']) ? $_GET['fuelcell'] : null;
    
    if (!$fuelcell) {
        throw new Exception('연료전지 ID가 필요합니다.');
    }

    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // fuelcell ID로 필터링하여 가장 최근 데이터 가져오기
    $query = "SELECT * FROM search WHERE fuelcell = :fuelcell ORDER BY NO DESC LIMIT 1";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':fuelcell', $fuelcell, PDO::PARAM_STR);
    $stmt->execute();
    $latestData = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($latestData) {
        $response['success'] = true;
        $response['data'] = $latestData;
    } else {
        $response['message'] = '해당 연료전지의 데이터가 없습니다.';
    }
} catch (Exception $e) {
    $response['message'] = '오류: ' . $e->getMessage();
} catch (PDOException $e) {
    $response['message'] = '데이터베이스 오류: ' . $e->getMessage();
}

echo json_encode($response);
?>
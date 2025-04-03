<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';  // $host, $dbname, $username, $password 변수들
session_start();

header('Content-Type: application/json');

try {
    if (!isset($_GET['powerplant_id'])) {
        throw new Exception('발전소 ID가 필요합니다');
    }

    $powerplantId = $_GET['powerplant_id'];
    
    // 직접 DB 연결
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT time, group_id, fuelcell_id, comment, status 
            FROM api_alarmlog 
            WHERE powerplant_id = :powerplant_id 
            ORDER BY time DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':powerplant_id', $powerplantId, PDO::PARAM_STR);
    $stmt->execute();
    
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($result);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
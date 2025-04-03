<?php
require_once 'config.php';  // $host, $dbname, $username, $password 변수들
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

    $sql = "SELECT powerplant_name 
            FROM powerplants 
            WHERE powerplant_id = :powerplant_id";

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':powerplant_id', $powerplantId, PDO::PARAM_STR);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode($result);
    } else {
        throw new Exception('발전소를 찾을 수 없습니다');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
<?php
//get_normal_data.php
header('Content-Type: application/json');
ini_set('display_errors', 0);
error_reporting(0);

require_once '../config/config.php';
require_once '../config/db_config.php';

$powerplant_id = isset($_GET['powerplant_id']) ? $_GET['powerplant_id']: null;
$fuelcell_id = isset($_GET['fuelcell_id']) ? $_GET['fuelcell_id'] : null;

if(!$powerplant_id || !$fuelcell_id){
    echo json_encode([
        'success' => false,
        'message' => '발전소 ID와 연료전지 ID가 모두 필요합니다.'
    ]);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "SELECT * FROM api_normaldata 
                WHERE powerplant_id = :powerplant_id
                AND fuelcell_id = :fuelcell_id 
                ORDER BY start_time DESC";

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':powerplant_id' => $powerplant_id,        
        ':fuelcell_id' => $fuelcell_id,
    ]);

    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode(['success' => true, 'data' => $data]);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '오류 발생: ' . $e->getMessage()]);
}
?>
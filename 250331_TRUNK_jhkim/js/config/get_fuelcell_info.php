<?php
require_once './config.php';
require_once './db_config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['powerplant_id']) || !isset($_GET['fuelcell_id'])) {
        throw new Exception('필수 파라미터가 누락되었습니다');
    }

    $powerplantId = $_GET['powerplant_id'];
    $fuelcellId = $_GET['fuelcell_id'];
    
    $stmt = $conn->prepare("SELECT fuelcell_name FROM fuelcells WHERE powerplant_id = ? AND fuelcell_id = ?");
    $stmt->execute([$powerplantId, $fuelcellId]);
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'fuelcell_name' => $result['fuelcell_name']
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
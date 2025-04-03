<?php
require_once './config.php';
require_once './db_config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['powerplant_id']) || !isset($_GET['group_id'])) {
        throw new Exception('필수 파라미터가 누락되었습니다');
    }

    $powerplantId = $_GET['powerplant_id'];
    $groupId = $_GET['group_id'];
    
    $stmt = $conn->prepare("SELECT group_name FROM fuelcell_groups WHERE powerplant_id = ? AND group_id = ?");
    $stmt->execute([$powerplantId, $groupId]);
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode([
        'success' => true,
        'group_name' => $result['group_name']
    ]);

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';  // Redis 업데이트 추가

header('Content-Type: application/json');

// POST 데이터 받기
$json = file_get_contents('php://input');
$data = json_decode($json, true);
$powerplant_id = $data['powerplant_id'];

try {
    $pdo->beginTransaction();

    // 1. 발전소에 연결된 연료전지가 있는지 확인
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM fuelcells WHERE powerplant_id = :powerplant_id");
    $stmt->execute([':powerplant_id' => $powerplant_id]);
    $fuelcellCount = $stmt->fetchColumn();

    if ($fuelcellCount > 0) {
        echo json_encode([
            'success' => false,
            'error' => "이 발전소에 연결된 연료전지가 {$fuelcellCount}개 있습니다. 먼저 연료전지를 삭제하거나 이동한 후에 발전소를 삭제해주세요."
        ]);
        $pdo->rollBack();
        exit;
    }

    // 2. user_powerplants 테이블에서 관련 레코드 삭제
    $stmt = $pdo->prepare("DELETE FROM user_powerplants WHERE powerplant_id = :powerplant_id");
    $stmt->execute([':powerplant_id' => $powerplant_id]);

    // 3. 발전소 삭제
    $stmt = $pdo->prepare("DELETE FROM powerplants WHERE powerplant_id = :powerplant_id");
    $stmt->execute([':powerplant_id' => $powerplant_id]);

    // Redis 업데이트 - 발전소가 삭제되기 전에 마지막으로 업데이트
    updateAdminRedisTimestamp($powerplant_id);

    $pdo->commit();
    
    echo json_encode([
        'success' => true,
        'message' => "발전소가 성공적으로 삭제되었습니다."
    ]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
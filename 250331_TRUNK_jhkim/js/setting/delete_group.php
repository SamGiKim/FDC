<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$group_id = $data['group_id'] ?? null;

if (!$group_id) {
    echo json_encode(["success" => false, "error" => "그룹 ID가 제공되지 않았습니다."]);
    exit;
}

try {
    // 삭제 전에 powerplant_id 조회
    $stmt = $pdo->prepare("SELECT powerplant_id FROM fuelcell_groups WHERE group_id = :group_id");
    $stmt->execute([':group_id' => $group_id]);
    $powerplant_id = $stmt->fetchColumn();

    $pdo->beginTransaction();

    // 그룹 ID 확인
    $stmt = $pdo->prepare("SELECT id FROM fuelcell_groups WHERE group_id = :group_id");
    $stmt->execute([':group_id' => $group_id]);
    $id = $stmt->fetchColumn();

    if (!$id) {
        $pdo->rollBack();
        echo json_encode(["success" => false, "error" => "해당 ID의 그룹이 존재하지 않습니다."]);
        exit;
    }

    // 연료전지 그룹 연결 해제 (fuelcells 테이블의 group_id 업데이트)
    $stmt = $pdo->prepare("UPDATE fuelcells SET group_id = NULL WHERE group_id = :group_id");
    $stmt->execute([':group_id' => $group_id]);

    // user_groups에서 해당 그룹과 관련된 데이터 삭제
    $stmt = $pdo->prepare("DELETE FROM user_groups WHERE group_id = :group_id");
    $stmt->execute([':group_id' => $group_id]);

    // fuelcell_groups에서 해당 그룹 삭제
    $stmt = $pdo->prepare("DELETE FROM fuelcell_groups WHERE group_id = :group_id");
    $stmt->execute([':group_id' => $group_id]);

    // 발전소의 용량 업데이트 (연료전지 연결이 해제되었으므로)
    if ($powerplant_id) {
        $stmt = $pdo->prepare("
            UPDATE powerplants p
            SET fuelcell_count = (
                SELECT COUNT(*) FROM fuelcells f WHERE f.powerplant_id = p.powerplant_id
            ),
            total_e_capacity = (
                SELECT COALESCE(SUM(e_capacity), 0) FROM fuelcells f WHERE f.powerplant_id = p.powerplant_id
            ),
            total_t_capacity = (
                SELECT COALESCE(SUM(t_capacity), 0) FROM fuelcells f WHERE f.powerplant_id = p.powerplant_id
            )
            WHERE p.powerplant_id = :powerplant_id
        ");
        $stmt->execute([':powerplant_id' => $powerplant_id]);
    }

    $pdo->commit();

    // Redis 업데이트
    if ($powerplant_id) {
        updateAdminRedisTimestamp($powerplant_id);
    }

    echo json_encode([
        "success" => true,
        "message" => "그룹이 성공적으로 삭제되었습니다."
    ]);
    
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("데이터 삭제 오류: " . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "error" => "데이터를 삭제하는 동안 오류가 발생했습니다: " . $e->getMessage()
    ]);
}
?>
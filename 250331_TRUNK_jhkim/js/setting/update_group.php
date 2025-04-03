<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['group_id']) || !isset($data['group_name'])) {
    echo json_encode([
        "success" => false,
        "error" => "필수 필드가 누락되었습니다."
    ]);
    exit;
}

try {
    // 먼저 해당 그룹의 powerplant_id를 조회
    $stmt = $pdo->prepare("SELECT powerplant_id FROM fuelcell_groups WHERE group_id = :group_id");
    $stmt->execute([':group_id' => $data['group_id']]);
    $powerplant_id = $stmt->fetchColumn();

    $pdo->beginTransaction();

    // 기본 그룹 정보 업데이트
    $stmt = $pdo->prepare("
        UPDATE fuelcell_groups 
        SET 
            group_name = :group_name,
            reg_date = :reg_date,
            description = :description
        WHERE group_id = :group_id
    ");

    $stmt->execute([
        ':group_id' => $data['group_id'],
        ':group_name' => $data['group_name'],
        ':reg_date' => $data['reg_date'],
        ':description' => $data['description']
    ]);

    // 그룹의 용량 업데이트
    $stmt = $pdo->prepare("
        UPDATE fuelcell_groups g
        SET e_group_capacity = (
            SELECT COALESCE(SUM(e_capacity), 0) 
            FROM fuelcells f 
            WHERE f.group_id = g.group_id
        ),
        t_group_capacity = (
            SELECT COALESCE(SUM(t_capacity), 0) 
            FROM fuelcells f 
            WHERE f.group_id = g.group_id
        )
        WHERE g.group_id = :group_id
    ");
    $stmt->execute([':group_id' => $data['group_id']]);

    // 발전소의 용량도 업데이트
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
    
    echo json_encode(["success" => true, "message" => "그룹이 성공적으로 업데이트되었습니다."]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        "success" => false,
        "error" => "그룹 수정 중 오류가 발생했습니다: " . $e->getMessage()
    ]);
}
?>
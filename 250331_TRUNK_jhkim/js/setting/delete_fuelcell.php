<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$fuelcell_id = $data['fuelcell_id'] ?? null;

if (!$fuelcell_id) {
    echo json_encode(["error" => "연료전지 ID가 제공되지 않았습니다."]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 삭제 전에 powerplant_id와 group_id 조회
    $stmt = $pdo->prepare("SELECT powerplant_id, group_id FROM fuelcells WHERE fuelcell_id = :fuelcell_id");
    $stmt->execute([':fuelcell_id' => $fuelcell_id]);
    $info = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$info) {
        echo json_encode(["error" => "해당 ID의 연료전지가 존재하지 않습니다."]);
        $pdo->rollBack();
        exit;
    }

    // fuelcells에서 해당 연료전지 삭제
    $stmt = $pdo->prepare("DELETE FROM fuelcells WHERE fuelcell_id = :fuelcell_id");
    $stmt->execute([':fuelcell_id' => $fuelcell_id]);

    // 발전소의 용량 업데이트
    if ($info['powerplant_id']) {
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
        $stmt->execute([':powerplant_id' => $info['powerplant_id']]);
    }

    // 그룹의 용량 업데이트
    if ($info['group_id']) {
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
        $stmt->execute([':group_id' => $info['group_id']]);
    }

    $pdo->commit();

    // Redis 업데이트
    if ($info['powerplant_id']) {
        updateAdminRedisTimestamp($info['powerplant_id']);
    }

    echo json_encode(["success" => true]);
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("데이터 삭제 오류: " . $e->getMessage());
    echo json_encode(["error" => "데이터를 삭제하는 동안 오류가 발생했습니다."]);
}
?>
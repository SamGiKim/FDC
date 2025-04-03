<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';

header('Content-Type: application/json');

try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
    }

    // 필수 필드 확인
    $group_id = $data['group_id'] ?? null;
    $group_name = $data['group_name'] ?? null;
    $reg_date = !empty($data['reg_date']) ? $data['reg_date'] : date('Y-m-d');
    $description = $data['description'] ?? null;
    $powerplant_id = $data['powerplant_id'] ?? null;
    $e_group_capacity = $data['e_group_capacity'] ?? 0;
    $t_group_capacity = $data['t_group_capacity'] ?? 0;

    if (!$group_id || !$group_name) {
        throw new Exception('그룹 ID와 그룹 이름은 필수입니다.');
    }

    // 그룹 ID 중복 체크
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM fuelcell_groups WHERE group_id = :group_id");
    $stmt->bindParam(':group_id', $group_id);
    $stmt->execute();
    
    if ($stmt->fetchColumn() > 0) {
        throw new Exception('이미 존재하는 그룹 ID입니다.');
    }

    $pdo->beginTransaction();

    // fuelcell_groups 테이블에 데이터 삽입
    $stmt = $pdo->prepare("INSERT INTO fuelcell_groups 
                          (group_id, group_name, powerplant_id, reg_date, e_group_capacity, t_group_capacity, description) 
                          VALUES 
                          (:group_id, :group_name, :powerplant_id, :reg_date, :e_group_capacity, :t_group_capacity, :description)");
    
    $stmt->bindParam(':group_id', $group_id);
    $stmt->bindParam(':group_name', $group_name);
    $stmt->bindParam(':powerplant_id', $powerplant_id);
    $stmt->bindParam(':reg_date', $reg_date);
    $stmt->bindParam(':e_group_capacity', $e_group_capacity);
    $stmt->bindParam(':t_group_capacity', $t_group_capacity);
    $stmt->bindParam(':description', $description);
    
    $stmt->execute();

    // 연료전지 그룹에 속한 연료전지들의 group_id 업데이트
    if (!empty($data['fuelcell_ids'])) {
        $stmt = $pdo->prepare("UPDATE fuelcells 
                              SET group_id = :group_id 
                              WHERE fuelcell_id = :fuelcell_id");

        foreach ($data['fuelcell_ids'] as $fuelcell_id) {
            $stmt->bindParam(':group_id', $group_id);
            $stmt->bindParam(':fuelcell_id', $fuelcell_id);
            $stmt->execute();
        }

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
        $stmt->execute([':group_id' => $group_id]);

        // 발전소의 용량도 업데이트 (연료전지가 이동했으므로)
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
    }

    // 사용자-그룹 연결 처리 (필요한 경우)
    if (!empty($data['account_ids'])) {
        $stmt = $pdo->prepare("INSERT INTO user_groups (account_id, group_id) 
                              VALUES (:account_id, :group_id)");

        foreach ($data['account_ids'] as $account_id) {
            $stmt->bindParam(':account_id', $account_id);
            $stmt->bindParam(':group_id', $group_id);
            $stmt->execute();
        }
    }

    $pdo->commit();

    // Redis 업데이트
    if ($powerplant_id) {
        updateAdminRedisTimestamp($powerplant_id);
    }
    
    echo json_encode(['success' => true, 'message' => '그룹이 성공적으로 생성되었습니다.']);

} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode([
        'success' => false, 
        'error' => '데이터베이스 오류가 발생했습니다.'
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
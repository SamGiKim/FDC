<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';

header('Content-Type: application/json');

try {
    // POST 데이터 받기
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (!isset($data['group_id']) || !isset($data['fuelcell_ids']) || !is_array($data['fuelcell_ids'])) {
        throw new Exception('필수 데이터가 누락되었습니다.');
    }

    $group_id = $data['group_id'];
    $fuelcell_ids = $data['fuelcell_ids'];

    // 그룹의 발전소 ID 조회
    $stmt = $pdo->prepare("SELECT powerplant_id FROM fuelcell_groups WHERE group_id = ?");
    $stmt->execute([$group_id]);
    $powerplant_id = $stmt->fetchColumn();

    // 트랜잭션 시작
    $pdo->beginTransaction();

    try {
        // 1. 해당 그룹의 기존 연결 모두 제거
        $stmt = $pdo->prepare("UPDATE fuelcells SET group_id = NULL WHERE group_id = ?");
        $stmt->execute([$group_id]);

        // 2. 선택된 연료전지들을 해당 그룹에 연결
        $stmt = $pdo->prepare("UPDATE fuelcells SET group_id = ? WHERE fuelcell_id = ?");
        foreach ($fuelcell_ids as $fuelcell_id) {
            $stmt->execute([$group_id, $fuelcell_id]);
        }

        // 3. 그룹의 용량 합계 업데이트
        $stmt = $pdo->prepare("
            UPDATE fuelcell_groups fg
            SET 
                e_group_capacity = (
                    SELECT COALESCE(SUM(e_capacity), 0)
                    FROM fuelcells
                    WHERE group_id = ?
                ),
                t_group_capacity = (
                    SELECT COALESCE(SUM(t_capacity), 0)
                    FROM fuelcells
                    WHERE group_id = ?
                )
            WHERE group_id = ?
        ");
        $stmt->execute([$group_id, $group_id, $group_id]);

        // 4. 발전소의 용량도 업데이트
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

        // 트랜잭션 커밋
        $pdo->commit();

        // Redis 업데이트
        if ($powerplant_id) {
            updateAdminRedisTimestamp($powerplant_id);
        }

        echo json_encode([
            'success' => true,
            'message' => '연료전지 그룹 연결이 성공적으로 완료되었습니다.'
        ]);

    } catch (Exception $e) {
        // 문제 발생 시 롤백
        $pdo->rollBack();
        throw $e;
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
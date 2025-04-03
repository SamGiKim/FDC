<?php
   ini_set('display_errors', 1);
   ini_set('display_startup_errors', 1);
   error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';  // Redis 업데이트 추가

header('Content-Type: application/json; charset=utf-8');


try {
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
    }

    $powerplant_id = $data['powerplant_id'] ?? null;
    $powerplant_name = $data['powerplant_name'] ?? null;
    $address = $data['address'] ?? null;
    $reg_date = $data['reg_date'] ?? null;

    if (!$powerplant_id || !$powerplant_name) {
        throw new Exception('발전소 ID와 발전소 이름은 필수입니다.');
    }

    $pdo->beginTransaction();

    // UPDATE만 실행
    $stmt = $pdo->prepare("
        UPDATE powerplants 
        SET powerplant_name = :powerplant_name, 
            address = :address, 
            reg_date = :reg_date
        WHERE powerplant_id = :powerplant_id
    ");

    $stmt->bindParam(':powerplant_id', $powerplant_id);
    $stmt->bindParam(':powerplant_name', $powerplant_name);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':reg_date', $reg_date);

    if (!$stmt->execute()) {
        throw new Exception('데이터 수정 실패');
    }

    // 수정된 행이 있는지 확인
    if ($stmt->rowCount() === 0) {
        throw new Exception('해당 발전소를 찾을 수 없습니다.');
    }

    // fuelcell_count 등 업데이트 (기존 코드 유지)
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

    $pdo->commit();

    // Redis 업데이트
    $redis_result = updateAdminRedisTimestamp($powerplant_id);

    echo json_encode(['success' => true]);

} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
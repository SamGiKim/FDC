<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';  // Redis 업데이트 추가

header('Content-Type: application/json');

$options = ""; // $options 변수 유지

try {
    // 발전소 데이터를 가져오기
    $stmt = $pdo->prepare("SELECT powerplant_name FROM powerplants");
    $stmt->execute();
    $powerplants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 발전소 데이터를 HTML 옵션으로 변환
    foreach ($powerplants as $powerplant) {
        $options .= "<option value='{$powerplant['powerplant_name']}'>{$powerplant['powerplant_name']}</option>";
    }

    // JSON 형식의 데이터를 가져오기
    $data = json_decode(file_get_contents('php://input'), true);

    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
    }

    $fuelcell_id = $data['fuelcell_id'] ?? null;
    $fuelcell_name = $data['fuelcell_name'] ?? null;
    $address = $data['address'] ?? null;
    $install_date = !empty($data['install_date']) ? $data['install_date'] : null;
    $reg_date = !empty($data['reg_date']) ? $data['reg_date'] : null;
    $powerplant_id = $data['powerplant_id'] ?? null;
    $e_capacity = !empty($data['e_capacity']) ? $data['e_capacity'] : null;
    $t_capacity = !empty($data['t_capacity']) ? $data['t_capacity'] : null;

    if (!$fuelcell_id || !$fuelcell_name) {
        throw new Exception('연료전지 ID와 연료전지 이름은 필수입니다.');
    }

    if (!$powerplant_id) {
        throw new Exception('발전소 ID는 필수입니다.');
    }

    $pdo->beginTransaction();

    // 중복된 연료전지 ID 확인
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM fuelcells WHERE fuelcell_id = :fuelcell_id");
    $stmt->bindParam(':fuelcell_id', $fuelcell_id);
    $stmt->execute();
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        throw new Exception('중복된 연료전지 ID입니다.');
    }

    // PDO를 사용하여 데이터베이스 연결
    $stmt = $pdo->prepare("INSERT INTO fuelcells (fuelcell_id, fuelcell_name, address, install_date, reg_date, powerplant_id, e_capacity, t_capacity) VALUES (:fuelcell_id, :fuelcell_name, :address, :install_date, :reg_date, :powerplant_id, :e_capacity, :t_capacity)");
    $stmt->bindParam(':fuelcell_id', $fuelcell_id);
    $stmt->bindParam(':fuelcell_name', $fuelcell_name);
    $stmt->bindParam(':address', $address);
    $stmt->bindParam(':install_date', $install_date);
    $stmt->bindParam(':reg_date', $reg_date);
    $stmt->bindParam(':powerplant_id', $powerplant_id);
    $stmt->bindParam(':e_capacity', $e_capacity);
    $stmt->bindParam(':t_capacity', $t_capacity);

    if ($stmt->execute()) {
        // 발전소의 용량 업데이트
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

        // 그룹이 지정된 경우, 그룹의 용량도 업데이트
        if (!empty($data['group_id'])) {
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
        }

        $pdo->commit();
        
        // Redis 업데이트 추가
        updateAdminRedisTimestamp($powerplant_id);
        
        echo json_encode(['success' => true, 'options' => $options]);
    } else {
        throw new Exception('데이터 삽입 실패');
    }
} catch (PDOException $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("데이터 삽입 오류: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => '데이터 삽입 오류가 발생했습니다.']);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    error_log("일반 오류: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
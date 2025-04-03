<?php
   ini_set('display_errors', 1);
   ini_set('display_startup_errors', 1);
   error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';  // Redis 업데이트 추가

header('Content-Type: application/json; charset=utf-8');

try {
    $input = file_get_contents('php://input');
    $data = json_decode($input, true);
    
    $debug_info = [
        'step1_raw_input' => $input,
        'step2_decoded_data' => $data,
        'step3_json_error' => json_last_error_msg()
    ];
    
    if (json_last_error() !== JSON_ERROR_NONE) {
        throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
    }

    $fuelcell_id = $data['fuelcell_id'] ?? null;
    $fuelcell_name = $data['fuelcell_name'] ?? null;
    $address = $data['address'] ?? null;
    $install_date = (!empty($data['install_date']) && $data['install_date'] !== '') ? $data['install_date'] : null;
    $reg_date = (!empty($data['reg_date']) && $data['reg_date'] !== '') ? $data['reg_date'] : null;
    $powerplant_id = $data['powerplant_id'] ?? null;
    $e_capacity = $data['e_capacity'] ?? null;
    $t_capacity = $data['t_capacity'] ?? null;

    $debug_info['step4_extracted_data'] = [
        'fuelcell_id' => $fuelcell_id,
        'fuelcell_name' => $fuelcell_name,
        'address' => $address,
        'install_date' => $install_date,
        'reg_date' => $reg_date,
        'powerplant_id' => $powerplant_id,
        'e_capacity' => $e_capacity,
        't_capacity' => $t_capacity
    ];

    if (!$fuelcell_id || !$fuelcell_name) {
        throw new Exception('연료전지 ID와 이름은 필수입니다.');
    }

    $pdo->beginTransaction();

    // 현재 데이터 확인
    $stmt = $pdo->prepare("SELECT powerplant_id, group_id FROM fuelcells WHERE fuelcell_id = :fuelcell_id");
    $stmt->execute([':fuelcell_id' => $fuelcell_id]);
    $current = $stmt->fetch(PDO::FETCH_ASSOC);
    
    $debug_info['step5_current_data'] = $current;

    if (!$current) {
        throw new Exception('해당 연료전지를 찾을 수 없습니다.');
    }

    $current_powerplant_id = $current['powerplant_id'];
    $current_group_id = $current['group_id'];

    // powerplant_id가 변경되었고, 새 값이 있다면 유효성 검사
    if ($powerplant_id !== $current_powerplant_id && $powerplant_id !== null) {
        $stmt = $pdo->prepare("SELECT COUNT(*) FROM powerplants WHERE powerplant_id = :powerplant_id");
        $stmt->execute([':powerplant_id' => $powerplant_id]);
        if ($stmt->fetchColumn() == 0) {
            throw new Exception('유효하지 않은 발전소 ID입니다: ' . $powerplant_id);
        }
    }

    // 기존 연료전지 정보 업데이트
    $stmt = $pdo->prepare("
    UPDATE fuelcells
    SET fuelcell_name = :fuelcell_name, 
        powerplant_id = :powerplant_id, 
        address = :address, 
        install_date = :install_date, 
        reg_date = :reg_date,
        e_capacity = :e_capacity, 
        t_capacity = :t_capacity,
        group_id = :group_id
    WHERE fuelcell_id = :fuelcell_id
   ");

    $stmt->bindValue(':fuelcell_id', $fuelcell_id);
    $stmt->bindValue(':fuelcell_name', $fuelcell_name);
    $stmt->bindValue(':powerplant_id', $powerplant_id);
    $stmt->bindValue(':address', $address);
    $stmt->bindValue(':install_date', $install_date);
    $stmt->bindValue(':reg_date', $reg_date);
    $stmt->bindValue(':e_capacity', $e_capacity);
    $stmt->bindValue(':t_capacity', $t_capacity);
    $stmt->bindValue(':group_id', $data['group_id'] ?? null);

    if (!$stmt->execute()) {
        throw new Exception('데이터 업데이트 실패: ' . implode(", ", $stmt->errorInfo()));
    }

    // powerplants 테이블 업데이트 (이전 발전소와 새 발전소 모두)
    $powerplant_ids_to_update = array_filter(array_unique([$current_powerplant_id, $powerplant_id]));
    foreach ($powerplant_ids_to_update as $pid) {
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
        $stmt->execute([':powerplant_id' => $pid]);
    }

    // 그룹 테이블 업데이트 (이전 그룹과 새 그룹 모두)
    $group_ids_to_update = array_filter(array_unique([$current_group_id, $data['group_id'] ?? null]));
    foreach ($group_ids_to_update as $gid) {
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
        $stmt->execute([':group_id' => $gid]);
    }

    $pdo->commit();
    
    // Redis 업데이트 - 이전 발전소와 새 발전소 모두 업데이트
    foreach ($powerplant_ids_to_update as $pid) {
        if ($pid) {  // null이 아닌 경우만 업데이트
            updateAdminRedisTimestamp($pid);
        }
    }

    echo json_encode([
        'success' => true,
        'debug_info' => $debug_info
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => '데이터베이스 오류: ' . $e->getMessage(),
        'trace' => $e->getTraceAsString() // 스택 트레이스도 포함
    ]);
} catch (Exception $e) {
    if ($pdo->inTransaction()) {
        $pdo->rollBack();
    }
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'debug_info' => $debug_info ?? null,
        'error_details' => [
            'message' => $e->getMessage(),
            'file' => $e->getFile(),
            'line' => $e->getLine(),
            'trace' => $e->getTraceAsString()
        ]
    ]);
}
?>
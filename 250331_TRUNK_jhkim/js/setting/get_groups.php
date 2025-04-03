<?php
require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

try {
    // GET 파라미터 가져오기
    $group_id = $_GET['group_id'] ?? null;
    $group_name = $_GET['group_name'] ?? null;
    $powerplant_name = $_GET['powerplant_name'] ?? null;
    $fuelcell_name = $_GET['fuelcell_name'] ?? null;

    // SQL 쿼리 작성
    $sql = "
    SELECT 
        g.group_id, 
        g.group_name, 
        g.reg_date, 
        g.e_group_capacity, 
        g.t_group_capacity,
        g.description,
        p.powerplant_id,
        p.powerplant_name,
        COUNT(DISTINCT f.id) as fuelcell_count,
        GROUP_CONCAT(DISTINCT f.fuelcell_id) as fuelcell_ids,
        GROUP_CONCAT(DISTINCT f.fuelcell_name ORDER BY f.fuelcell_name ASC SEPARATOR ', ') AS fuelcells,
        SUM(f.e_capacity) as total_e_capacity,
        SUM(f.t_capacity) as total_t_capacity
    FROM fuelcell_groups g
    LEFT JOIN fuelcells f ON g.group_id = f.group_id
    LEFT JOIN powerplants p ON f.powerplant_id = p.powerplant_id
    ";

    $conditions = [];

    if ($group_id) {
        $conditions[] = "g.group_id = :group_id";
    }

    if ($group_name) {
        $conditions[] = "g.group_name LIKE :group_name";
    }

    if ($powerplant_name) {
        $conditions[] = "p.powerplant_name LIKE :powerplant_name";
    }

    if ($fuelcell_name) {
        $conditions[] = "f.fuelcell_name LIKE :fuelcell_name";
    }

    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $sql .= " GROUP BY g.group_id, g.group_name, g.reg_date, g.e_group_capacity, g.t_group_capacity, g.description, p.powerplant_id, p.powerplant_name";
    $sql .= " ORDER BY g.reg_date DESC";

    $stmt = $pdo->prepare($sql);

    if ($group_id) {
        $stmt->bindParam(':group_id', $group_id, PDO::PARAM_STR);
    }

    if ($group_name) {
        $group_name = "%$group_name%";
        $stmt->bindParam(':group_name', $group_name, PDO::PARAM_STR);
    }

    if ($powerplant_name) {
        $powerplant_name = "%$powerplant_name%";
        $stmt->bindParam(':powerplant_name', $powerplant_name, PDO::PARAM_STR);
    }

    if ($fuelcell_name) {
        $fuelcell_name = "%$fuelcell_name%";
        $stmt->bindParam(':fuelcell_name', $fuelcell_name, PDO::PARAM_STR);
    }

    $stmt->execute();
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 데이터 가공
    foreach ($groups as &$group) {
        // fuelcell_ids를 배열로 변환
        $group['fuelcell_ids'] = $group['fuelcell_ids'] ? explode(',', $group['fuelcell_ids']) : [];
        
        // null 값 처리
        $group['description'] = $group['description'] ?? '';
        $group['powerplant_id'] = $group['powerplant_id'] ?? '';
        $group['powerplant_name'] = $group['powerplant_name'] ?? '';
        $group['fuelcell_count'] = intval($group['fuelcell_count']);
        $group['e_group_capacity'] = floatval($group['e_group_capacity']);
        $group['t_group_capacity'] = floatval($group['t_group_capacity']);
    }

    echo json_encode([
        'success' => true,
        'groups' => $groups
    ]);

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'error' => '데이터베이스 오류가 발생했습니다: ' . $e->getMessage()
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>
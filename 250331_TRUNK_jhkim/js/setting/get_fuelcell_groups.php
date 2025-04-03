<?php
//get_fuelcell_groups.php
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
        p.powerplant_id,  -- 발전소 ID 추가
        p.powerplant_name,
        GROUP_CONCAT(f.fuelcell_id) as fuelcell_ids,  -- 연료전지 ID 목록 추가
        GROUP_CONCAT(f.fuelcell_name ORDER BY f.fuelcell_name ASC SEPARATOR ', ') AS fuelcells
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

    $sql .= " GROUP BY g.group_id, p.powerplant_id, p.powerplant_name"; 

    // PDO를 사용하여 데이터베이스 연결 및 쿼리 실행
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
    $fuelcell_groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 데이터 가공: fuelcell_ids를 배열로 변환
    foreach ($fuelcell_groups as &$group) {
        $group['fuelcell_ids'] = $group['fuelcell_ids'] ? explode(',', $group['fuelcell_ids']) : [];
    }

    echo json_encode($fuelcell_groups);
} catch (PDOException $e) {
    error_log("데이터 가져오기 오류: " . $e->getMessage());
    echo json_encode(["error" => "데이터 가져오기 오류가 발생했습니다."]);
}
?>
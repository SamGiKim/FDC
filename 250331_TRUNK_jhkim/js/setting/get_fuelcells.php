<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
header('Content-Type: application/json');

try {
    // GET 파라미터 가져오기
    $powerplant_id = $_GET['powerplant_id'] ?? null;
    $exclude_group = isset($_GET['exclude_group']) && $_GET['exclude_group'] === 'true';

    // 기본 SQL 쿼리
    $sql = "
        SELECT 
            f.fuelcell_id, 
            f.fuelcell_name, 
            f.powerplant_id,
            f.e_capacity, 
            f.t_capacity,
            f.group_id,
            f.address,
            f.install_date,
            f.reg_date
        FROM fuelcells f
        WHERE 1=1
    ";

    $params = [];

    // 발전소 ID로 필터링
    if ($powerplant_id) {
        $sql .= " AND f.powerplant_id = :powerplant_id";
        $params[':powerplant_id'] = $powerplant_id;
    }

    // 그룹에 속하지 않은 연료전지만 가져올지 결정
    if ($exclude_group) {
        $sql .= " AND (f.group_id IS NULL OR f.group_id = '')";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->execute($params);
    $fuelcells = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 디버깅용 로그
    error_log("Fetched fuelcells for powerplant_id: $powerplant_id");
    error_log("SQL Query: $sql");
    error_log("Results: " . json_encode($fuelcells));

    echo json_encode($fuelcells);

} catch (PDOException $e) {
    error_log("연료전지 목록 조회 오류: " . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        "error" => "연료전지 목록을 가져오는 중 오류가 발생했습니다.",
        "details" => $e->getMessage()
    ]);
}
?>
<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
header('Content-Type: application/json');

try {
    // GET 파라미터 가져오기
    $powerplant_id = $_GET['powerplant_id'] ?? null;
    $powerplant_name = $_GET['powerplant_name'] ?? null;
    $address = $_GET['address'] ?? null;

    // SQL 쿼리 작성
    $sql = "
        SELECT p.powerplant_id, p.powerplant_name, p.address, p.reg_date, 
               p.fuelcell_count, p.total_e_capacity, p.total_t_capacity
        FROM powerplants p
    ";
    $conditions = [];

    if ($powerplant_id) {
        $conditions[] = "p.powerplant_id = :powerplant_id";
    }

    if ($powerplant_name) {
        $conditions[] = "p.powerplant_name LIKE :powerplant_name";
    }

    if ($address) {
        $conditions[] = "p.address LIKE :address";
    }

    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    // PDO를 사용하여 데이터베이스 연결 및 쿼리 실행
    $stmt = $pdo->prepare($sql);

    if ($powerplant_id) {
        $stmt->bindParam(':powerplant_id', $powerplant_id, PDO::PARAM_STR);
    }

    if ($powerplant_name) {
        $powerplant_name = "%$powerplant_name%";
        $stmt->bindParam(':powerplant_name', $powerplant_name, PDO::PARAM_STR);
    }

    if ($address) {
        $address = "%$address%";
        $stmt->bindParam(':address', $address, PDO::PARAM_STR);
    }

    $stmt->execute();
    $powerplants = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($powerplants);
} catch (PDOException $e) {
    error_log("데이터 조회 오류: " . $e->getMessage());
    echo json_encode(["error" => "데이터 조회 중 오류가 발생했습니다."]);
}
?>

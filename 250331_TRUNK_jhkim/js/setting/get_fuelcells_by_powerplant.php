<?php
// get_fuelcells_by_powerplant.php
require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

$powerplant_id = $_GET['powerplant_id'] ?? null;

if (!$powerplant_id) {
    echo json_encode(["error" => "발전소 ID가 필요합니다."]);
    exit;
}

try {
    $stmt = $pdo->prepare("
        SELECT f.fuelcell_id, f.fuelcell_name, p.powerplant_name, g.group_name, f.address, f.install_date, f.reg_date, f.e_capacity, f.t_capacity
        FROM fuelcells f
        LEFT JOIN powerplants p ON f.powerplant_id = p.powerplant_id
        LEFT JOIN fuelcell_groups g ON f.group_id = g.group_id
        WHERE f.powerplant_id = :powerplant_id
    ");
    $stmt->bindParam(':powerplant_id', $powerplant_id, PDO::PARAM_STR);
    $stmt->execute();

    $fuelcells = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($fuelcells);
} catch (PDOException $e) {
    error_log("데이터 가져오기 오류: " . $e->getMessage());
    echo json_encode(["error" => "데이터 가져오기 오류가 발생했습니다."]);
}
?>
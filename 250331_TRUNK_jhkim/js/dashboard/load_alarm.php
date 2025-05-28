<?php
//load_alarm.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 디버그 로깅 추가
error_log("Received parameters: " . print_r($_GET, true));

require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $filters = isset($_GET['filters']) ? explode(',', $_GET['filters']) : ['전항목'];
    $limit = isset($_GET['limit']) && $_GET['limit'] !== '전체' ? intval($_GET['limit']) : 0;
    $fuelcellId = isset($_GET['fuelcellId']) ? $_GET['fuelcellId'] : 'F002';
    $plant = isset($_GET['plant']) ? $_GET['plant'] : 'SE01';
    $type = isset($_GET['type']) ? $_GET['type'] : '전체';

    $sql = "SELECT id, powerplant_id, fuelcell_id, time, comment, status
            FROM api_alarmlog 
            WHERE powerplant_id = :plant 
            AND fuelcell_id = :fuelcellId";

    if ($type !== '전체') {
        $sql .= " AND type = :type";
    }
    if (!in_array('전항목', $filters)) {
        $placeholders = implode(',', array_fill(0, count($filters), '?'));
        $sql .= " AND status IN ($placeholders)";
    }
    $sql .= " ORDER BY time DESC";
    if ($limit > 0) {
        $sql .= " LIMIT :limit";
    }

    error_log("SQL Query before execution: " . $sql);
    error_log("Parameters before binding: plant=" . $plant . ", fuelcellId=" . $fuelcellId);

    $stmt = $pdo->prepare($sql);
    
    // plant와 fuelcellId 모두 바인딩
    $stmt->bindParam(':plant', $plant, PDO::PARAM_STR);
    $stmt->bindParam(':fuelcellId', $fuelcellId, PDO::PARAM_STR);
    if ($type !== '전체') {
        $stmt->bindParam(':type', $type, PDO::PARAM_STR);
    }

    // 필터 바인딩
    if (!in_array('전항목', $filters)) {
        $paramIndex = 1;
        foreach ($filters as $filter) {
            $stmt->bindValue($paramIndex++, $filter, PDO::PARAM_STR);
        }
    }

    // limit 바인딩
    if ($limit > 0) {
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    }

    $stmt->execute();
    $alarms = $stmt->fetchAll(PDO::FETCH_ASSOC);

    error_log("Query executed successfully. Row count: " . count($alarms));
    
    echo json_encode($alarms);
} catch(PDOException $e) {
    error_log("Database error in load_alarm.php: " . $e->getMessage());
    error_log("Stack trace: " . $e->getTraceAsString());
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}
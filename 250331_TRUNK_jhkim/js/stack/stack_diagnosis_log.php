<?php
// load_stack_diagnosis_log.php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $type = $_GET['type'] ?? 'EIS';
    $limit = isset($_GET['limit']) && $_GET['limit'] !== '전체' ? intval($_GET['limit']) : 0;
    $fuelcellId = $_GET['fuelcellId'] ?? '';
    $plant = $_GET['plant'] ?? '';

    // 로그 기록
    error_log("DiagnosisLog parameters: type=$type, limit=$limit, fuelcellId=$fuelcellId, plant=$plant");

    $sql = "SELECT id, time, comment, type 
            FROM api_alarmlog
            WHERE type = :type 
              AND fuelcell_id = :fuelcellId 
              AND powerplant_id = :plant
            ORDER BY time DESC";

    if ($limit > 0) {
        $sql .= " LIMIT :limit";
    }

    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':type', $type, PDO::PARAM_STR);
    $stmt->bindParam(':fuelcellId', $fuelcellId, PDO::PARAM_STR);
    $stmt->bindParam(':plant', $plant, PDO::PARAM_STR);

    if ($limit > 0) {
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
    }

    $stmt->execute();
    $diagnosisLogs = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($diagnosisLogs);
} catch(PDOException $e) {
    error_log("Database error in load_stack_diagnosis_log.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $e->getMessage()]);
}

<?php
// get_fault_label_list.php

require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

header('Content-Type: application/json');

// 파라미터 받기 수정
$powerplant_id = filter_input(INPUT_GET, 'powerplant_id', FILTER_SANITIZE_STRING);
$fuelcell_id = filter_input(INPUT_GET, 'fuelcell_id', FILTER_SANITIZE_STRING);
$errCodes = filter_input(INPUT_GET, 'errCodes', FILTER_SANITIZE_STRING);
$modelGroup = filter_input(INPUT_GET, 'modelGroup', FILTER_SANITIZE_STRING);

if (empty($fuelcell_id)) {
    die(json_encode(['error' => 'fuelcell_id is required']));
}

// MySQL 연결
$conn = new mysqli($host, $username, $password, $dbname);

if ($conn->connect_error) {
    die(json_encode(['error' => 'Connection failed: ' . $conn->connect_error]));
}

// 쿼리 수정
$sql = "SELECT 
            el.id AS eventlist_id, 
            el.s_date, 
            el.e_date, 
            el.err_code, 
            el.err_info, 
            el.err_name,
            el.fuelcell_id, 
            el.history,
            es.score AS score,
            es.scores AS scores
        FROM 
            api_eventlist el 
        LEFT JOIN 
            api_eventscore es ON el.id = es.api_eventlist_id AND es.model_name = ? 
        WHERE 
            el.powerplant_id = ?
            AND el.fuelcell_id = ?";

$params = [$modelGroup, $powerplant_id, $fuelcell_id];
$types = "sss";

if (!empty($errCodes)) {
    $errCodesArray = explode(',', $errCodes);
    $placeholders = implode(',', array_fill(0, count($errCodesArray), '?'));
    $sql .= " AND err_code IN ($placeholders)";
    $params = array_merge($params, $errCodesArray);
    $types .= str_repeat('i', count($errCodesArray));
}

$sql .= " ORDER BY s_date DESC";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

$data = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $s_date = new DateTime($row['s_date']);
        $e_date = new DateTime($row['e_date']);
        
        $data[] = [
            'id' => $row['eventlist_id'],
            'date' => $s_date->format('Y-m-d'),
            'start_time' => $s_date->format('H:i:s'),
            'end_time' => $e_date->format('H:i:s'),
            'err_code' => $row['err_code'],
            'err_info' => $row['err_info'],
            'err_name' => $row['err_name'],
            'fuelcell_id' => $row['fuelcell_id'],
            'history' => $row['history'],
            'score' => $row['score'],
            'scores' => $row['scores']
        ];
    }
}

$stmt->close();
$conn->close();

echo json_encode($data);
?>
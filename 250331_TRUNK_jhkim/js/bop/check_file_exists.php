<?php
header('Content-Type: application/json');

$powerplant_id = $_GET['powerplant_id'] ?? '';
$fuelcell_id = $_GET['fuelcell_id'] ?? '';
$file_name = $_GET['file_name'] ?? '';

if (empty($powerplant_id) || empty($fuelcell_id) || empty($file_name)) {
    echo json_encode(['success' => false, 'message' => 'Missing parameters']);
    exit;
}

// 새로운 경로 구조 반영
$directory = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/BOP/NORMAL/";
$file_path = $directory . $file_name . '.lst';

$exists = file_exists($file_path);

echo json_encode(['success' => true, 'exists' => $exists]);
?>
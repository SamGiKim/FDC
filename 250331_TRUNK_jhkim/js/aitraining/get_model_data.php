<?php
// get_model_data.php
require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

// URL 파라미터 받기 (기본값 제거)
$powerplant_id = $_GET['powerplant_id'];
$fuelcell_id = $_GET['fuelcell_id'];
$modelGroup = $_GET['modelGroup'];

// 파일 경로 구성
$filePath = "/home/nstek/h2_system/FDC/{$powerplant_id}/{$fuelcell_id}/BOP/MODEL/{$modelGroup}/{$modelGroup}.csv";

// 디버깅용 로그
error_log("Attempting to read file: " . $filePath);

if (!file_exists($filePath)) {
    error_log("File not found: " . $filePath);
    echo json_encode([
        'error' => 'File not found',
        'path' => $filePath,
        'params' => [
            'powerplant_id' => $powerplant_id,
            'fuelcell_id' => $fuelcell_id,
            'modelGroup' => $modelGroup
        ]
    ]);
    exit;
}

$data = [];
if (($handle = fopen($filePath, "r")) !== FALSE) {
    while (($row = fgetcsv($handle, 1000, ",")) !== FALSE) {
        if (count($row) === 2) {
            $data[$row[0]] = floatval($row[1]);
        }
    }
    fclose($handle);
}

echo json_encode($data);

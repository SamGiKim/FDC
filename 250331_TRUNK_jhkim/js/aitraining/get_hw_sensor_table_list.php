<?php
// get_hw_sensor_table_list.php

// 설정 파일 포함
require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

header('Content-Type: application/json');

// URL 파라미터에서 정보 가져오기
$powerplant_id = $_GET['powerplant_id'];
$fuelcell_id = $_GET['fuelcell_id'];
$modelGroup = $_GET['modelGroup'];
$fileName = $_GET['fileName'];

// 새로운 파일 경로 설정
$baseDir = '/home/nstek/h2_system/FDC/';
$filePath = $baseDir . $powerplant_id . '/' . $fuelcell_id . '/BOP/MODEL/' . $modelGroup . '/' . $fileName;

// 디버깅을 위한 로그 추가
error_log("Attempting to access file: " . $filePath);

// 파일이 존재하는지 확인
if (file_exists($filePath)) {
    // CSV 파일을 읽어와서 JSON 형식으로 반환
    $csv = array_map('str_getcsv', file($filePath));
    $json = json_encode($csv);
    echo $json;
} else {
    http_response_code(404);
    echo json_encode([
        "error" => "파일을 찾을 수 없습니다.",
        "path" => $filePath,
        "params" => [
            "powerplant_id" => $powerplant_id,
            "fuelcell_id" => $fuelcell_id,
            "modelGroup" => $modelGroup,
            "fileName" => $fileName
        ]
    ]);
}
?>
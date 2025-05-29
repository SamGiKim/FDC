<?php
header('Content-Type: application/json');

// GET 파라미터
$powerplant_id = $_GET['powerplant_id'] ?? '';
$fuelcell_id = $_GET['fuelcell_id'] ?? '';
$year = $_GET['year'] ?? '';
$month = $_GET['month'] ?? '';
$day = $_GET['day'] ?? '';

// 기본 경로 설정
$basePath = '/home/nstek/h2_system/FDC';
$targetDir = "$basePath/$powerplant_id/$fuelcell_id/EIS/DGLOG/$year/$month/$day";

// 디렉토리 유효성 검사 후 CSV 파일 목록 반환
if (is_dir($targetDir)) {
    $files = array_values(array_filter(scandir($targetDir), function ($file) use ($targetDir) {
        return is_file("$targetDir/$file") && pathinfo($file, PATHINFO_EXTENSION) === 'csv';
    }));
    echo json_encode(['status' => 'success', 'files' => $files]);
} else {
    echo json_encode(['status' => 'error', 'message' => 'Directory not found']);
}
?>

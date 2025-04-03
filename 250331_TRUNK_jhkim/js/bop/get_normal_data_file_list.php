<?php
// get_normal_data_file_list.php
// BOP 정상 학습 데이터에서 '파일추가'시에 조회하는 파일들
header('Content-Type: application/json');

// 에러 리포팅 설정
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$powerplant_id = isset($_GET['powerplant_id']) ? $_GET['powerplant_id'] : '';
$fuelcell_id = isset($_GET['fuelcell_id']) ? $_GET['fuelcell_id'] : '';

if (empty($powerplant_id) || empty($fuelcell_id)) {
    echo json_encode(['success' => false, 'message' => 'powerplant_id and fuelcell_id are required']);
    exit;
}

// 새로운 디렉토리 경로 설정
$directory = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/BOP/NORMAL/";

// 디렉토리 존재 여부 확인
if (!is_dir($directory)) {
    echo json_encode(['success' => false, 'message' => 'Directory not found']);
    exit;
}

try {
    // 디렉토리에서 파일 목록 가져오기
    $files = array_diff(scandir($directory), array('..', '.'));
    
    // LST 파일만 필터링
    $lst_files = array_filter($files, function($file) {
        return pathinfo($file, PATHINFO_EXTENSION) === 'lst';
    });
    
    // 결과 반환
    echo json_encode(['success' => true, 'files' => array_values($lst_files)]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => $e->getMessage()]);
}
?>
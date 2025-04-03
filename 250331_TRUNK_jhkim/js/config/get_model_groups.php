<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$powerplant_id = isset($_GET['powerplant_id']) ? $_GET['powerplant_id'] : '';
$fuelcell_id = isset($_GET['fuelcell_id']) ? $_GET['fuelcell_id'] : '';

if (!$powerplant_id || !$fuelcell_id) {
    echo json_encode([
        'success' => false, 
        'message' => '발전소 ID와 연료전지 ID가 필요합니다.',
        'data' => []
    ]);
    exit;
}

try {
    $baseDir = "/home/nstek/h2_system/FDC/{$powerplant_id}/{$fuelcell_id}/BOP/MODEL/";
    
    if (!is_dir($baseDir) || !is_readable($baseDir)) {
        echo json_encode([
            'success' => false,
            'message' => '디렉토리를 찾을 수 없거나 읽을 수 없습니다.',
            'data' => []
        ]);
        exit;
    }

    // 디렉토리 목록 가져오기
    $directories = array_values(array_filter(scandir($baseDir), function($item) use ($baseDir) {
        return $item != '.' && $item != '..' && is_dir($baseDir . $item);
    }));

    echo json_encode([
        'success' => true,
        'message' => '',
        'data' => $directories
    ]);

} catch (Exception $e) {
    error_log("Error in get_model_groups.php: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => '오류가 발생했습니다: ' . $e->getMessage(),
        'data' => []
    ]);
}
?>
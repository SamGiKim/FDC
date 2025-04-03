<?php
header('Content-Type: application/json');

// 에러 로깅 활성화
ini_set('display_errors', 1);
error_reporting(E_ALL);

$data = json_decode(file_get_contents('php://input'), true);

if (is_null($data)) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 데이터입니다.']);
    exit;
}

// 파일 경로 설정
$filePath ='/home/nstek/h2_system/patch_active/fuelcell_data/tags.conf';

// 로깅을 추가하여 파일 상태 확인
if (!file_exists($filePath)) {
    echo json_encode(['success' => false, 'message' => '파일이 존재하지 않습니다.']);
    exit;
} else if (!is_writable($filePath)) {
    echo json_encode(['success' => false, 'message' => '파일에 쓸 수 없습니다.']);
    exit;
} else {
    // 태그 데이터를 파일에 쓰기
    $lines = [];
    foreach ($data as $tag) {
        $lines[] = $tag['name'] . ", color: " . $tag['color'];
    }
    $dataToSave = implode(PHP_EOL, $lines) . PHP_EOL;

    if (file_put_contents($filePath, $dataToSave) === false) {
        echo json_encode(['success' => false, 'message' => '파일 쓰기 실패.']);
        exit;
    } else {
        echo json_encode(['success' => true, 'message' => '태그 순서가 저장되었습니다.']);
    }
}
?>

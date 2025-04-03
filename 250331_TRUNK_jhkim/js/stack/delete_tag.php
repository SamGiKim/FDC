<?php
// delete_tag.php
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');
mb_language('uni');
mb_regex_encoding('UTF-8');

header('Content-Type: application/json; charset=UTF-8');

// 에러 로깅 활성화
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// 받은 데이터 로깅
error_log("Received data for deletion: " . print_r($_POST, true));

$tag = isset($_POST['tag']) ? $_POST['tag'] : null;

$response = [];

if ($tag === null) {
    $response['error'] = "태그 데이터가 전송되지 않았습니다.";
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// 파일 경로 설정
$filePath = '/home/nstek/h2_system/patch_active/fuelcell_data/tags.conf';

if (!file_exists($filePath)) {
    $response['error'] = "파일이 존재하지 않습니다: " . $filePath;
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

if (!is_writable($filePath)) {
    $response['error'] = "파일에 쓸 수 없습니다: " . $filePath;
    echo json_encode($response, JSON_UNESCAPED_UNICODE);
    exit;
}

// 파일에서 태그 삭제
$lines = file($filePath, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
$newLines = array_filter($lines, function($line) use ($tag) {
    return strpos($line, $tag . ',') !== 0; // 태그와 일치하는 줄을 삭제
});

// 파일 다시 쓰기
if (file_put_contents($filePath, implode(PHP_EOL, $newLines)) !== false) {
    $response['success'] = true;
    $response['message'] = '태그가 성공적으로 삭제되었습니다.';
} else {
    $response['success'] = false;
    $response['error'] = "파일 쓰기 실패: " . $filePath;
}

// 응답 전송 전 로깅
error_log("Sending response: " . json_encode($response, JSON_UNESCAPED_UNICODE));

// JSON 응답 전송
echo json_encode($response, JSON_UNESCAPED_UNICODE);
exit;
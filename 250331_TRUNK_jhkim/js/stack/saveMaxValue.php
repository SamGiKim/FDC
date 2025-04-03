<?php
require_once '../config/config.php';
require_once '../config/db_config.php';

$maxValue = $_POST['maxValue'] ?? null;
if (!$maxValue) {
    echo "No maxValue provided.";
    exit;
}
echo "Received max value: $maxValue";  // 받은 데이터 로그

// "MaxValue = " 제거
$maxValue = preg_replace('/MaxValue\s*=\s*/', '', $maxValue);
echo "Processed max value: $maxValue";  // 처리된 데이터 로그

$filePath = SELECTED_CONF_PATH;

// 로그 파일 경로
$apache_error_log = LOG_FILE_PATH;

// 로그에 파일 저장 시도 기록
file_put_contents($apache_error_log, "Attempting to save max values to: $filePath\n", FILE_APPEND);

// 파일 쓰기 권한 확인
if (!is_writable($filePath)) {
    echo "File path is not writable: $filePath";
    file_put_contents($apache_error_log, "File path is not writable: $filePath\n", FILE_APPEND);
    exit;
}

// 파일 내용 초기화 후 최대값 문자열을 저장
if (file_put_contents($filePath, $maxValue) !== false) {
    echo "Max values saved successfully.";
    file_put_contents($apache_error_log, "File saved successfully at $filePath\n", FILE_APPEND);
} else {
    echo "Failed to save max values.";
    file_put_contents($apache_error_log, "Failed to save file at $filePath\n", FILE_APPEND);
    error_log("Error writing to file: Permissions issue or incorrect path");
}
?>

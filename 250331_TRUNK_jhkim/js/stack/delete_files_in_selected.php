<?php
// delete_files_in_selected.php

// 설정 파일 포함
require_once '../config/config.php'; 
require_once '../config/db_config.php'; 
$sessionId = $_GET['sessionId'] ?? null;

$directory = '/home/nstek/h2_system/FDC/SES/' . $sessionId . '/selected';

foreach(glob("{$directory}/*") as $file) { // "{$directory}*"에서 "{$directory}/*"로 변경
    if(is_file($file)) {
        // 파일 삭제
        unlink($file);
    }
}

echo json_encode(['message' => 'Selected directory cleared', 'directory' => $directory]);
?>
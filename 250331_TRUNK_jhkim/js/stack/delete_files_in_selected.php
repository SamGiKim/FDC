<?php
// delete_files_in_selected.php

// 설정 파일 포함
require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

$directory = '/home/nstek/h2_system/patch_active/FDC/work/bjy/impedance/selected/';

foreach(glob("{$directory}*") as $file) {
    if(is_file($file)) {
        // 파일 삭제
        unlink($file);
    }
}

echo json_encode(['message' => 'Selected directory cleared']);
?>
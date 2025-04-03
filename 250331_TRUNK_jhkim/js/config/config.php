<?php
// config.php
// db설정
$host = 'localhost';
$dbname = $_SESSION['current_db'] ?? 'FDC';
$username = 'root';
$password = 'coffee';

// 경로 설정
define('SOURCE_PATH', '/home/nstek/h2_system/patch_active/ALL/data/impedance/imp_data/post_data/');
define('SELECTED_PATH', '/home/nstek/h2_system/patch_active/FDC/work/bjy/impedance/selected/');
define('COLOR_CONF_PATH', SELECTED_PATH . 'color.conf');
define('SELECTED_CONF_PATH', SELECTED_PATH . 'selected.conf');

// 로그 파일 경로 설정
define('LOG_FILE_PATH', '/home/nstek/h2_system/patch_active/FDC/Proj/DEV/error.log');

?>
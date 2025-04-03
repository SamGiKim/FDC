<?php
//db_config.php
$dsn = 'mysql:host=' . $host . ';dbname=' . $dbname;
try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    error_log("데이터베이스 연결 오류: " . $e->getMessage());
    echo json_encode(["error" => "데이터베이스 연결 오류가 발생했습니다."]);
    exit;
}
?>
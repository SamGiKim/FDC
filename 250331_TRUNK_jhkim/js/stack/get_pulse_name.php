<?php
header('Content-Type: application/json');

require_once '../config/config.php';
require_once '../config/db_config.php';

$no = isset($_GET['no']) ? $_GET['no'] : null;
$type = $_GET['type'] ?? 'PULSE';

if (!$no) {
    http_response_code(400);
    echo json_encode(['error' => 'NO parameter is required']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT NAME FROM search WHERE NO = :no");
    $stmt->execute(['no' => $no]);
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    $name = $result['NAME'] ?? null;
    
    // 타입에 따라 pulse/npulse 경로 조정
    if ($type === 'NPULSE') {
        $name = str_replace('/pulse_data', '/npulse_data', $name);
    }

    echo json_encode(['name' => $name]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>

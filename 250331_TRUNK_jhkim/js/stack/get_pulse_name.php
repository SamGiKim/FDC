<?php
header('Content-Type: application/json');

require_once '../config/config.php';
require_once '../config/db_config.php';

$no = isset($_GET['no']) ? $_GET['no'] : null;

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
    
    echo json_encode(['name' => $result['NAME'] ?? null]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
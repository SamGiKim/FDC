<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

if (!isset($_GET['no']) || !is_numeric($_GET['no'])) {
  echo json_encode(['error' => 'Valid NO is required']);
  exit;
}

$no = intval($_GET['no']); // 'id'를 'no'로 변경

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $stmt = $pdo->prepare("SELECT * FROM search WHERE NO = :no");
    $stmt->bindValue(':no', $no, PDO::PARAM_INT);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode(['data' => $result]);
    } else {
        echo json_encode(['error' => 'No data found']);
    }
} catch (PDOException $e) {
    // 내부 오류 메시지를 노출하지 않도록 변경
    echo json_encode(['error' => 'Database error occurred. Please try again later.']);
} catch (Exception $e) {
    echo json_encode(['error' => 'An error occurred. Please try again later.']);
}
?>
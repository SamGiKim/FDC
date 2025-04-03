<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

require_once '../config/config.php';

// 파라미터 검증
if (!isset($_GET['plant']) || !isset($_GET['group']) || !isset($_GET['fuelcell']) || !isset($_GET['stime'])) {
    echo json_encode([
        'success' => false,
        'message' => '필수 파라미터가 누락되었습니다.'
    ]);
    exit;
}

$plant = $_GET['plant'];
$group = $_GET['group'];
$fuelcell = $_GET['fuelcell'];
$stime = $_GET['stime'];

try {
    // PDO 연결
    $dsn = "mysql:host=$host;dbname=$dbname;charset=utf8mb4";
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    $timestamp = $stime/1000;
    $searchDate = date('Y-m-d H:i:s', $timestamp);
    
    
    // 1. 먼저 해당 날짜의 데이터와 전체 순서를 구함
    $sql = "SELECT a.*, 
            (SELECT COUNT(*) 
             FROM search b 
             WHERE b.powerplant_id = :plant 
             AND b.group_id = :group 
             AND b.fuelcell_id = :fuelcell 
             AND b.DATE >= a.DATE) as rowNumber
            FROM search a
            WHERE a.powerplant_id = :plant 
            AND a.group_id = :group 
            AND a.fuelcell_id = :fuelcell 
            AND a.DATE = :searchDate";
            
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':plant', $plant);
    $stmt->bindParam(':group', $group);
    $stmt->bindParam(':fuelcell', $fuelcell);
    $stmt->bindParam(':searchDate', $searchDate);
    $stmt->execute();
    
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    if ($result) {
        echo json_encode([
            'success' => true,
            'data' => $result,
            'rowNumber' => $result['rowNumber']  // 전체 데이터에서의 순서 반환
        ]);
    } else {
        echo json_encode([
            'success' => false,
            'message' => '해당 날짜의 데이터를 찾을 수 없습니다.',
            'searchDate' => $searchDate
        ]);
    }

} catch (PDOException $e) {
    echo json_encode([
        'success' => false,
        'message' => '데이터베이스 오류: ' . $e->getMessage(),
        'searchDate' => $searchDate ?? null
    ]);
} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'message' => '오류 발생: ' . $e->getMessage(),
        'searchDate' => $searchDate ?? null
    ]);
}
?>
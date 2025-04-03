<?php
header('Content-Type: application/json');
require_once '../config/config.php';
require_once '../config/db_config.php';

// 로깅 추가
error_log("Received POST data: " . print_r($_POST, true));

// POST 데이터 가져오기
$bookmarkName = isset($_POST['name']) ? $_POST['name'] : null;
$powerplant_id = isset($_POST['powerplant_id']) ? $_POST['powerplant_id'] : null;
$group_id = isset($_POST['group_id']) ? $_POST['group_id'] : null;
$fuelcell_id = isset($_POST['fuelcell_id']) ? $_POST['fuelcell_id'] : null;

// 필수 파라미터 확인 - 로깅 추가
error_log("Bookmark Name: $bookmarkName, Plant: $powerplant_id, Group: $group_id, Fuelcell: $fuelcell_id");

// 북마크 이름은 필수
if (!$bookmarkName) {
    echo json_encode(['success' => false, 'message' => '북마크 이름은 필수입니다.']);
    exit;
}

// 나머지 파라미터는 있으면 사용하되, null이어도 진행
try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 북마크 추가 쿼리
    $query = "INSERT INTO bookmark (bookmark_name, powerplant_id, group_id, fuelcell_id) 
              VALUES (:name, :powerplant_id, :group_id, :fuelcell_id)";
    
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':name', $bookmarkName);
    $stmt->bindParam(':powerplant_id', $powerplant_id);
    $stmt->bindParam(':group_id', $group_id);
    $stmt->bindParam(':fuelcell_id', $fuelcell_id);
    
    $stmt->execute();
    $bookmarkId = $pdo->lastInsertId();
    
    echo json_encode([
        'success' => true, 
        'message' => '북마크가 추가되었습니다.', 
        'bookmarkId' => $bookmarkId
    ]);
    
} catch (PDOException $e) {
    error_log("북마크 추가 오류: " . $e->getMessage());
    echo json_encode(['success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()]);
}
?>
<?php
require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

// MySQL 연결
$conn = new mysqli($host, $username, $password, $dbname);

// 연결 확인
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// GET 파라미터 받기
$powerplant_id = isset($_GET['powerplant_id']) ? $_GET['powerplant_id'] : null;
$fuelcell_id = isset($_GET['fuelcell_id']) ? $_GET['fuelcell_id'] : null;

// 로깅 추가
error_log("get_bookmark.php 호출: powerplant_id=$powerplant_id, fuelcell_id=$fuelcell_id");

// 필수 파라미터 확인 - 없으면 모든 북마크 반환
if (!$powerplant_id || !$fuelcell_id) {
    error_log("필수 파라미터 누락: 모든 북마크를 반환합니다.");
    
    // 모든 북마크 반환
    $sql = "SELECT DISTINCT b.id, b.bookmark_name, b.color_id, b.color_code, 
                  b.powerplant_id, b.group_id, b.fuelcell_id
           FROM bookmark b
           ORDER BY b.id ASC";
    
    $stmt = $conn->prepare($sql);
} else {
    // 지정된 발전소/연료전지에 맞는 북마크와 'undefined' 값 북마크 함께 반환
    $sql = "SELECT DISTINCT b.id, b.bookmark_name, b.color_id, b.color_code, 
                  b.powerplant_id, b.group_id, b.fuelcell_id
           FROM bookmark b
           WHERE (b.powerplant_id = ? AND b.fuelcell_id = ?)
              OR (b.powerplant_id = 'undefined' OR b.powerplant_id IS NULL)
              OR (b.fuelcell_id = 'undefined' OR b.fuelcell_id IS NULL)
           ORDER BY b.id ASC";
    
    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        echo json_encode(['error' => '쿼리 준비 실패: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("ss", $powerplant_id, $fuelcell_id);
}

$stmt->execute();
$result = $stmt->get_result();

$bookmarkList = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $bookmarkList[] = [
            'id' => $row['id'],
            'name' => $row['bookmark_name'],
            'colorId' => $row['color_id'] ?? null,
            'colorCode' => $row['color_code'] ?? null,
            'powerplantId' => $row['powerplant_id'] ?? null,
            'groupId' => $row['group_id'] ?? null,
            'fuelcellId' => $row['fuelcell_id'] ?? null,
        ];
    }
}

// 로깅: 반환되는 북마크 수
error_log("반환된 북마크 수: " . count($bookmarkList));

// JSON 형식으로 북마크 목록 반환
header('Content-Type: application/json');
echo json_encode($bookmarkList);

// 리소스 정리
$stmt->close();
$conn->close();
?>
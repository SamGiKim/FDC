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
$powerplant_id = isset($_GET['plant']) ? $_GET['plant'] : null;
$fuelcell_id = isset($_GET['fuelcell']) ? $_GET['fuelcell'] : null;
$group_id = isset($_GET['group']) ? $_GET['group'] : null;

// 로깅
error_log("get_bookmark.php 호출: powerplant_id=$powerplant_id, fuelcell_id=$fuelcell_id, group_id=$group_id");

// 파라미터 검증
if ($powerplant_id && !preg_match('/^[\w\-]+$/', $powerplant_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid powerplant_id']);
    exit;
}
if ($fuelcell_id && !preg_match('/^[\w\-]+$/', $fuelcell_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid fuelcell_id']);
    exit;
}
if ($group_id && !preg_match('/^[\w\-]+$/', $group_id)) {
    http_response_code(400);
    echo json_encode(['error' => 'Invalid group_id']);
    exit;
}

// 조건 분기: 필터링된 조회 vs 전체 조회
if ($powerplant_id && $fuelcell_id && $group_id) {
    error_log("지정된 powerplant_id, fuelcell_id, group_id 기준으로 필터링된 북마크 반환");

    $sql = "SELECT DISTINCT b.id, b.bookmark_name, b.color_id, b.color_code, 
                   b.powerplant_id, b.group_id, b.fuelcell_id
            FROM bookmark b
            WHERE b.powerplant_id = ? AND b.fuelcell_id = ? AND b.group_id = ?
            ORDER BY b.id ASC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => '쿼리 준비 실패: ' . $conn->error]);
        exit;
    }
    $stmt->bind_param("sss", $powerplant_id, $fuelcell_id, $group_id);
} else {
    error_log("필수 파라미터 누락 또는 group_id 없음: 전체 북마크 반환");

    $sql = "SELECT DISTINCT b.id, b.bookmark_name, b.color_id, b.color_code, 
                   b.powerplant_id, b.group_id, b.fuelcell_id
            FROM bookmark b
            ORDER BY b.id ASC";

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        http_response_code(500);
        echo json_encode(['error' => '쿼리 준비 실패: ' . $conn->error]);
        exit;
    }
}

// 쿼리 실행
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

error_log("반환된 북마크 수: " . count($bookmarkList));

// 결과 반환
header('Content-Type: application/json');
echo json_encode($bookmarkList);

// 정리
$stmt->close();
$conn->close();
?>

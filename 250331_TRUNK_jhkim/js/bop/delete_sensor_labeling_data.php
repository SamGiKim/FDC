<?php
// delete_sensor_labeling_data.php [BOP 센서 라벨링 데이터] 삭제
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

// 트랜잭션 시작
$pdo->beginTransaction();

try {
    // 먼저 api_eventscore에서 참조 삭제
    $deleteScoreQuery = "DELETE FROM api_eventscore WHERE api_eventlist_id = :id";
    $scoreStmt = $pdo->prepare($deleteScoreQuery);

    // api_eventscore에서 데이터 삭제
    foreach ($input as $item) {
        $scoreStmt->bindParam(':id', $item['id']);
        $scoreStmt->execute();
    }

    // api_eventlist에서 데이터 삭제
    $query = "DELETE FROM api_eventlist WHERE id = :id";
    $stmt = $pdo->prepare($query);

    foreach ($input as $item) {
        $stmt->bindParam(':id', $item['id']);
        $stmt->execute();
    }

    // 트랜잭션 커밋
    $pdo->commit();
    
    echo json_encode(["success" => true, "message" => "데이터가 성공적으로 삭제되었습니다."]);

} catch (Exception $e) {
    // 오류 발생 시 롤백
    $pdo->rollBack();
    error_log("Error occurred: " . $e->getMessage());
    echo json_encode(["success" => false, "message" => "데이터 삭제 중 오류가 발생했습니다: " . $e->getMessage()]);
}

// 자원 해제
$stmt = null;
$pdo = null;

?>

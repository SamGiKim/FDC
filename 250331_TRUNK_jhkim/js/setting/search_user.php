<?php
require_once '../config/config.php';
require_once '../config/db_config.php';
header('Content-Type: application/json');

try {
    // GET 파라미터 가져오기
    $account_id = $_GET['account_id'] ?? null; // 여기서 user_id를 account_id로 수정
    $role = $_GET['role'] ?? null;

    // SQL 쿼리 작성
    $sql = "SELECT * FROM users";
    $conditions = [];

    if ($account_id) {
        $conditions[] = "account_id = :account_id";
    }

    if ($role) {
        $conditions[] = "role = :role";
    }

    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    // PDO를 사용하여 데이터베이스 연결 및 쿼리 실행
    $stmt = $pdo->prepare($sql);

    if ($account_id) {
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_STR); // user_id를 account_id로 수정
    }

    if ($role) {
        $stmt->bindParam(':role', $role, PDO::PARAM_STR);
    }

    $stmt->execute();
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode($users);
} catch (PDOException $e) {
    error_log("데이터 조회 오류: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => '데이터 조회 중 오류가 발생했습니다.']);
} catch (Exception $e) {
    error_log("일반 오류: " . $e->getMessage());
    echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

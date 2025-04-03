<?php
require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

try {
    // GET 파라미터 가져오기
    $account_id = $_GET['account_id'] ?? null;
    $role = $_GET['role'] ?? null;

    // SQL 쿼리 작성
    $sql = "
    SELECT u.account_id, u.activation_status, u.user_name, u.email, u.phone, u.role, u.last_login, u.reg_date, 
    GROUP_CONCAT(p.powerplant_name SEPARATOR ', ') AS powerplants
FROM users u
LEFT JOIN user_powerplants up ON u.account_id = up.account_id
LEFT JOIN powerplants p ON up.powerplant_id = p.powerplant_id
    ";
    $conditions = [];

    if ($account_id) {
        $conditions[] = "u.account_id = :account_id";
    }

    if ($role) {
        $conditions[] = "u.role = :role";
    }

    if (count($conditions) > 0) {
        $sql .= " WHERE " . implode(' AND ', $conditions);
    }

    $sql .= " GROUP BY u.account_id";

    // PDO를 사용하여 데이터베이스 연결 및 쿼리 실행
    $stmt = $pdo->prepare($sql);

    if ($account_id) {
        $stmt->bindParam(':account_id', $account_id, PDO::PARAM_STR);
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

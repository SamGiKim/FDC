<?php
// delete_user.php
require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);
$account_id = $data['account_id'];

if (!$account_id) {
    echo json_encode([
        'success' => false,
        'error' => "사용자 ID가 제공되지 않았습니다."
    ]);
    exit;
}

try {
    $pdo->beginTransaction();

    // 사용자 ID 가져오기
    $stmt = $pdo->prepare("SELECT user_id, account_id FROM users WHERE account_id = :account_id");
    $stmt->execute([':account_id' => $account_id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$user) {
        echo json_encode([
            'success' => false,
            'error' => "해당 ID의 사용자가 존재하지 않습니다."
        ]);
        $pdo->rollBack();
        exit;
    }

    // 1. user_groups에서 삭제 (account_id 사용)
    $stmt = $pdo->prepare("DELETE FROM user_groups WHERE account_id = :account_id");
    $stmt->execute([':account_id' => $user['account_id']]);

    // 2. user_powerplants에서 삭제 (account_id 사용)
    $stmt = $pdo->prepare("DELETE FROM user_powerplants WHERE account_id = :account_id");
    $stmt->execute([':account_id' => $user['account_id']]);

    // 3. 마지막으로 users 테이블에서 삭제 (user_id 사용)
    $stmt = $pdo->prepare("DELETE FROM users WHERE user_id = :user_id");
    $stmt->execute([':user_id' => $user['user_id']]);

    $pdo->commit();
    echo json_encode(['success' => true]);
} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("데이터 삭제 오류: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage()
    ]);
}
?>

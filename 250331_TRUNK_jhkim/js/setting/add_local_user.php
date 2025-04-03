<?php
// add_local_user.php
require __DIR__ . '/../config/config.php';
require __DIR__ . '/../config/db_config.php';

header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

$user_name = $data['user_name'] ?? null;
$account_id = $data['account_id'] ?? null;
$email = $data['email'] ?? null;
$phone = $data['phone'] ?? null;
$activation_status = $data['activation_status'] ?? false;
$role = $data['role'] ?? null;
$selected_powerplants = $data['powerplants'] ?? [];
$selected_groups = $data['groups'] ?? [];

if (!$user_name || !$account_id || !$email || !$role) {
    echo json_encode(["error" => "모든 필수 필드를 입력하세요."]);
    exit;
}

try {
    // account_id 중복 확인
    $stmt = $pdo->prepare("SELECT COUNT(*) FROM users WHERE account_id = :account_id");
    $stmt->execute([':account_id' => $account_id]);
    $count = $stmt->fetchColumn();

    if ($count > 0) {
        echo json_encode(["error" => "이미 존재하는 ID 입니다."]);
        exit;
    }

    $pdo->beginTransaction();

    $stmt = $pdo->prepare("INSERT INTO users (user_name, account_id, email, phone, activation_status, role) VALUES (:user_name, :account_id, :email, :phone, :activation_status, :role)");
    $stmt->execute([
        ':user_name' => $user_name,
        ':account_id' => $account_id,
        ':email' => $email,
        ':phone' => $phone,
        ':activation_status' => $activation_status,
        ':role' => $role
    ]);

    $user_id = $pdo->lastInsertId();

    foreach ($selected_powerplants as $powerplant_id) {
        $stmt = $pdo->prepare("INSERT INTO user_powerplants (account_id, powerplant_id) VALUES (:account_id, :powerplant_id)");
        $stmt->execute([
            ':account_id' => $account_id,
            ':powerplant_id' => $powerplant_id
        ]);
    }

    // 그룹 정보 추가
    foreach ($selected_groups as $group_id) {
        $stmt = $pdo->prepare("INSERT INTO user_groups (account_id, group_id) VALUES (:account_id, :group_id)");
        $stmt->execute([
            ':account_id' => $account_id,
            ':group_id' => $group_id
        ]);
    }

    $pdo->commit();
    echo json_encode(["success" => true, "message" => "사용자가 성공적으로 추가되었습니다."]);

} catch (PDOException $e) {
    $pdo->rollBack();
    error_log("Database error: " . $e->getMessage());
    echo json_encode(["error" => "데이터베이스 오류가 발생했습니다."]);
} catch (Exception $e) {
    $pdo->rollBack();
    error_log("General error: " . $e->getMessage());
    echo json_encode(["error" => "오류가 발생했습니다."]);
}
?>
<?php
// update_users.php
require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json; charset=utf-8'); // UTF-8 인코딩 설정

try {
  // JSON 형식의 데이터를 가져오기
  $data = json_decode(file_get_contents('php://input'), true);

  if (json_last_error() !== JSON_ERROR_NONE) {
    throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
  }

  $user_name = $data['user_name'] ?? null;
  $account_id = $data['account_id'] ?? null;
  $email = $data['email'] ?? null;
  $phone = $data['phone'] ?? null;
  $activation_status = isset($data['activation_status']) ? (int)$data['activation_status'] : null;
  $role = $data['role'] ?? null;
  $powerplants = $data['powerplants'] ?? [];
  $groups = $data['groups'] ?? [];

  if (!$user_name || !$account_id) {
    throw new Exception('사용자 이름과 사용자 ID는 필수입니다.');
  }

  $pdo->beginTransaction();

  $stmt = $pdo->prepare("
    UPDATE users
    SET user_name = :user_name, email = :email, phone = :phone, activation_status = :activation_status, role = :role
    WHERE account_id = :account_id
  ");
  $stmt->bindParam(':user_name', $user_name);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':phone', $phone);
  $stmt->bindParam(':activation_status', $activation_status);
  $stmt->bindParam(':role', $role);
  $stmt->bindParam(':account_id', $account_id);

  if (!$stmt->execute()) {
    throw new Exception('데이터 업데이트 실패');
  }

  $stmt = $pdo->prepare("SELECT user_id FROM users WHERE account_id = :account_id");
  $stmt->execute([':account_id' => $account_id]);
  $user_id = $stmt->fetchColumn();

  // 기존 발전소 및 그룹 데이터 삭제
  $stmt = $pdo->prepare("DELETE FROM user_powerplants WHERE account_id = :account_id");
  $stmt->execute([':account_id' => $account_id]);

  $stmt = $pdo->prepare("DELETE FROM user_groups WHERE account_id = :account_id");
  $stmt->execute([':account_id' => $account_id]);

  // 새로운 발전소 및 그룹 데이터 삽입
  $stmt = $pdo->prepare("
    INSERT INTO user_powerplants (account_id, powerplant_id)
    VALUES (:account_id, :powerplant_id)
  ");
  $stmt->bindParam(':account_id', $account_id);

  foreach ($powerplants as $powerplant_id) {
    $stmt->bindParam(':powerplant_id', $powerplant_id);
    if (!$stmt->execute()) {
      throw new Exception('발전소 데이터 삽입 실패');
    }
  }

  $stmt = $pdo->prepare("
    INSERT INTO user_groups (account_id, group_id)
    VALUES (:account_id, :group_id)
  ");
  $stmt->bindParam(':account_id', $account_id);

  foreach ($groups as $group_id) {
    $stmt->bindParam(':group_id', $group_id);
    if (!$stmt->execute()) {
      throw new Exception('그룹 데이터 삽입 실패');
    }
  }

  $pdo->commit();

  echo json_encode(['success' => true]);
} catch (PDOException $e) {
  $pdo->rollBack();
  error_log("데이터 업데이트 오류: " . $e->getMessage());
  echo json_encode(['success' => false, 'error' => '입력 내용을 확인해주세요.']);
} catch (Exception $e) {
  $pdo->rollBack();
  error_log("일반 오류: " . $e->getMessage());
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>
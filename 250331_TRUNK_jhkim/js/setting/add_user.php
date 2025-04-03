<?php
//add_user.php
require __DIR__ . '/../config/config.php';
require __DIR__ . '/../config/db_config.php';

header('Content-Type: application/json');

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
  $authority = $data['authority'] ?? null;
  $powerplants = $data['powerplants'] ?? [];
  $reg_date = date('Y-m-d'); // 오늘 날짜

  if (!$user_name || !$account_id) {
    throw new Exception('사용자 이름과 사용자 ID는 필수입니다.');
  }

  $pdo->beginTransaction();

  $stmt = $pdo->prepare("
    INSERT INTO users (user_name, account_id, email, phone, activation_status, role, reg_date)
    VALUES (:user_name, :account_id, :email, :phone, :activation_status, :role, :reg_date)
  ");
  $stmt->bindParam(':user_name', $user_name);
  $stmt->bindParam(':account_id', $account_id);
  $stmt->bindParam(':email', $email);
  $stmt->bindParam(':phone', $phone);
  $stmt->bindParam(':activation_status', $activation_status);
  $stmt->bindParam(':role', $authority);
  $stmt->bindParam(':reg_date', $reg_date);

  if (!$stmt->execute()) {
    throw new Exception('데이터 삽입 실패');
  }

  $user_id = $pdo->lastInsertId();

  $stmt = $pdo->prepare("
    INSERT INTO user_powerplants (user_id, powerplant_id)
    VALUES (:user_id, :powerplant_id)
  ");
  $stmt->bindParam(':user_id', $user_id);

  foreach ($powerplants as $powerplant_id) {
    $stmt->bindParam(':powerplant_id', $powerplant_id);
    if (!$stmt->execute()) {
      throw new Exception('발전소 데이터 삽입 실패');
    }
  }

  $pdo->commit();

  echo json_encode(['success' => true]);
} catch (PDOException $e) {
  $pdo->rollBack();
  error_log("데이터 삽입 오류: " . $e->getMessage());
  echo json_encode(['success' => false, 'error' => '입력 내용을 확인해주세요.']);
} catch (Exception $e) {
  $pdo->rollBack();
  error_log("일반 오류: " . $e->getMessage());
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

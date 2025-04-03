<?php
// add_powerplants.php
require_once '../config/config.php';
require_once '../config/db_config.php';
require_once 'redis_admin_update.php';

header('Content-Type: application/json');

try {
  // JSON 형식의 데이터를 가져오기
  $data = json_decode(file_get_contents('php://input'), true);

  if (json_last_error() !== JSON_ERROR_NONE) {
      throw new Exception('JSON 파싱 오류: ' . json_last_error_msg());
  }

  $powerplant_id = $data['powerplant_id'] ?? null;
  $powerplant_name = $data['powerplant_name'] ?? null;
  $address = $data['address'] ?? null;
  $reg_date = !empty($data['reg_date']) ? $data['reg_date'] : null;

  if (!$powerplant_id || !$powerplant_name) {
      throw new Exception('발전소 ID와 발전소 이름은 필수입니다.');
  }

  // 확인용 로그 추가
  error_log("Received data: " . print_r($data, true));

  $pdo->beginTransaction();

  // 중복 발전소 ID 체크 추가
  $stmt = $pdo->prepare("SELECT COUNT(*) FROM powerplants WHERE powerplant_id = :powerplant_id");
  $stmt->execute([':powerplant_id' => $powerplant_id]);
  if ($stmt->fetchColumn() > 0) {
      throw new Exception('이미 존재하는 발전소 ID입니다.');
  }

  // PDO를 사용하여 데이터베이스 연결
  $stmt = $pdo->prepare("INSERT INTO powerplants (powerplant_id, powerplant_name, address, reg_date) VALUES (:powerplant_id, :powerplant_name, :address, :reg_date)");
  $stmt->bindParam(':powerplant_id', $powerplant_id);
  $stmt->bindParam(':powerplant_name', $powerplant_name);
  $stmt->bindParam(':address', $address);
  if ($reg_date) {
      $stmt->bindParam(':reg_date', $reg_date);
  } else {
      $stmt->bindValue(':reg_date', null, PDO::PARAM_NULL);
  }

  if ($stmt->execute()) {
    $pdo->commit();  // 트랜잭션 커밋

    // Redis 업데이트 시도 및 결과 확인
    $redis_result = updateAdminRedisTimestamp($powerplant_id);
    
    // Redis 업데이트 결과를 직접 확인
    $redisKey = "{$powerplant_id}_admin_updated";
    $stored_value = $redis->get($redisKey);

    echo json_encode([
        'success' => true,
        'redis_update' => [
            'success' => $redis_result,
            'key' => $redisKey,
            'stored_value' => $stored_value,
            'timestamp' => date('Y-m-d H:i:s')
        ]
    ]);
  } else {
      throw new Exception('데이터 삽입 실패');
  }
} catch (PDOException $e) {
  if ($pdo->inTransaction()) {
      $pdo->rollBack();  // 트랜잭션 롤백
  }
  error_log("데이터 삽입 오류: " . $e->getMessage());
  echo json_encode(['success' => false, 'error' => '입력 내용을 확인해주세요.']);
} catch (Exception $e) {
  if ($pdo->inTransaction()) {
      $pdo->rollBack();  // 트랜잭션 롤백
  }
  error_log("일반 오류: " . $e->getMessage());
  echo json_encode(['success' => false, 'error' => $e->getMessage()]);
}
?>

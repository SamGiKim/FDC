<?php
header('Content-Type: application/json');

ini_set('display_errors', 1); // 디버깅을 위해 활성화
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

// 디버깅을 위한 로그
error_log("Received input: " . print_r($input, true));

if (!isset($input['powerplant_id']) || !isset($input['group_id']) || 
    !isset($input['fuelcell_id']) || !isset($input['files']) || !is_array($input['files'])) {
  echo json_encode([
    'success' => false, 
    'message' => '유효하지 않은 입력 데이터',
    'debug' => $input
  ]);
  exit;
}

try {
  $pdo = new PDO($dsn, $username, $password);
  $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

  $sql = "INSERT INTO api_normaldata (
    powerplant_id, 
    group_id, 
    fuelcell_id, 
    file_name, 
    type
  ) VALUES (
    :powerplant_id,
    :group_id,
    :fuelcell_id,
    :file_name,
    2
  )";
  $stmt = $pdo->prepare($sql);

  $pdo->beginTransaction();

  $insertedCount = 0;
  foreach ($input['files'] as $file) {
      try {
          $stmt->execute([
              ':powerplant_id' => $input['powerplant_id'],  // 추가
              ':group_id' => $input['group_id'],            // 추가
              ':fuelcell_id' => $input['fuelcell_id'],
              ':file_name' => $file
          ]);
          $insertedCount += $stmt->rowCount();
      } catch (PDOException $e) {
          error_log("Error inserting file {$file}: " . $e->getMessage());
          throw $e;
      }
  }

  $pdo->commit();
  echo json_encode([
    'success' => true, 
    'message' => "{$insertedCount}개의 파일이 성공적으로 추가되었습니다.",
    'debug' => [
        'inserted' => $insertedCount,
        'files' => $input['files']
    ]
  ]);
} catch (PDOException $e) {
  $pdo->rollBack();
  error_log("Database Error: " . $e->getMessage());
  echo json_encode([
    'success' => false, 
    'message' => '데이터베이스 오류: ' . $e->getMessage(),
    'debug' => [
        'sql_error' => $e->getMessage(),
        'sql_code' => $e->getCode()
    ]
  ]);
} catch (Exception $e) {
  error_log("General Error: " . $e->getMessage());
  echo json_encode([
    'success' => false, 
    'message' => '오류 발생: ' . $e->getMessage()
  ]);
}
?>
<?php
// update_DB_bop_diag_apply.php BOP 진단 적용의 모델 클릭시 
// 1. DB(api_modelapply) 업데이트
// 2. Redis 키값 업데이트 stkId_model_apply
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(0);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

// 필수 필드 검증
if (!isset($input['powerplant_id']) || 
    !isset($input['group_id']) || 
    !isset($input['fuelcell_id']) || 
    !isset($input['model_name'])) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 입력 데이터']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 먼저 해당 fuelcell_id가 존재하는지 확인
    $check_sql = "SELECT COUNT(*) FROM api_modelapply 
                WHERE powerplant_id= :powerplant_id 
                AND fuelcell_id = :fuelcell_id";
    $check_stmt = $pdo->prepare($check_sql);
    $check_stmt->execute([
        ':powerplant_id' => $input['powerplant_id'],
        ':fuelcell_id' => $input['fuelcell_id']
    ]);
    $exists = $check_stmt->fetchColumn();

    if ($exists) {
        // 레코드가 존재하면 UPDATE
        $sql = "UPDATE api_modelapply 
        SET model_name = :model_name,
            group_id = :group_id 
        WHERE powerplant_id = :powerplant_id 
        AND fuelcell_id = :fuelcell_id";
    } else {
        // 레코드가 존재하지 않으면 INSERT
        $sql = "INSERT INTO api_modelapply 
        (powerplant_id, group_id, fuelcell_id, model_name) 
        VALUES 
        (:powerplant_id, :group_id, :fuelcell_id, :model_name)";
        }

    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':powerplant_id' => $input['powerplant_id'],
        ':group_id' => $input['group_id'],
        ':fuelcell_id' => $input['fuelcell_id'],
        ':model_name' => $input['model_name']
    ]);

    echo json_encode(['success' => true, 'message' => '모델이 성공적으로 업데이트되었습니다.']);
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()]);
}
?>
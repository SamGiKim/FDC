<?php
// add_sensor_labeling_data.php [BOP 센서 라벨링 데이터] 추가
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

// 입력 데이터 검증에 history 추가
if (
    !isset($input['s_date']) ||
    !isset($input['e_date']) ||
    !isset($input['powerplant_id']) ||  
    !isset($input['group_id']) ||     
    !isset($input['fuelcell_id']) ||
    !isset($input['err_code']) ||
    !isset($input['err_name']) ||
    !isset($input['humidity']) ||
    !isset($input['temperture']) ||
    !isset($input['history'])
) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 입력 데이터']);
    exit;
}

// humidity와 temperture가 숫자인지 확인
if (!is_numeric($input['humidity']) || !is_numeric($input['temperture'])) {
    echo json_encode(['success' => false, 'message' => '온도와 습도는 숫자여야 합니다.']);
    exit;
}

try {
    // 데이터베이스 연결 설정
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 쿼리 준비에 history 추가
    $query = "INSERT INTO api_eventlist (
        s_date, e_date, 
        powerplant_id, group_id, fuelcell_id, 
        err_code, err_name, 
        humidity, temperture, history
    ) VALUES (
        :s_date, :e_date, 
        :powerplant_id, :group_id, :fuelcell_id, 
        :err_code, :err_name, 
        :humidity, :temperture, :history
    )";
    $stmt = $pdo->prepare($query);
    
    // 데이터 바인딩 및 쿼리 실행
    $stmt->bindParam(':s_date', $input['s_date']);
    $stmt->bindParam(':e_date', $input['e_date']);
    $stmt->bindParam(':powerplant_id', $input['powerplant_id']);
    $stmt->bindParam(':group_id', $input['group_id']);  
    $stmt->bindParam(':fuelcell_id', $input['fuelcell_id']);
    $stmt->bindParam(':err_code', $input['err_code']);
    $stmt->bindParam(':err_name', $input['err_name']);
    $stmt->bindParam(':humidity', $input['humidity']);
    $stmt->bindParam(':temperture', $input['temperture']);
    $stmt->bindParam(':history', $input['history']); // history 바인딩

    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "데이터가 성공적으로 저장되었습니다."]);
    } else {
        echo json_encode(["success" => false, "message" => "데이터 저장 중 오류가 발생했습니다: " . $stmt->errorInfo()[2]]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "데이터베이스 오류: " . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "오류 발생: " . $e->getMessage()]);
}

// 자원 해제
$stmt = null;
$pdo = null;
?>

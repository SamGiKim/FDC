<?php
// update_sensor_labeling_data.php [BOP 센서 라벨링 데이터] 업데이트
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

// 에러 코드와 이름 매핑
$errorCodeMapping = [
    0 => '정상',
    1 => 'MFM 전 누설',
    2 => 'MFM 후 누설',
    3 => '블로워',
    4 => '유량센서',
    5 => '압력센서',
    6 => '가습기',
    7 => '스택 입구 온도센서(물)',
    8 => '스택 출구 온도센서(물)',
    9 => '열교환기',
    10 => '1차 냉각수 펌프',
    11 => '2차 냉각수 펌프',
    12 => '스택 입구 온도센서(열)',
    13 => '스택 출구 온도센서(열)',
    14 => '열교환기 출구 온도센서'
];

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['id']) || !isset($input['err_code'])) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 입력 데이터']);
    exit;
}

$err_code = $input['err_code'];
$err_name = $errorCodeMapping[$err_code] ?? null;

if ($err_name === null) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 에러 코드']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $query = "UPDATE api_eventlist SET err_code = :err_code, err_name = :err_name, s_date = :s_date, e_date = :e_date, humidity = :humidity, temperture = :temperture, history = :history WHERE id = :id";
    $stmt = $pdo->prepare($query);
    
    $stmt->bindParam(':id', $input['id']);
    $stmt->bindParam(':err_code', $err_code);
    $stmt->bindParam(':err_name', $err_name);
    $stmt->bindParam(':s_date', $input['s_date']);
    $stmt->bindParam(':e_date', $input['e_date']);
    $stmt->bindParam(':humidity', $input['humidity']);
    $stmt->bindParam(':temperture', $input['temperture']);
    $stmt->bindParam(':history', $input['history']);
    
    if ($stmt->execute()) {
        echo json_encode(["success" => true, "message" => "라벨 정보가 성공적으로 업데이트되었습니다."]);
    } else {
        echo json_encode(["success" => false, "message" => "라벨 정보 업데이트 중 오류가 발생했습니다: " . $stmt->errorInfo()[2]]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "데이터베이스 오류: " . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(["success" => false, "message" => "오류 발생: " . $e->getMessage()]);
}

$stmt = null;
$pdo = null;
?>
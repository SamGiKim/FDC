<?php
// add_normal_data_file.php
// 파일추가 모달에서 선택된 데이터들을 api_normaldata에도 넣고, #normal-data-list-table의 tr에도 넣어줌
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(0);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['start_time']) || !isset($input['end_time'])) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 입력 데이터']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 날짜 형식 검증
    $start_time = date('Y-m-d H:i:s', strtotime($input['start_time']));
    $end_time = date('Y-m-d H:i:s', strtotime($input['end_time']));
    $fuelcell_id = $input['fuelcell_id'];

    if ($start_time === false || $end_time === false) {
        throw new Exception('잘못된 날짜 형식');
    }

    // 중복 검사는 UNIQUE KEY로 인해 필요 없음

    // 데이터 삽입
    $insert_sql = "INSERT INTO api_normaldata (fuelcell_id, start_time, end_time, type) VALUES (:fuelcell_id, :start_time, :end_time, 1)";
    $insert_stmt = $pdo->prepare($insert_sql);
    $insert_stmt->execute([
        ':fuelcell_id' => $fuelcell_id,
        ':start_time' => $start_time,
        ':end_time' => $end_time
    ]);

    echo json_encode(['success' => true, 'message' => '데이터가 성공적으로 추가되었습니다.']);
} catch (PDOException $e) {
    if ($e->getCode() == '23000') {
        echo json_encode(['success' => false, 'message' => '이미 존재하는 시간 범위입니다.']);
    } else {
        echo json_encode(['success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()]);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '오류 발생: ' . $e->getMessage()]);
}

?>
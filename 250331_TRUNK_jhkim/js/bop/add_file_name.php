<?php
// add_file_name.php
header('Content-Type: application/json');

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['file_name']) || !isset($input['selected_data']) || empty($input['selected_data'])) {
    echo json_encode(['success' => false, 'message' => '파일명 또는 선택된 데이터가 없습니다.']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->beginTransaction();

    $file_name = $input['file_name'];

    // file_name이 있을 때의 type 값을 1로, 없을 때를 0으로 설정
    $type = empty($file_name) ? 0 : 1;

    // normal_data 테이블 업데이트
    $update_sql = "UPDATE normal_data SET file_name = :file_name, type = :type WHERE id = :id";
    $update_stmt = $pdo->prepare($update_sql);

    foreach ($input['selected_data'] as $data) {
        $update_stmt->execute([
            ':file_name' => $file_name,
            ':type' => $type,
            ':id' => $data['id']
        ]);
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => '파일 이름이 성공적으로 추가되었습니다.']);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '오류 발생: ' . $e->getMessage()]);
}
?>
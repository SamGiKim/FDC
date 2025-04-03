<?php
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(0);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);

if (!isset($input['data']) || !is_array($input['data'])) {
    echo json_encode(['success' => false, 'message' => '유효하지 않은 입력 데이터']);
    exit;
}

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $sql = "DELETE FROM api_normaldata WHERE id = :id AND type = :type";
    $stmt = $pdo->prepare($sql);

    $pdo->beginTransaction();

    $deletedCount = 0;
    foreach ($input['data'] as $item) {
        if (isset($item['id']) && isset($item['type'])) {
            $stmt->execute([
                ':id' => $item['id'],
                ':type' => $item['type']
            ]);
            $deletedCount += $stmt->rowCount();
        }
    }

    $pdo->commit();
    echo json_encode(['success' => true, 'message' => "{$deletedCount}개의 데이터가 성공적으로 삭제되었습니다."]);
} catch (PDOException $e) {
    $pdo->rollBack();
    echo json_encode(['success' => false, 'message' => '데이터베이스 오류: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => '오류 발생: ' . $e->getMessage()]);
}
?>
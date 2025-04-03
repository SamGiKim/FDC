<?php
header('Content-Type: application/json');

require_once '../config/config.php';
require_once '../config/db_config.php';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    
    // 입력 데이터 받기
    $data = json_decode(file_get_contents('php://input'), true);
    
    // 데이터 유효성 검사
    if (!isset($data['dataNos']) || !is_array($data['dataNos']) || empty($data['dataNos'])) {
        echo json_encode([
            'success' => false,
            'error' => 'Invalid dataNos array',
            'received_data' => $data
        ]);
        exit;
    }

    $isBookmarkContext = isset($data['isBookmarkContext']) ? $data['isBookmarkContext'] : false;
    $bookmarkId = isset($data['bookmarkId']) ? $data['bookmarkId'] : null;

    $pdo->beginTransaction();

    try {
        if ($isBookmarkContext && $bookmarkId) {
            // 북마크 컨텍스트: bmk_sch 테이블에서만 데이터 삭제
            $placeholders = str_repeat('?,', count($data['dataNos']) - 1) . '?';
            $stmt = $pdo->prepare("DELETE FROM bmk_sch WHERE bmk_id = ? AND sch_id IN ($placeholders)");
            
            $params = array_merge([$bookmarkId], $data['dataNos']);
            $stmt->execute($params);
        } else {
            // 전체 항목 컨텍스트: bmk_sch와 search 테이블에서 모두 삭제
            // 1. 먼저 bmk_sch에서 참조 삭제
            $placeholders = str_repeat('?,', count($data['dataNos']) - 1) . '?';
            $stmt = $pdo->prepare("DELETE FROM bmk_sch WHERE sch_id IN ($placeholders)");
            $stmt->execute($data['dataNos']);

            // 2. search 테이블에서 데이터 삭제
            $stmt = $pdo->prepare("DELETE FROM search WHERE NO IN ($placeholders)");
            $stmt->execute($data['dataNos']);
        }

        $pdo->commit();
        echo json_encode([
            'success' => true,
            'message' => $isBookmarkContext ? '북마크에서 성공적으로 제거되었습니다.' : '데이터가 성공적으로 삭제되었습니다.',
            'context' => $isBookmarkContext ? 'bookmark' : 'all'
        ]);

    } catch (Exception $e) {
        $pdo->rollBack();
        echo json_encode([
            'success' => false,
            'error' => $e->getMessage(),
            'details' => '데이터베이스 작업 중 오류가 발생했습니다.'
        ]);
    }

} catch (Exception $e) {
    echo json_encode([
        'success' => false,
        'error' => $e->getMessage(),
        'details' => '데이터베이스 연결 중 오류가 발생했습니다.'
    ]);
}
?>
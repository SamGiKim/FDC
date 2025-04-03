<?php
header('Content-Type: application/json');

try {
    require_once '../config/config.php';
    require_once '../config/db_config.php';

    $data = json_decode(file_get_contents('php://input'), true);
    $no = $data['no'];
    $merr = $data['merr'];  // 문자열 그대로 저장

    $stmt = $pdo->prepare("UPDATE search SET MERR = :merr WHERE NO = :no");
    $result = $stmt->execute([
        ':merr' => $merr,
        ':no' => $no
    ]);

    if ($result) {
        echo json_encode([
            'success' => true,
            'message' => '에러 코드가 업데이트되었습니다.'
        ]);
    } else {
        throw new Exception('데이터베이스 업데이트 실패');
    }

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
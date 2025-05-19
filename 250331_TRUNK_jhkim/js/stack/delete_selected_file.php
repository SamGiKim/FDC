<?php
header('Content-Type: application/json');

try {
    require_once '../config/config.php';
    require_once '../config/db_config.php';

    $no = $_GET['no'];
    $sessionId = $_GET['sessionId'] ?? null;
    // DB에서 파일명 조회
    $stmt = $pdo->prepare("SELECT NAME FROM search WHERE NO = :no");
    $stmt->execute([':no' => $no]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        throw new Exception("데이터를 찾을 수 없습니다. (NO: {$no})");
    }

    $fileName = $row['NAME'];
    $directory = '/home/nstek/h2_system/FDC/SES/' . $sessionId . '/selected';
    
    // 해당 번호의 파일 찾기 (색상 코드가 포함된 파일명)
    $files = glob($directory . '/' . $fileName . "{*}");
        foreach ($files as $file) {
        if (is_file($file)) {
            if (!unlink($file)) {
                throw new Exception("파일 삭제 실패: " . $file);
            }
        }
    }

    echo json_encode([
        'success' => true,
        'message' => '파일 삭제 성공',
        'fileName' => $fileName,
        'files' => $files
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?> 
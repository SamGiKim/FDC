<?php
header('Content-Type: application/json'); // JSON 형식으로 응답

// 로그 설정
ini_set('log_errors', 1);
ini_set('display_errors', 1); // 오류를 화면에 표시
error_reporting(E_ALL);
ini_set('error_log', '/var/log/apache2/error.log');  

// 설정 파일 포함
require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

// JSON 입력 데이터 읽기
$data = json_decode(file_get_contents('php://input'), true);

// 데이터 유효성 검사
if (isset($data['no']) && isset($data['bigo'])) {
    $no = $data['no'];
    $bigo = $data['bigo'];

    try {
        // BIGO 필드 업데이트 쿼리
        $sql = "UPDATE search SET BIGO = :bigo WHERE NO = :no";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':bigo', $bigo, PDO::PARAM_STR);
        $stmt->bindParam(':no', $no, PDO::PARAM_INT);

        // SQL 쿼리 로그
        error_log("Executing SQL: $sql with BIGO = $bigo and NO = $no");

        if ($stmt->execute()) {
            echo json_encode(['success' => true]);
        } else {
            $errorInfo = $stmt->errorInfo();
            error_log("SQL Error: " . implode(", ", $errorInfo));
            echo json_encode(['success' => false, 'error' => 'Failed to execute query']);
        }
    } catch (PDOException $e) {
        error_log("SQL Exception: " . $e->getMessage());
        echo json_encode(['success' => false, 'error' => $e->getMessage()]);
    }
} else {
    error_log("Invalid input: " . json_encode($data));
    echo json_encode(['success' => false, 'error' => 'Invalid input']);
}

exit; // 스크립트 종료
?>
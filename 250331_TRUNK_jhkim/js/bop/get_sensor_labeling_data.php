<?php
header('Content-Type: application/json');

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

try {
    $input = json_decode(file_get_contents('php://input'), true);
    
    // 입력값 검증
    if (!isset($input['powerplant_id']) || !isset($input['fuelcell_id'])) {
        throw new Exception('필수 파라미터가 누락되었습니다.');
    }

    $powerplant_id = $input['powerplant_id'];
    $fuelcell_id = $input['fuelcell_id'];
    $err_code = $input['err_code'] ?? null;
    $page = isset($input['page']) ? (int)$input['page'] : 1;
    $itemsPerPage = isset($input['itemsPerPage']) ? (int)$input['itemsPerPage'] : 10;
    $offset = ($page - 1) * $itemsPerPage;

    // 디버깅을 위한 로그
    error_log('Received parameters: ' . print_r($input, true));

    // 기본 WHERE 조건
    $whereConditions = [
        "powerplant_id = :powerplant_id",
        "fuelcell_id = :fuelcell_id"
    ];
    $params = [
        ':powerplant_id' => $powerplant_id,
        ':fuelcell_id' => $fuelcell_id
    ];

    if ($err_code !== null) {
        $whereConditions[] = "err_code = :err_code";
        $params[':err_code'] = $err_code;
    }

    $whereClause = implode(" AND ", $whereConditions);

    // 쿼리 실행 전 로그
    error_log('Query conditions: ' . $whereClause);
    error_log('Query parameters: ' . print_r($params, true));

    // 전체 레코드 수 조회
    $countQuery = "SELECT COUNT(*) as total FROM api_eventlist WHERE " . $whereClause;
    $countStmt = $pdo->prepare($countQuery);
    $countStmt->execute($params);
    $total = $countStmt->fetch(PDO::FETCH_ASSOC)['total'];

    // 데이터 조회
    $query = "SELECT id, s_date, e_date, err_code, err_name, history, powerplant_id, fuelcell_id 
             FROM api_eventlist 
             WHERE " . $whereClause . "
             ORDER BY s_date DESC
             LIMIT :limit OFFSET :offset";
    
    $stmt = $pdo->prepare($query);
    
    foreach ($params as $key => $value) {
        $stmt->bindValue($key, $value);
    }
    $stmt->bindValue(':limit', $itemsPerPage, PDO::PARAM_INT);
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    
    $stmt->execute();
    $data = $stmt->fetchAll(PDO::FETCH_ASSOC);

    echo json_encode([
        "success" => true, 
        "data" => $data,
        "total" => $total,
        "currentPage" => $page,
        "itemsPerPage" => $itemsPerPage,
        "message" => "조회 완료"
    ]);

} catch (PDOException $e) {
    error_log('Database Error: ' . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "데이터베이스 오류: " . $e->getMessage()
    ]);
} catch (Exception $e) {
    error_log('General Error: ' . $e->getMessage());
    echo json_encode([
        "success" => false, 
        "message" => "오류 발생: " . $e->getMessage()
    ]);
}
?>
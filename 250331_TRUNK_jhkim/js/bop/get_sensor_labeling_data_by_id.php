<?php
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // 요청에서 data-id 가져오기
    $dataId = isset($_GET['id']) ? intval($_GET['id']) : 0;

    if ($dataId <= 0) {
        echo json_encode(['success' => false, 'message' => 'Invalid data ID']);
        exit;
    }

    // 데이터베이스에서 데이터 조회
    $query = "SELECT id, fuelcell_id, s_date, e_date, err_code, err_info, soh, err_name, history, humidity, temperture 
              FROM api_eventlist 
              WHERE id = :id";
    $stmt = $pdo->prepare($query);
    $stmt->bindParam(':id', $dataId, PDO::PARAM_INT);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        // null 값을 빈 문자열로 변환
        foreach ($row as $key => $value) {
            if (is_null($value)) {
                $row[$key] = '';
            }
        }

        echo json_encode(['success' => true, 'data' => $row]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No data found']);
    }
} catch (PDOException $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error: ' . $e->getMessage()]);
}

$stmt = null;
$pdo = null;
?>
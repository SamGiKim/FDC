<?php
// echo "<pre>";
// print_r($_GET);  // 받은 파라미터 확인
// echo "</pre>";

error_log("Received GET parameters: " . print_r($_GET, true));

// ini_set('display_errors', 0); // 프로덕션 환경에서는 오류 표시를 비활성화
// error_reporting(E_ALL);

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

// 설정 파일 포함
require_once '../config/config.php'; 
require_once '../config/db_config.php'; 

$getParams = $_GET;

$page = isset($getParams['page']) ? (int)$getParams['page'] : 1;
$perPage = isset($getParams['perPage']) && $getParams['perPage'] !== 'all-data' ? intval($getParams['perPage']) : 100;
$offset = ($page - 1) * $perPage;
$powerplant_id = isset($getParams['powerplant_id']) ? $getParams['powerplant_id'] : 'SE01';
$fuelcell_id = isset($getParams['fuelcell_id']) ? $getParams['fuelcell_id'] : 'F002'; // 기본값 설정

// error_log("페이지: $page, 페이지당 항목 수: $perPage, 오프셋: $offset");

$bookmarkId = isset($getParams['bookmarkId']) ? intval($getParams['bookmarkId']) : null;
$type = isset($getParams['type']) ? $getParams['type'] : 'SIN'; // SIN인지 PULSE인지, 기본값은 SIN

// 커스텀 로그 파일 설정
$logFile = __DIR__ . '/debug.log';

// 로깅 함수
function writeLog($message) {
    global $logFile;
    $timestamp = date('Y-m-d H:i:s');
    $logMessage = "[$timestamp] $message\n";
    file_put_contents($logFile, $logMessage, FILE_APPEND);
}

// 요청 파라미터 로깅
writeLog("Request parameters: " . print_r($_GET, true));

try {
    $pdo = new PDO($dsn, $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    $pdo->exec("SET NAMES utf8mb4");

    $conditions = [];
    $params = [];

    $conditions[] = "search.powerplant_id = :powerplant_id";
    $params['powerplant_id'] = $powerplant_id;

    $conditions[] = "search.fuelcell_id = :fuelcell_id";
    $params['fuelcell_id'] = $fuelcell_id;

    // SIN, PULSE, NPULSE, CALIB에 따라 조건 추가(search 테이블의 SIN 컬럼이 0이면 sin, 1이면 pulse, 2이면 npulse, 3이면 calib)
    if ($type === 'SIN') {
        $conditions[] = "search.SIN = 0";
    } else if ($type === 'PULSE') {
        $conditions[] = "search.SIN = 1";
    } else if ($type === 'NPULSE') {
        $conditions[] = "search.SIN = 2";
    } else if ($type === 'CALIB') {
        $conditions[] = "search.SIN = 3";
    }

    // 북마크 ID 처리 부분
    if (!is_null($bookmarkId)) {
        // 북마크와 관련 테이블 조인
        $query .= " INNER JOIN bmk_sch ON search.NO = bmk_sch.sch_id";
        
        // 조건 추가
        $conditions[] = "bmk_sch.bmk_id = :bookmarkId";
        $params['bookmarkId'] = $bookmarkId;
        
        // 로그 추가
        error_log("북마크 필터링: bookmarkId = {$bookmarkId}, powerplant_id = {$powerplant_id}, fuelcell_id = {$fuelcell_id}");
    }

    if (!empty($getParams['start-date'])) {
        $startDate = str_replace("T", " ", substr($getParams['start-date'], 0, 16)) . ":00";
        $conditions[] = "`DATE` >= :startDate";
        $params['startDate'] = $startDate;
    }
    if (!empty($getParams['end-date'])) {
        $endDate = str_replace("T", " ", substr($getParams['end-date'], 0, 16)) . ":00.999999";
        $conditions[] = "`E_DATE` <= :endDate";
        $params['endDate'] = $endDate;
    }
    if (isset($getParams['LABEL']) && !empty($getParams['LABEL'])) {
        $labelValue = urldecode($getParams['LABEL']);
        $keywords = explode(' ', $labelValue);
        $keywords = array_filter($keywords, 'trim');
        
        if (!empty($keywords)) {
            $labelConditions = [];
            foreach ($keywords as $index => $keyword) {
                $paramName = "label{$index}";
                $labelConditions[] = "LABEL LIKE :{$paramName}";
                $params[$paramName] = "%{$keyword}%";
            }
            $conditions[] = "(" . implode(" AND ", $labelConditions) . ")";
        }
    }

      // BIGO 검색 조건 처리
      if (isset($getParams['BIGO']) && !empty($getParams['BIGO'])) {
        $searchValue = $getParams['BIGO'];
        // '#'으로 키워드 분리하고 빈 문자열 제거
        $keywords = array_filter(explode('#', $searchValue));
        
        if (!empty($keywords)) {
            $bigoConditions = [];
            foreach ($keywords as $index => $keyword) {
                $paramName = "bigo{$index}";
                $bigoConditions[] = "BIGO LIKE :{$paramName}";
                $params[$paramName] = "%{$keyword}%";
            }
            $conditions[] = "(" . implode(" AND ", $bigoConditions) . ")";
        }
    }

    // MERR 조건 추가
    if (isset($getParams['MERR']) && $getParams['MERR'] !== '') {
        $conditions[] = "MERR = :merr";
        $params['merr'] = $getParams['MERR'];
    }

    foreach ($getParams as $key => $value) {
        if (strpos($key, 'Condition') !== false) {
            $actualField = str_replace('Condition', '', $key);
            $conditionType = $value;
            $paramName = str_replace('-', '_', $actualField);

            // 필드 이름 매핑 추가
            $fieldMapping = [
                'M-L' => '`M-L`',
                'x1' => 'X1',
                'x2' => 'X2',
                'y1' => 'Y1',
                'y2' => 'Y2',
                'From' => 'hzFROM',
                'To' => 'hzTO',
                'Err' => 'MERR',
                'LABEL' => 'LABEL',
            ];

            $fieldName = isset($fieldMapping[$actualField]) ? $fieldMapping[$actualField] : "`$actualField`";
            $actualValue = $getParams[$actualField];

            if ($conditionType == 'over') {
                $conditions[] = "$fieldName > :condition_$paramName";
                $params['condition_' . $paramName] = $actualValue;
            } elseif ($conditionType == 'under') {
                $conditions[] = "$fieldName < :condition_$paramName";
                $params['condition_' . $paramName] = $actualValue;
            }
        }
    }

    if ($type === 'SIN') {
        $query = "SELECT DISTINCT search.NO, search.DATE, search.E_DATE, search.`M-L`, 
                  search.x1, search.x2, search.y1, search.y2, 
                  search.hzFROM, search.hzTO, search.MERR, search.LABEL, search.BIGO
                  FROM search";
    } else if ($type === 'PULSE') {
        $query = "SELECT DISTINCT search.NO, search.DATE, search.hzFROM, search.hzTO, 
                  search.RISE, search.APEX, search.DIFF, search.DEG, 
                  search.RATE, search.MERR, search.BIGO
                  FROM search";
    } else if ($type === 'NPULSE') {
        $query = "SELECT DISTINCT search.NO, search.DATE, search.hzFROM, search.hzTO, 
                  search.RISE, search.APEX, search.DIFF, search.DEG, 
                  search.RATE, search.MERR, search.BIGO
                  FROM search";
    } else if ($type === 'CALIB') {
        $query = "SELECT DISTINCT search.NO, search.DATE, search.hzFROM, search.hzTO, 
                  search.`M-L`, search.X1, search.X2, search.MERR, search.BIGO
                  FROM search";
    }
    $query .= " LEFT JOIN bmk_sch ON search.NO = bmk_sch.sch_id";
    if (!empty($conditions)) {
        $query .= " WHERE " . implode(' AND ', $conditions);
    }
    $query .= " ORDER BY DATE DESC LIMIT :offset, :perPage";

    $stmt = $pdo->prepare($query);
    foreach ($params as $key => $val) {
        $stmt->bindValue(":{$key}", $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }
    $stmt->bindValue(':offset', $offset, PDO::PARAM_INT);
    $stmt->bindValue(':perPage', $perPage, PDO::PARAM_INT);

    $countQuery = "SELECT COUNT(DISTINCT search.NO) FROM search";
    $countQuery .= " LEFT JOIN bmk_sch ON search.NO = bmk_sch.sch_id";
    if (!empty($conditions)) {
        $countQuery .= " WHERE " . implode(' AND ', $conditions);
    }
    $countStmt = $pdo->prepare($countQuery);
    foreach ($params as $key => $val) {
        $countStmt->bindValue(":{$key}", $val, is_int($val) ? PDO::PARAM_INT : PDO::PARAM_STR);
    }


    

    $countStmt->execute();
    $totalRows = $countStmt->fetchColumn();


    $stmt->execute();
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);


    array_walk_recursive($results, function(&$item) {
        // $item이 null이 아닌 경우에만 인코딩 감지
        if ($item !== null && !mb_detect_encoding($item, 'utf-8', true)) {
            $item = utf8_encode($item);
        }
    });

    echo json_encode(['data' => $results, 'totalRows' => $totalRows]);

} catch (PDOException $e) {
    error_log("Error in get_bookmark.php: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error: ' . $e->getMessage()]);
} catch (Exception $e) {
    error_log("General error: " . $e->getMessage());
    http_response_code(500);
    echo json_encode(['error' => 'Internal Server Error: ' . $e->getMessage()]);
}
?>

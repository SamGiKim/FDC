<?php
header('Content-Type: application/json');

try {
    require_once '../config/config.php';
    require_once '../config/db_config.php';

    $no = $_GET['no'];
    $color = $_GET['color'] ?? '5BBCFF';
    $powerplant_id = $_GET['powerplant_id'];
    $fuelcell_id = $_GET['fuelcell_id'];
    $isRawData = isset($_GET['isRawData']) && $_GET['isRawData'] === 'true';
    $color = str_replace("#", "", $color);
    $type = $_GET['type'] ?? '';
    $sessionId = $_GET['sessionId'] ?? null;

    // DB에서 데이터 조회
    $stmt = $pdo->prepare("SELECT NAME, X1, X2, Y1, Y2, DATE FROM search WHERE NO = :no");
    $stmt->execute([':no' => $no]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        throw new Exception("데이터를 찾을 수 없습니다. (NO: {$no})");
    }

    // 파일명 정리 및 인코딩 처리 
    $fileName = str_replace(["\r", "\n"], "", $row['NAME']);
    $fileName = urldecode($fileName);
    // RAW 파일일 경우 'post_' 접두어 제거하고 인코딩 처리 없이 그대로 사용
    if ($isRawData) {
        $fileName = str_replace('post_', '', $fileName);
    }

    // 현재 인코딩 확인 및 변환
    $currentEncoding = mb_detect_encoding($fileName, ['UTF-8', 'EUC-KR', 'ISO-8859-1'], true);
    if ($currentEncoding !== 'UTF-8') {
        $fileName = iconv($currentEncoding, 'UTF-8//IGNORE', $fileName);
    }

    // DB에서 가져온 날짜로 년도와 월 추출
    $dbDate = strtotime($row['DATE']);
    $year = date('Y', $dbDate);
    $month = date('m', $dbDate);

    if ($type === 'SIN') {
        if ($isRawData) {
            $sourcePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/EIS/$year/$month/$fileName";
            $alternativeSourcePath = "/home/nstek/h2_system/FDC/$fuelcell_id/EIS/$year/$month/$fileName";
        } else {
            $sourcePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/EIS/$year/$month/post_data/$fileName";
            $alternativeSourcePath = "/home/nstek/h2_system/FDC/$fuelcell_id/EIS/$year/$month/post_data/$fileName";
        }
    } elseif ($type === 'CALIB') {
        if ($isRawData) {
            $sourcePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/EIS/CALIBRATION/$fileName";
            $alternativeSourcePath = "/home/nstek/h2_system/FDC/$fuelcell_id/EIS/CALIBRATION/$fileName";
        } else {
            $sourcePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/EIS/CALIBRATION/post_data/$fileName";
            $alternativeSourcePath = "/home/nstek/h2_system/FDC/$fuelcell_id/EIS/CALIBRATION/post_data/$fileName";
        }
    } else {
        throw new Exception("지원하지 않는 type입니다: $type");
    }

    // 파일 접근 가능 여부 확인
    if (!is_readable($sourcePath) && !is_readable($alternativeSourcePath)) {
        if (file_exists($sourcePath) || file_exists($alternativeSourcePath)) {
            throw new Exception("파일 접근 권한이 없습니다:\n첫 번째 경로: {$sourcePath}\n두 번째 경로: {$alternativeSourcePath}");
        } else {
            throw new Exception($isRawData ? "Raw Data가 없습니다" : "파일을 찾을 수 없습니다:\n첫 번째 경로: {$sourcePath}\n두 번째 경로: {$alternativeSourcePath}");
        }
    }

    $actualPath = file_exists($sourcePath) ? $sourcePath : $alternativeSourcePath;

    // 세션 디렉토리 설정
    $baseDir = '/home/nstek/h2_system/FDC/SES/';
    $sessionDir = $baseDir . $sessionId . '/selected';
    if (!is_dir($sessionDir)) {
        mkdir($sessionDir, 0755, true);
    }

    $hasCopied = false; 
    // 디렉토리 내 파일 목록을 가져와서 검사
    foreach (scandir($sessionDir) as $existingFile) {
        if (strpos($existingFile, $fileName . '{') === 0) {
            $hasCopied = true;
            break;
        }
    }

    if (!$hasCopied) {
        $fileNameWithColor = $fileName . "{" . $color . "}";
        $destinationPath = $sessionDir . '/' . $fileNameWithColor;

        if (!copy($actualPath, $destinationPath)) {
            throw new Exception("파일 복사 실패: {$actualPath} -> {$destinationPath}");
        }
    }

    // imp 데이터 파일 읽기
    $dataRows = [];
    if (($handle = fopen($actualPath, "r")) !== false) {
        while (($line = fgets($handle)) !== false) {
            $line = trim($line);
            if (preg_match('/^[\d.eE+\-]+\s+[\d.eE+\-]+\s+[\d.eE+\-]+$/', $line)) {
                $parts = preg_split('/\s+/', $line);
                if (count($parts) >= 3) {
                    $hz = floatval($parts[0]);
                    $x  = floatval($parts[1]);
                    $y  = floatval($parts[2]);
                    $dataRows[] = [$hz, $x, $y];
                }
            }
        }
        fclose($handle);
    } else {
        throw new Exception("파일을 열 수 없습니다: $actualPath");
    }

    // 응답용으로만 파일명 인코딩
    $row['NAME'] = urlencode($fileName);

    echo json_encode([
        'success' => true,
        'message' => '파일 복사 성공',
        'fileName' => $row['NAME'] . "{" . $color . "}",
        'X1' => $row['X1'],
        'X2' => $row['X2'],
        'Y1' => $row['Y1'],
        'Y2' => $row['Y2'],
        'data' => $dataRows
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>

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

    // DB에서 데이터 조회
    $stmt = $pdo->prepare("SELECT NAME, X1, X2, Y1, Y2, DATE FROM search WHERE NO = :no");
    $stmt->execute([':no' => $no]);
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$row) {
        throw new Exception("데이터를 찾을 수 없습니다. (NO: {$no})");
    }

    // 파일명 인코딩 처리 강화
    $fileName = $row['NAME'];
    $fileName = str_replace("\r", "", $fileName);
    $fileName = str_replace("\n", "", $fileName);
    
    if ($isRawData) {
        // RAW 파일일 경우 'post_' 접두어 제거하고 인코딩 처리 없이 그대로 사용
        $fileName = str_replace('post_', '', $fileName);
    } else {
        // RAW가 아닌 경우 인코딩 처리
        $currentEncoding = mb_detect_encoding($fileName, ['UTF-8', 'EUC-KR', 'ISO-8859-1'], true);
        if ($currentEncoding !== 'UTF-8') {
            $fileName = iconv($currentEncoding, 'UTF-8//IGNORE', $fileName);
        }
    }
    

    // 현재 인코딩 확인 및 변환
    $currentEncoding = mb_detect_encoding($fileName, ['UTF-8', 'EUC-KR', 'ISO-8859-1'], true);
    if ($currentEncoding !== 'UTF-8') {
        $fileName = iconv($currentEncoding, 'UTF-8//IGNORE', $fileName);
    }

    // URL 안전한 파일명으로 변환
    $fileName = urlencode($fileName);

    $row['NAME'] = $fileName;

    // DB에서 가져온 날짜로 년도와 월 추출
    $dbDate = strtotime($row['DATE']);
    $year = date('Y', $dbDate);
    $month = date('m', $dbDate);

    if($type ==='SIN'){
        if ($isRawData) {
            $sourcePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/EIS/$year/$month/" . $row['NAME'];
            $alternativeSourcePath = "/home/nstek/h2_system/FDC/$fuelcell_id/EIS/$year/$month/" . $row['NAME'];
        } else {
            $sourcePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/EIS/$year/$month/post_data/" . $row['NAME'];
            $alternativeSourcePath = "/home/nstek/h2_system/FDC/$fuelcell_id/EIS/$year/$month/post_data/" . $row['NAME'];
        }
    } else if ($type === 'CALIB') {
        if ($isRawData) {
            $sourcePath = "/home/nstek/h2_system/RAW/$powerplant_id/$fuelcell_id/EIS/$year/$month/" . $row['NAME'];
            $alternativeSourcePath = "/home/nstek/h2_system/RAW/$fuelcell_id/EIS/$year/$month/" . $row['NAME'];
        } else {
            $sourcePath = "/home/nstek/h2_system/RAW/$powerplant_id/$fuelcell_id/EIS/$year/$month/post_data/" . $row['NAME'];
            $alternativeSourcePath = "/home/nstek/h2_system/RAW/$fuelcell_id/EIS/$year/$month/post_data/" . $row['NAME'];
        }
    }
    
    // 파일 존재 및 권한 확인 로직 개선
    if (!is_readable($sourcePath) && !is_readable($alternativeSourcePath)) {
        // 파일이 존재하는지 먼저 확인
        if (file_exists($sourcePath) || file_exists($alternativeSourcePath)) {
            throw new Exception("파일 접근 권한이 없습니다 (Permission denied):\n첫 번째 경로: {$sourcePath}\n두 번째 경로: {$alternativeSourcePath}");
        } else {
            if ($isRawData) {
                throw new Exception("Raw Data가 없습니다");
            } else {
                throw new Exception("파일을 찾을 수 없습니다:\n첫 번째 경로: {$sourcePath}\n두 번째 경로: {$alternativeSourcePath}");
            }
        }
    }


    $actualPath = file_exists($sourcePath) ? $sourcePath : $alternativeSourcePath;
    $fileNameWithColor = $row['NAME'] . "{" . $color . "}";
    $destinationPath = '/home/nstek/h2_system/patch_active/FDC/work/bjy/impedance/selected/' . $fileNameWithColor;

    if (!copy($actualPath, $destinationPath)) {
        throw new Exception("파일 복사 실패: {$actualPath} -> {$destinationPath}");
    }

    echo json_encode([
        'success' => true,
        'message' => '파일 복사 성공',
        'fileName' => $fileNameWithColor,
        'X1' => $row['X1'],
        'X2' => $row['X2'],
        'Y1' => $row['Y1'],
        'Y2' => $row['Y2']
    ]);

} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
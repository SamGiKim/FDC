<?php
header('Content-Type: application/json');

ini_set('display_errors', 0);
error_reporting(0);

require_once '../config/config.php';
require_once '../config/db_config.php';

$input = json_decode(file_get_contents('php://input'), true);
$powerplant_id = $input['powerplant_id'];
$group_id = $input['group_id'];
$fuelcell_id = $input['fuelcell_id'];
$files = $input['files'];
$existingDateTimes = $input['existingDateTimes'];

try {
    $pdo->beginTransaction();
    
    $stmt = $pdo->prepare("INSERT INTO api_normaldata (
        powerplant_id, 
        group_id, 
        fuelcell_id, 
        start_time, 
        end_time, 
        type
    ) VALUES (?, ?, ?, ?, ?, 1)");

    $duplicates = [];
    $added = [];
    
    foreach ($files as $file) {
        $filePath = "/home/nstek/h2_system/FDC/$powerplant_id/$fuelcell_id/BOP/NORMAL/$file";
        $content = file_get_contents($filePath);
        $lines = explode("\n", $content);
        array_shift($lines);
        
        foreach ($lines as $line) {
            if (empty(trim($line))) continue;
            
            $data = str_getcsv($line);
            if (count($data) >= 6) {
                $f_date = $data[2];
                $s_time = str_replace('-', ':', $data[3]);
                $e_time = str_replace('-', ':', $data[4]);
                
                // 화면의 날짜/시간과 비교
                $isDuplicate = false;
                foreach ($existingDateTimes as $existing) {
                    if ($existing['date'] === $f_date && 
                        $existing['startTime'] === $s_time && 
                        $existing['endTime'] === $e_time) {
                        $duplicates[] = "$f_date $s_time~$e_time";
                        $isDuplicate = true;
                        break;
                    }
                }
                
                if (!$isDuplicate) {
                    $start_time = date('Y-m-d H:i:s', strtotime("$f_date $s_time"));
                    $end_time = date('Y-m-d H:i:s', strtotime("$f_date $e_time"));
                    
                    $stmt->execute([
                        $powerplant_id,
                        $group_id,
                        $fuelcell_id,
                        $start_time,
                        $end_time
                    ]);
                    
                    if ($stmt->rowCount() > 0) {
                        $added[] = "$f_date $s_time~$e_time";
                    }
                }
            }
        }
    }

    $pdo->commit();

    echo json_encode([
        'success' => true,
        'duplicates' => array_values(array_unique($duplicates)),
        'added' => array_values(array_unique($added)),
        'message' => '데이터 처리가 완료되었습니다.'
    ]);
    
} catch (Exception $e) {
    $pdo->rollBack();
    echo json_encode([
        'success' => false, 
        'message' => '데이터 추가 중 오류가 발생했습니다: ' . $e->getMessage()
    ]);
}
?>
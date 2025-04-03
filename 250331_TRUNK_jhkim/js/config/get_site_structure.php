<?php
require_once './config.php';
require_once './db_config.php';

header('Content-Type: application/json');

try {
    if (!isset($_GET['powerplants'])) {
        throw new Exception('발전소 목록이 필요합니다');
    }

    $powerplants = explode(',', $_GET['powerplants']);
    $powerplants = array_map('trim', $powerplants);
    
    if (empty($powerplants)) {
        throw new Exception('유효한 발전소 목록이 없습니다');
    }

    $placeholders = str_repeat('?,', count($powerplants) - 1) . '?';
    
    $query = "
        SELECT 
            p.powerplant_id,
            p.powerplant_name,
            g.group_id,
            g.group_name,
            f.fuelcell_id,
            f.fuelcell_name
        FROM powerplants p
        LEFT JOIN fuelcell_groups g ON p.powerplant_id = g.powerplant_id
        LEFT JOIN fuelcells f ON g.group_id = f.group_id
        WHERE p.powerplant_id IN ($placeholders)
        ORDER BY p.powerplant_id, g.group_id, f.fuelcell_id
    ";

    $stmt = $pdo->prepare($query);
    $stmt->execute($powerplants);
    $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 계층 구조로 데이터 변환
    $structure = [];
    $fuelcellConfig = [];
    
    foreach ($results as $row) {
        // 사이트 구조 구성
        if (!isset($structure[$row['powerplant_id']])) {
            $structure[$row['powerplant_id']] = [
                'name' => $row['powerplant_name'],
                'groups' => []
            ];
        }
        
        if ($row['group_id'] && !isset($structure[$row['powerplant_id']]['groups'][$row['group_id']])) {
            $structure[$row['powerplant_id']]['groups'][$row['group_id']] = [
                'name' => $row['group_name'],
                'fuelcells' => []
            ];
        }
        
        if ($row['fuelcell_id']) {
            $structure[$row['powerplant_id']]['groups'][$row['group_id']]['fuelcells'][$row['fuelcell_id']] = [
                'name' => $row['fuelcell_name'],
                'fuelcell' => $row['fuelcell_id']
            ];

            // fuelcellConfig 구성
            $fuelcellConfig[$row['fuelcell_id']] = [
              'name' => $row['fuelcell_name'],
              'plant' => $row['powerplant_id'],
              'plantName' => $row['powerplant_name'],  // 발전소 이름 추가
              'group' => $row['group_id'],
              'groupName' => $row['group_name'],       // 그룹 이름 추가
              'fuelcell' => $row['fuelcell_id']
          ];
        }
    }

    // 첫 번째 연료전지를 기본값으로 설정
    $defaultFuelcell = array_key_first($fuelcellConfig);

    echo json_encode([
        'success' => true,
        'structure' => $structure,
        'fuelcellConfig' => $fuelcellConfig,
        'defaultFuelcell' => $defaultFuelcell
    ]);

} catch (Exception $e) {
    error_log("Site Structure Error: " . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => $e->getMessage()
    ]);
}
?>
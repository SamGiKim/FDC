<?php
// get_groups_by_powerplant.php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

require_once '../config/config.php';
require_once '../config/db_config.php';

header('Content-Type: application/json');

// powerplant_id를 GET 파라미터로 받음
$powerplant_id = isset($_GET['powerplant_id']) ? $_GET['powerplant_id'] : '';

if (empty($powerplant_id)) {
    echo json_encode([
        "success" => false,
        "message" => "발전소 ID가 제공되지 않았습니다.",
        "groups" => []  // 빈 배열로 초기화
    ]);
    exit;
}

try {
    // 특정 발전소에 속한 연료전지 그룹 정보 가져오기
    $stmt = $pdo->prepare("
        SELECT 
            fg.group_id,
            fg.group_name,
            fg.powerplant_id,
            fg.reg_date,
            fg.e_group_capacity,
            fg.t_group_capacity,
            p.powerplant_name
        FROM fuelcell_groups fg
        JOIN powerplants p ON fg.powerplant_id = p.powerplant_id
        WHERE fg.powerplant_id = :powerplant_id
        ORDER BY fg.group_name
    ");
    
    $stmt->bindParam(':powerplant_id', $powerplant_id, PDO::PARAM_STR);
    $stmt->execute();
    $groups = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // 각 그룹에 속한 연료전지 정보도 가져오기
    foreach ($groups as &$group) {
        $stmt = $pdo->prepare("
            SELECT 
                f.fuelcell_id,
                f.fuelcell_name,
                f.e_capacity,
                f.t_capacity
            FROM fuelcells f
            WHERE f.group_id = :group_id
            ORDER BY f.fuelcell_name
        ");
        
        $stmt->bindParam(':group_id', $group['group_id'], PDO::PARAM_STR);
        $stmt->execute();
        $group['fuelcells'] = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        // 연료전지 ID 목록 생성
        $group['fuelcell_ids'] = array_column($group['fuelcells'], 'fuelcell_id');
    }

    // 디버깅용 로그
    error_log("Powerplant ID: " . $powerplant_id);
    error_log("Found groups: " . json_encode($groups));

 // 데이터가 없을 경우에도 success true로 반환하고 빈 배열 전송
 echo json_encode([
    'success' => true,
    'message' => empty($groups) ? '등록된 그룹이 없습니다.' : '',
    'groups' => $groups ?: []  // 결과가 없으면 빈 배열 반환
]);

} catch (PDOException $e) {
error_log("데이터 가져오기 오류: " . $e->getMessage());
echo json_encode([
    'success' => false,
    'error' => "데이터 가져오기 오류가 발생했습니다.",
    'message' => $e->getMessage(),
    'groups' => []  // 에러 시에도 빈 배열 반환
]);
}
?>
<?php
// get_progress.php 프로그레스바 정보 가져오기

// Redis 연결 설정
$redis = new Redis();
$redis->connect('127.0.0.1', 6379);

// 요청된 스택 ID 가져오기
$selectedStkId = isset($_GET['stkId']) ? $_GET['stkId'] : null;

if ($selectedStkId) {
    $progressKey = "{$selectedStkId}_vf_progress"; // 프로그레스 키 설정
    $progressData = $redis->get($progressKey); // Redis에서 데이터 가져오기

    if ($progressData) {
        // Redis에서 가져온 데이터는 JSON 문자열이므로, 이를 배열로 변환
        $progressArray = json_decode($progressData, true);

        // 필요한 데이터 추출
        $responseData = [
            'total' => $progressArray['total'] ?? 0,
            'done' => $progressArray['done'] ?? 0,
            'percent' => $progressArray['percent'] ?? 0,
            'status' => $progressArray['status'] ?? '',
            'file' => $progressArray['file'] ?? '',
            'time' => $progressArray['time'] ?? ''
        ];

        // JSON 형식으로 응답
        header('Content-Type: application/json');
        echo json_encode(['success' => true, 'data' => $responseData]);
    } else {
        echo json_encode(['success' => false, 'error' => 'No progress data found.']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'No stack ID provided.']);
}
?>
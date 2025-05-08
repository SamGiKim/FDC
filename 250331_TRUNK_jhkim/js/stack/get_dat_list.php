<?php
header('Content-Type: application/json');

// 'file' 파라미터가 있는지 확인 (파일 내용 가져오는 경우)
if (isset($_GET['file'])) {
    $filePath = $_GET['file'];

    // 파일 경로가 제공되지 않았으면 오류 반환
    if (!$filePath) {
        http_response_code(400);
        echo json_encode(['error' => '파일 경로가 제공되지 않았습니다.']);
        exit;
    }

    // basePath 설정
    $basePath = '/home/nstek/h2_system/RAW/';
    // 실제 경로로 변환
    $targetFile = realpath($basePath . $filePath);

    // basePath 밖으로 접근을 제한하고, 파일이 존재하는지 확인
    if (strpos($targetFile, realpath($basePath)) !== 0 || !file_exists($targetFile)) {
        http_response_code(403);
        echo json_encode(['error' => '유효하지 않은 파일 경로입니다.']);
        exit;
    }

    // .dat 파일 읽기
    $fileContents = file_get_contents($targetFile);
    echo json_encode(['fileContent' => $fileContents]);

    exit;
}

// 'dir' 파라미터가 있는지 확인 (파일 목록 가져오는 경우)
if (isset($_GET['dir'])) {
    $relativeDir = $_GET['dir'];

    if (!$relativeDir) {
        http_response_code(400);
        echo json_encode(['error' => '디렉토리 경로가 제공되지 않았습니다.']);
        exit;
    }

    // basePath 설정
    $basePath = '/home/nstek/h2_system/RAW/';
    $targetDir = realpath($basePath . $relativeDir);

    // basePath 밖으로 접근을 제한하고, 디렉토리 존재 확인
    if (strpos($targetDir, realpath($basePath)) !== 0 || !is_dir($targetDir)) {
        http_response_code(403);
        echo json_encode(['error' => '유효하지 않은 디렉토리 경로입니다.']);
        exit;
    }

    // .dat 파일 목록 가져오기
    $files = array_values(array_filter(scandir($targetDir), function ($file) use ($targetDir) {
        return is_file("$targetDir/$file") && pathinfo($file, PATHINFO_EXTENSION) === 'dat';
    }));

    echo json_encode($files);

    exit;
}
?>

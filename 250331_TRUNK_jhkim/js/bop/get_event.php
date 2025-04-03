<?php

header('Content-Type: text/plain');

ini_set('display_errors', 0);
error_reporting(0);

require_once '../config/config.php';
require_once '../config/db_config.php';

// GET 파라미터 받기
$year = $_GET['y'];
$month = $_GET['m'];
$day = $_GET['d'];

$powerplant_id = $_GET['powerplant_id'];
$fuelcell_id = $_GET['fuelcell_id'];

// >>> 241128 hjkim - 이벤트 마커 안나오는 문제
$qs = parse_str( parse_url($_SERVER["HTTP_REFERER"], PHP_URL_QUERY), $kv); $powerplant_id = $kv['plant']; $fuelcell_id = $kv['fuelcell'];
// <<< 241128 hjkim - 이벤트 마커 안나오는 문제

// 날짜 형식 만들기
$date = sprintf("%04d-%02d-%02d", $year, $month, $day);

// 데이터베이스 연결
$conn = new mysqli($servername, $username, $password, $dbname);

// 연결 확인
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// api_eventlist 쿼리 수정 - powerplant_id 추가
$sql_eventlist = "SELECT * FROM api_eventlist 
                 WHERE DATE(s_date) = ? 
                 AND powerplant_id = ? 
                 AND fuelcell_id = ?";
$stmt_eventlist = $conn->prepare($sql_eventlist);
$stmt_eventlist->bind_param("sss", $date, $powerplant_id, $fuelcell_id);

// search 쿼리 준비
$sql_search = "SELECT * FROM search 
              WHERE DATE(DATE) = ? 
              AND powerplant_id = ? 
              AND fuelcell_id = ?";
$stmt_search = $conn->prepare($sql_search);
$stmt_search->bind_param("sss", $date, $powerplant_id, $fuelcell_id);

// api_eventlist 쿼리 실행 및 표준 출력으로 쓰기
$stmt_eventlist->execute();
$result_eventlist = $stmt_eventlist->get_result();

while ($row = $result_eventlist->fetch_assoc()) {
    $s_date = date("Y-m-d H:i:s", strtotime($row['s_date']));
    $e_date = date("Y-m-d H:i:s", strtotime($row['e_date']));
    $event_type = "FT"; // 고정값
    $value = "40"; // 고정값
    $line = "0,$s_date,$e_date,$event_type,$value,{$row['err_code']},{$row['history']}\n";
    echo $line;
}

// search 쿼리 실행 및 표준 출력으로 쓰기
$stmt_search->execute();
$result_search = $stmt_search->get_result();

while ($row = $result_search->fetch_assoc()) {
  $date_time = date("Y-m-d H:i:s", strtotime($row['DATE']));
  
  // E_DATE 컬럼이 있고 값이 있는 경우 사용, 그렇지 않으면 20분 후로 설정
  if (isset($row['E_DATE']) && !empty($row['E_DATE'])) {
      $end_time = date("Y-m-d H:i:s", strtotime($row['E_DATE']));
  } else {
      $end_time = date("Y-m-d H:i:s", strtotime($row['DATE']) + 1200); // 20분 = 1200초
  }
  
  $event_type = "FT"; // 고정값
  $value = "40"; // 고정값
  $additional_info = "{$row['CI']},{$row['STM']},{$row['hzFROM']},{$row['hzTO']}";
  $line = "1,$date_time,$end_time,$event_type,$value,{$row['MERR']},{$row['BIGO']},$additional_info\n";
  echo $line;
}

// 데이터베이스 연결 닫기
$stmt_eventlist->close();
$stmt_search->close();
$conn->close();

?>

<?php

error_reporting(E_ALL);
ini_set('display_errors', TRUE);
ini_set('display_startup_errors', TRUE);

// 오토 클래스 로딩
include_once(__DIR__."/login_module__include/setup.php");
$PATH_INFO = pathinfo($_SERVER['REQUEST_URI'], PATHINFO_DIRNAME);
// CONSTS---- ----------------------------------------
// >>> 250306 hjkim - warning 제거
//if($SUCCESS_URL == false) { $SUCCESS_URL = "{$PATH_INFO}/index-front.html"; /* 인증 성공 후, 리다이렉트 할 페이지 */ }
if(isset($SUCCESS_URL) == false) { $SUCCESS_URL = "{$PATH_INFO}/index-front.html"; /* 인증 성공 후, 리다이렉트 할 페이지 */ }
// <<< 250306 hjkim - warning 제거
$LOGIN_URL 		= "login.php";
$SESSION_DIR 	= "session";
//if(is_dir($SESSION_DIR) == false) { echo "${SESSION_DIR} 폴더를 www-data or apache 권한으로 생성해 주시오."; exit(); }
$PASS_DIR 		= "etc/passwd";

// ARGUMENTS -----------------------------------------
//$_FILENAME		= $argv[0];
//$_IP            = $argv[1];	// 아파치 포워딩일 경우 127.0.0.1 로 찍힘
//$_IP			= $_SERVER["REMOTE_ADDR"];
//$_METHOD 		= $argv[2];
$_METHOD 		= $_SERVER["REQUEST_METHOD"];
//parse_str($argv[3], $_QS);
parse_str($_SERVER['QUERY_STRING'], $_QS);
//parse_str($argv[4], $_PAYLOAD);
//$_COOKIE 		= Cookie::parse($argv[5]);
//$_XFF 			= $argv[6]; // 아파치 포워딩을 받을 경우 클라이언트 IP가 찍힘

// LOGIN PROCESS -------------------------------------

// >>> 241125 hjkim - 로그인 요청 파라미터 검증
if(trim($_QS['LOGIN_ID']) == "") { bad_400(); exit; }
if(trim($_QS['LOGIN_PASS']) == "") { bad_400(); exit; }
if(trim($_QS['CPUB_ID']) == "") { bad_400(); exit; }
// <<< 241125 hjkim - 로그인 요청 파라미터 검증

// (6) auth.php에서 (ID/PASS 검증) 
$ec_veri = new Elliptic\EC("secp256k1");

// (6a) passwd 파일에서 LOGIN_ID를 찾아 LOGIN_PASS 검사
// >>> 250225 hjkim - DB Users 테이블의 특정행을 읽고 활성화 여부 체크와 비밀번호 검증을 할 수 있다.
//$pass_obj = new Passwd($PASS_DIR);
//$pass = $pass_obj->get_pass($_QS['LOGIN_ID']);
$pass = get_pass_from_db($_QS['COMPANY_CODE'], $_QS['LOGIN_ID']);
// <<< 250225 hjkim - DB Users 테이블의 특정행을 읽고 활성화 여부 체크와 비밀번호 검증을 할 수 있다.

// (6a2) passwd 파일에 ID가 없으면, 로그인 실패
if($pass == null) { unauth_401(); login_fail(); }

// (6a1) passwd 파일에 있으면, CPUB_ID로 LOGIN_PASS를 passwd 파일의 비번내용과 비교해서 검증
$veri_key = $ec_veri->keyFromPublic($_QS['CPUB_ID'], 'hex');
$veri_result = $veri_key->verify(bin2hex($pass), $_QS['LOGIN_PASS']);

// >>> 241125 hjkim - 내부서버용 상태응답 코드 추가
if( ($_SERVER['REMOTE_ADDR'] == $_SERVER['SERVER_ADDR']) ) { // 내부 python 장고 요청이라면,
	if($veri_result == true) { ok_200(); }
	else { unauth_401(); }
	exit;
}
// <<< 241125 hjkim - 내부서버용 상태응답 코드 추가

// (6a1a) 검증 성공이면, 세션 저장 
if($veri_result == true) { 
	echo "Login Success.";
	
	// >>> (6a1a) /session 폴더에 파일명이 SESS_ID이고 내용이 SIGNED_IP인 파일 생성
	// >>> 250306 hjkim - warning 제거
	if( !file_exists($SESSION_DIR) ) {
		mkdir($SESSION_DIR, 0777, true);
	}
	//file_put_contents($SESSION_DIR."/".$_COOKIE['SESS_ID'], $_COOKIE['SIGNED_IP']);
	// <<< 250306 hjkim - warning 제거
	
	// <<< (6a1a) /session 폴더에 파일명이 SESS_ID이고 내용이 SIGNED_IP인 파일 생성

	// >>> 250225 hjkim - Redis에 세션ID를 키값으로 세션정보를 저장할 수 있다.
	save_sess_info($_COOKIE['SESS_ID'], $_QS['COMPANY_CODE'], $_QS['LOGIN_ID'], $_SERVER['REMOTE_ADDR']);
	// <<< 250225 hjkim - Redis에 세션ID를 키값으로 세션정보를 저장할 수 있다.
	
	echo "<script>";
	echo "location.href = '{$SUCCESS_URL}';";
	echo "</script>";

} 
// (6a1b) 검증 실패이면, 로그인 실패
else { unauth_401(); login_fail(); }

/* -------------------------------------------------------------------------- */
/*                                FUNCTION SET                                */
/* -------------------------------------------------------------------------- */
// >>> 241125 hjkim - 401 Unauthorize
function ok_200() { http_response_code(200); echo "OK"; }
function unauth_401() { http_response_code(401); echo "Unauthorized"; }
function bad_400() { http_response_code(400); echo "Bad Request"; }
function err_500() { http_response_code(500); echo "Internal Server Error"; }
function timeout_504() { http_response_code(504); echo "Gateway Timeout"; }
// <<< 241125 hjkim - 401 Unauthorize

function login_fail() {
	echo "Login Fail.";
	echo "<script>";
	echo "	history.back();";
	echo "</script>";
	exit;
}

// >>> 250225 hjkim - DB Users 테이블의 특정행을 읽고 활성화 여부 체크와 비밀번호 검증을 할 수 있다.
function get_pass_from_db($company_id, $account_id) {
	if(trim($account_id) == "") return null;
	$dbconn = mysqli_connect("localhost", "root", "coffee", "FDC");
	$sql = "SELECT account_pw FROM users WHERE account_id = '{$account_id}' ";
	if(trim($company_id) != "") $sql.= " AND company_id = '{$company_id}' ";
	$result = mysqli_query($dbconn, $sql);
	$r = mysqli_fetch_all($result, MYSQLI_ASSOC);
	if($r == null) { return null; }
	mysqli_close($dbconn);
	return $r[0]['account_pw'];
}
// <<< 250225 hjkim - DB Users 테이블의 특정행을 읽고 활성화 여부 체크와 비밀번호 검증을 할 수 있다.

// >>> 250225 hjkim - Redis에 세션ID를 키값으로 세션정보를 저장할 수 있다.
function save_sess_info($sess_id, $company_id, $account_id, $user_ip) {
	// key 		= session:{key}
	// format 	= JSON
	// { 
	// "company_id"		: "회사정보", 
	// "account_id"		: "ID 정보",
	// "account_role"	: "권한 정보",
	// >>> 250226 hjkim - Scope Permission
	// "account_powerplants" : ["SE01", "BU01", ...]
	// <<< 250226 hjkim - Scope Permission
	// "session_ipaddr" : "세션 IP 정보",
	// "session_created_at" : "UNIXTIME"
	// 

	// DB연결
	$dbconn = mysqli_connect("localhost", "root", "coffee", "FDC");
	if($dbconn == false) { err_500(); }
	$sql = "SELECT * FROM users WHERE account_id = '{$account_id}' ";
	if(trim($company_id) != "") $sql.= " AND company_id = '{$company_id}' ";

	// DB질의
	$result = mysqli_query($dbconn, $sql);
	$r = mysqli_fetch_all($result, MYSQLI_ASSOC);
	if($r == null || 1 < sizeof($r)) { err_500(); }
	$role = $r[0]['role']; // Admin, LocalAdmin, User
	
	// >>> 250226 hjkim - Scope Permission
	$sql2 = "SELECT powerplant_id FROM user_powerplants WHERE account_id = '{$account_id}' ";
	$result2 = mysqli_query($dbconn, $sql2);
	$r2 = mysqli_fetch_all($result2, MYSQLI_NUM );
	if($r2 == null) { err_500(); }
	$scope_permission = array_merge(...$r2);
	// <<< 250226 hjkim - Scope Permission
	
	mysqli_close($dbconn);

	// REDIS 연결
	$redis = new Redis();
	$res1 = $redis->connect('127.0.0.1', 6379);
	$res2 = $redis->select(1);
	if($res1 == false || $res2 == false) { err_500(); }
	$json = array(
		"company_id" => $company_id, "account_id" => $account_id, "account_role" => $role,
		// >>> 250226 hjkim - Scope Permission
		"account_powerplants" => $scope_permission,
		// <<< 250226 hjkim - Scope Permission
		"session_ipaddr" => $user_ip, "session_created_at" => time()
	);
	$json_str = json_encode($json);
	$res3 = $redis->set("session:".$sess_id, $json_str, ['ex' => 86400] ); // 1일
	if($res3 == false) { err_500(); }

	$redis->close();
}
// <<< 250225 hjkim - Redis에 세션ID를 키값으로 세션정보를 저장할 수 있다.

?>

<?php

// 오토 클래스 로딩
include_once(__DIR__."/login_module__include/setup.php");

// CONSTS---- ----------------------------------------
$SESSION_DIR = "session"; // session 폴더의 권한이 www-data 이여야 함.
//if(is_dir($SESSION_DIR) == false) { echo "${SESSION_DIR} 폴더를 www-data or apache 권한으로 생성해 주시오."; exit(); }
$PASS_DIR = "etc/passwd";

// ARGUMENTS -----------------------------------------
$_METHOD 		= $_SERVER["REQUEST_METHOD"];
parse_str($_SERVER['QUERY_STRING'], $_QS);

if($_GET["action"] == "logout") {
	logout("login.php");
}

auth();

// AUTH PROCESS -------------------------------------
function auth($SUCCESS_URL="index.php", $FAIL_URL="login.php", $LOGIN_URL="login.php") {
	global $SESSION_DIR;
	$IS_LOGIN = ($_METHOD == "GET" && $_QS['LOGIN_ID'] != null && $_QS['CPUB_ID'] != null && $_QS['LOGIN_PASS']);

	// AUTH PROCESS ---------------------------------------
	// 로그인 후 인증 관련 처리
	if($_COOKIE['SESS_ID'] == null) { auth_fail($LOGIN_URL); }
	$sess_info = get_sess_info($_COOKIE['SESS_ID']);
	if($sess_info == null) { auth_fail($LOGIN_URL); }
	else { /* PASS */ }
	
}

// FUNCTION SET ---------------------------------------
function auth_fail($LOGIN_URL) {
	echo "<script>";
	echo "	location.href = '{$LOGIN_URL}';";
	echo "</script>";
	exit;
}

// 20240603 로그아웃 추가 mjkoo
function logout($LOGIN_URL) {
	global $SESSION_DIR;

	// 세션 파일 삭제
	if (isset($_COOKIE['SESS_ID'])) {
			$sessionFile = $SESSION_DIR . "/" . $_COOKIE['SESS_ID'];
			if (file_exists($sessionFile)) {
					unlink($sessionFile);
			}
	}

	// 쿠키 삭제
	if (isset($_COOKIE['SESS_ID'])) {
			setcookie("SESS_ID", "", time() - 3600, "/");
	}
	if (isset($_COOKIE['SIGNED_IP'])) {
			setcookie("SIGNED_IP", "", time() - 3600, "/");
	}

	// 로그인 페이지로 리다이렉트
	//global $LOGIN_URL;
	echo "<script>location.href = '{$LOGIN_URL}';</script>";
	exit;
}

function get_sess_info($sess_id) {
	
	// REDIS 연결
	$redis = new Redis();
	$res1 = $redis->connect('127.0.0.1', 6379);
	$res2 = $redis->select(1);
	if($res1 == false || $res2 == false) { err_500(); }
	$res3 = $redis->get("session:".$sess_id);
	if($res3 == null) { unauth_401(); return null; }
	$r_arr = json_decode($res3);	
	$redis->close();
	return $r_arr;
}	

function ok_200() { http_response_code(200); echo "OK"; }
function unauth_401() { http_response_code(401); echo "Unauthorized"; }
function bad_400() { http_response_code(400); echo "Bad Request"; }
function err_500() { http_response_code(500); echo "Internal Server Error"; }
function timeout_504() { http_response_code(504); echo "Gateway Timeout"; }

?>

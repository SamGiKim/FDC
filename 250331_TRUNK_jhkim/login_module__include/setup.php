<?php
const DEBUG = 0;
const INCLUDE_PATH = __DIR__;
// const INCLUDE_PATH = "/home/nstek/h2_system/patch_active/.ecc_php/include";
// const INCLUDE_PATH = '/usr/lib/qosd/www/html/include';

function mlaphp_autoloader($class) {
	$class = ltrim($class, '\\');
	$subpath = '';
	$pos = strrpos($class, '\\');
	if($pos !== false) {
		$ns = substr($class, 0, $pos);
		$subpath = str_replace('\\', DIRECTORY_SEPARATOR, $ns) . DIRECTORY_SEPARATOR;
		$class = substr($class, $pos + 1);
	}
	$subpath .= str_replace('_', DIRECTORY_SEPARATOR, $class);
	$dir = INCLUDE_PATH;
	$file = $dir . DIRECTORY_SEPARATOR . $subpath . '.php';
	//echo $file . "<br>";
	include $file;
}

// register it with SPL
spl_autoload_register('mlaphp_autoloader');

if(DEBUG) {
	var_dump($_SERVER); 	echo "<br><br>";
	var_dump($GLOBALS); 	echo "<br><br>";
	var_dump($_REQUEST); 	echo "<br><br>";
	var_dump($_POST); 	echo "<br><br>";
	var_dump($_GET);	echo "<br><br>";
	var_dump($_FILES);	echo "<br><br>";
	var_dump($_ENV);	echo "<br><br>";
	var_dump($_COOKIE);	echo "<br><br>";
	var_dump($_SESSION);	echo "<br><br>";
}
?>

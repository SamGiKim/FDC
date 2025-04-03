<?php
class Cookie {
    public static function parse($cookie_str) {
        $r = [];
        $arr = explode(";", $cookie_str);
        // var_dump($arr);
        for($i = 0; $i < sizeof($arr); $i++) {
            $kv = explode("=", $arr[$i]);
            // var_dump($kv);
            $r[trim($kv[0])] = trim($kv[1]);
        }
        return $r;
    }
}
?>
<?php

class Passwd {
    private $filename = "/etc/passwd";
    private $table = [];
    public function __construct($path) {
        $this->filename = $path;
        $content = file_get_contents($this->filename);
        $this->parse($content);
    }

    private function parse($txt) {
        $rows = explode("\n", $txt);
        for($i = 0; $i < sizeof($rows); $i++) {
            $row = trim($rows[$i]);
            if($row[0] == "#" || $row[0] == "") continue;
            $row_col = explode(":", $row);
            array_push($this->table, array(
                'id'        => trim($row_col[0]),
                'pass'      => trim($row_col[1]),
                'gid'       => trim($row_col[2]),
                'uid'       => trim($row_col[3]),
                'comment'   => trim($row_col[4]),
                'access'    => trim($row_col[5]),
                'cgi'       => trim($row_col[6])
            ));
        }
        return $this->table;
    }

    public function get_pass($_id) {
        for($i = 0; $i < sizeof($this->table); $i++) {
            if($this->table[$i]['id'] == $_id) {
                return $this->table[$i]['pass'];
            }
        }
        return null;
    }
}

?>
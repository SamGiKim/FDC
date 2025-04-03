<?php
// pagination.php
require_once '../config/config.php';
require_once '../config/db_config.php';

function render_pagination($current_page, $selected_items_per_page, $table_name, $db) {
    // 전체 데이터 수 조회
    $query = "SELECT COUNT(*) as total FROM $table_name";
    $result = $db->query($query);
    $row = $result->fetch_assoc();
    $total_items = $row['total'];
    $total_pages = ceil($total_items / $selected_items_per_page);

    // 페이지네이션 렌더링
    echo '<div>';
    echo '<div class="pagination-wrap-outer">';
    echo '<nav class="pagination-wrap">';
    echo '<ul class="pagination" id="stack-search-pagination">';
    echo '<li class="page-item"><a class="page-link" href="#">&laquo;</a></li>';

    for ($i = 1; $i <= $total_pages; $i++) {
        $active = ($i == $current_page) ? 'active' : '';
        echo "<li class=\"page-item\"><a class=\"page-link $active\" href=\"#\">$i</a></li>";
    }

    echo '<li class="page-item"><a class="page-link" href="#">&raquo;</a></li>';
    echo '</ul>';
    echo '</nav>';
    echo '</div>';
    echo '<div class="data-num-select">';
    echo '<select id="items-per-page">';
    
    $items_per_page_options = ['all-data' => '전체', '100' => '100개', '50' => '50개', '30' => '30개', '10' => '10개'];
    foreach ($items_per_page_options as $value => $label) {
        $selected = ($value == $selected_items_per_page) ? 'selected' : '';
        echo "<option value=\"$value\" $selected>$label</option>";
    }

    echo '</select>';
    echo '</div>';
    echo '</div>';
}
?>
<?php
session_start();

$data = json_decode(file_get_contents('php://input'), true);
if (isset($data['company_id'])) {
    $_SESSION['current_db'] = $data['company_id'];
}

echo json_encode(['success' => true]);
?>
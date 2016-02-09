<?php 

$data = array();
$data['status'] = 'OK';

header('Content-Type: application/json');
echo json_encode($data);
exit;

 ?>
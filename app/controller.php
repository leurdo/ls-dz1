<?php 

$data = array();

$data['object'] = $_POST;

header('Content-Type: application/json');
echo json_encode($data);

exit();

 ?>
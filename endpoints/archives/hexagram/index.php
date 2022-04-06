<?php
// REST endpoint
$str = '';
if ($_SERVER['REQUEST_METHOD']==='POST') {

  if (!class_exists('BOC_Admin')) {
    include_once '../../../profile/includes/classes/boc_admin.php';
  }
  if (!class_exists('BOC_REST_Router')) {
    include_once '../../../profile/includes/classes/boc_rest_router.php';
  }
  //
  $admin = new BOC_Admin();
  //
  if ($admin->is_logged_in()) {
    //
    $data = json_decode(file_get_contents("php://input"));
    print_r($data);
    $router = new BOC_REST_Router();
    $router->post_archive('hexagram','hex_index',$data);
    //
    $str .= ' your post routed ';
    echo $str;
    die();
    //
  } else {
    $str .= ' your session expired ';
    echo $str;
    die();
  }
  //
} else {
  $str = ' a bell is a cup until it is struck ';
  echo $str;
  die();
}






?>

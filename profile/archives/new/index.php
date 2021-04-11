<?php
if (!class_exists('BOC_Admin')) {
  include_once '../../includes/classes/boc_admin.php';
}
if (!class_exists('BOC_Util')) {
  include_once '../../includes/classes/boc_util.php';
}
if (!class_exists('BOC_DB_Control')) {
  include_once '../../includes/classes/boc_db_control.php';
}
if (!class_exists('BOC_Users')) {
  include_once '../../includes/classes/boc_users.php';
}
if (!class_exists('BOC_Archive')) {
  include_once '../../includes/classes/boc_archive.php';
}

include '../../includes/records/boc_data.php';

$util = new BOC_Util();
$admin = new BOC_Admin();
$db_client = new BOC_DB_Control();

$err = null;
$modal = '';
$result = array('resp'=>null,'err'=>null);

$fields = $util->sort_fields(
  $_POST,
  ['hex_index','msg_hexagram','addressee','body','mvng_lines'],
  ['number','hexagram','to','message','moving lines']
);

//$admin->get_permission(1,true,'/book-of-changes/profile/');
if (!empty($_POST)) {

  if (empty($fields->err_arr['addressee'])) {

    $type = ( empty($fields->err_arr['msg_hexagram']) ) ?
      'hexmsg' :  ( empty($fields->err_arr['hex_index']) ) ?
      'hexagram' : 'txtmsg';

    $hex_index = ( empty($fields->err_arr['msg_hexagram']) ) ?
      array_search($fields->vals_arr['msg_hexagram'],$hex_data->names_arr) :
      ( empty($fields->err_arr['hex_index']) ) ? $fields->vals_arr['hex_index'] : 0;

    $moving_lines = ( empty($fields->err_arr['mvng_lines']) ) ?
       $fields->vals_arr['mvng_lines'] : [];

    $addressee = ( empty($fields->err_arr['addressee']) ) ?
      $fields->vals_arr['addressee'] : '';

    $body = ( empty($fields->err_arr['body']) ) ? $fields->vals_arr['body'] : '';

    $archive = new BOC_Archive(
      $hex_index,
      $_SESSION['user'],
      $type,
      $fields->vals_arr['addressee'],
      $fields->vals_arr['body'],
      $moving_lines,
      $db_client
    );
    if ($archive) {
      header("Location: /book-of-changes/profile/users/?resp=$ype");
    }  else {
      header("Location: /book-of-changes/profile/users/?inv=-1");
    }
  } else {
    header("Location: /book-of-changes/profile/users/?inv=1");
  }
} else {
  header("Location: /book-of-changes/profile/users/");
}




?>

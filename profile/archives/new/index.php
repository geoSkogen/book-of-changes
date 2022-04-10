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
$data = $_POST;

$fields = $util->sort_fields(
  $data,
  ['hex_index','msg_hexagram','addressee','body','mvng_lines'],
  ['number','hexagram','to','message','moving lines']
);

$redir_uri = (empty($fields->err_arr['hex_index'])) ? '' : 'profile/';
$redir_arg = '?inv=0';

$admin->get_permission(1,true,"/book-of-changes/$redir_uri$redir_arg");

if (!empty($_POST)) {
  // a message, etc. can't exist without an addressee --
  if (empty($fields->err_arr['addressee'])) {
    // none of the forms posting to this API address is identical -
    // the presence of cetain fields in the post superglobal indicates its type
    $type = 'txtmsg';
    if (is_numeric($fields->vals_arr['msg_hexagram']) && intval($fields->vals_arr['msg_hexagram']) > 0 ) {
      $hex_index = $fields->vals_arr['msg_hexagram'];
      $type = 'hexmsg';
    }
    if (is_numeric($fields->vals_arr['hex_index']) && intval($fields->vals_arr['msg_hexagram']) > 0 ) {
      $hex_index = $fields->vals_arr['hex_index'];
      $type = 'hexagram';
    }

    $moving_lines = ( empty($fields->err_arr['mvng_lines']) ) ?
       $fields->vals_arr['mvng_lines'] : [];

    // instatiate the object and database table row
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
      //print_r($fields);
      header("Location: /book-of-changes/profile/users/?resp=$type");
    }  else {
      header("Location: /book-of-changes/profile/users/?inv=-no_archive");
    }
  } else {
    header("Location: /book-of-changes/profile/users/?inv=no_addressee");
  }
} else {
  header("Location: /book-of-changes/profile/users/");
}

?>

<?php
if (!class_exists('BOC_Admin')) {
  include_once '../includes/classes/boc_admin.php';
}
if (!class_exists('BOC_Util')) {
  include_once '../includes/classes/boc_util.php';
}
if (!class_exists('BOC_DB_Control')) {
  include_once '../includes/classes/boc_db_control.php';
}

if (!class_exists('BOC_User')) {
  include_once '../includes/classes/boc_user.php';
}

function sort_fields($post) {
  $err_arr = array();
  $atts_arr = array();
  $vals_arr = array();
  $fields = ['u_name','email','edit_u_name','edit_email'];
  foreach( $fields as $field) {
    if ( !empty($post) && !empty($post[$field]) ) {
      $vals_arr[$field] = $post[$field];
    } else {
      $err_arr[$field] = true;
    }
  }
  return (object)array(
    'vals_arr'=>$vals_arr, 'err_arr'=>$err_arr
  );
}
print_r($_POST);
// globals - check form and login states
$fields = sort_fields($_POST);

if ( !count(array_keys($fields->err_arr)) ) {

  $db = new BOC_DB_Control();
  $user = new BOC_User($fields->vals_arr['u_name'],$db);
  $names = ['u_name','email'];
  for ($i = 0; $i < count($names); $i++) {
    if ( $fields->vals_arr[$names[$i]] !=
         $fields->vals_arr['edit_' . $names[$i]] ) {
      $assoc[$names[$i]] = $fields->vals_arr['edit_' . $names[$i]];
    }
  }

  $user->edit_user($assoc);

}


?>

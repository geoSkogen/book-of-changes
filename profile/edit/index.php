<?php
if (!class_exists('BOC_Admin')) {
  include_once '../includes/classes/boc_admin.php';
}

if (!class_exists('BOC_DB_Control')) {
  include_once '../includes/classes/boc_db_control.php';
}

if (!class_exists('BOC_User')) {
  include_once '../includes/classes/boc_user.php';
}
// local function - custom validation
function sort_fields($post) {
  $err_arr = array();
  $update_assoc = array();
  $vals_arr = array();
  $fields = ['u_name','email','edit_u_name','edit_email'];
  foreach( $fields as $field) {
    // ensure we're not working w/ undefineds
    if ( !empty($post) && !empty($post[$field]) ) {
      // record the assigned post values only
      $vals_arr[$field] = $post[$field];
      // and in the first half of the form only -
      if ( array_search($field,$fields) < (count($fields)/2) ) {
        // check if the vals in the second half don't match
        if ($post[$field]!=$post['edit_'.$field]) {
          // then add them to the values for the db query
          $update_assoc[$field] = $post['edit_'.$field];
        }
      }
    } else {
      $err_arr[$field] = true;
    }
  }
  return (object)array(
    'vals_arr'=>$vals_arr, 'err_arr'=>$err_arr, 'update_assoc'=>$update_assoc
  );
}
//print_r($_POST);
// globals - check form and login states
$admin = new BOC_Admin();
$admin->get_permission(1,true,'/book-of-changes/profile/');
}
$fields = sort_fields( $_POST);
// no empty fields
if ( !count(array_keys($fields->err_arr)) ) {

  $db = new BOC_DB_Control();
  $user = new BOC_User($fields->vals_arr['u_name'],$db);

  $user->edit_user($fields->update_assoc);

  if (!$user) {
    // redirect with 'error' query var
    header('Location: /book-of-changes/profile/?inv=-1');
  } else {
    // remember to tell the session the user name updated
    $_SESSION['user'] = (!empty($fields->update_assoc['u_name'])) ?
      $fields->update_assoc['u_name'] : $_SESSION['user'];
    // build success query vars for the client-side-script
    $arg_str = '#/';
    $begin_header = 'Location: /book-of-changes/profile/';
    foreach( array_keys($fields->update_assoc) as $key ) {
      $arg_str .= ( array_search($key,array_keys($fields->update_assoc)) ) ? '/' : '';
      $arg_str .= strval(array_search($key,array_keys($fields->update_assoc)));
    }
    // redirect with dynamic query var string
    header($begin_header . $arg_str);
  }
} else {
  // redirect with 'error' query var
  header('Location: /book-of-changes/profile/?inv=-1');
}


?>

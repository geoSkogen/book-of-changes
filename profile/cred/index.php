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

include '../includes/templates/creds.php';

$admin = new BOC_Admin();
if (!$admin->is_logged_in()) {
  //header('Location: /book-of-changes/profile/');
}
// incorporate into util object as static method ? use field arrs as args . . .
function sort_fields($post) {
  $err_arr = array();
  $atts_arr = array();
  $vals_arr = array();
  $fields = ['u_name','p_word','new_p_word','renew_p_word'];
  $placeholders = ['user name','current password','new password','re-type new password'];
  foreach( $fields as $field) {
    if ( !empty($post) && !empty($post[$field]) ) {
      $atts_arr[$field] = 'value';
      $vals_arr[$field] = $post[$field];
    } else {
      $err_arr[$field] = true;
      //
      $atts_arr[$field] = 'placeholder';
      $vals_arr[$field] = $placeholders[array_search($field,$fields)];
    }
  }
  return (object)array(
    'atts_arr'=>$atts_arr,'vals_arr'=>$vals_arr, 'err_arr'=>$err_arr
  );
}

// globals - check form and login states

$fields = sort_fields($_POST);
$err = null;
$result = array('resp'=>null,'err'=>null);
$admin = new BOC_Admin();
// amy submission
if (!empty($_POST)) {
  if (!count(array_keys($fields->err_arr))) {
    // valid fields - try login
    $db = new BOC_DB_Control();
    $user = new BOC_User($_POST['u_name'],$db);
    $result['resp'] = $user->update_user(
      array('p_word'=>$fields->$vals_arr['new_p_word'])
    );
    $result['err'] = (!$result['resp']) ? 1 : $result['err'];
  } else {
    $fields->err_arr = [];
  }
} else {
  $err = 4;
}

// objectify the form template
$templater = $creds->update_form;
// begin document
BOC_Util::do_doc_head_element(['../../style/profile.css'],'Change Password');
BOC_Util::do_page_header('');

echo $creds->header;
// pass form status arguments to the template executable
$templater('index.php',$err,$fields->atts_arr,$fields->vals_arr,$fields->err_arr);
//
BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../../script/nav-modal.js']);

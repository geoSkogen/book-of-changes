<?php
// data controllers
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
// template resource
include '../includes/templates/new_profile.php';

$util = new BOC_Util();
$admin = new BOC_Admin();

$err = null;
$modal = '';
$result = array('resp'=>null,'err'=>null);

$fields = $util->sort_fields(
  $_POST,
  ['email','u_name','p_word_1','p_word_2'],
  ['email address','user name','password','re-enter password']
);

if ($admin->is_logged_in()) {
  //header('Location: /book-of-changes/profile/');
}

if (!empty($_POST)) {
  // passwords don't match
  if ( !empty($_POST['p_word_1']) && !empty($_POST['p_word_2']) ) {
    if ($_POST['p_word_1'] != $_POST['p_word_2'] ) {
      $err = 3;
      $fields->err_arr['p_word_2'] = true;
      $fields->err_arr['p_word_1'] = true;
    }
  }
  // no empty fields, correct formats
  if (!count(array_keys($fields->err_arr))) {
  // instantiate data controllers & try data insert
    $db_client = new BOC_DB_Control();
    $user = new BOC_User('',$db_client);
    $result = $user->create_user(
      $_POST['u_name'],$_POST['p_word_1'],$_POST['email']
    );
    $err = $result['err'];
    //print('err');
    //print($err);
  } else {

    $err = ($err) ? $err : 5;
  }
  // objectify modal template executables & pass them error codes
  $messenger = $new_profile->message;
  $modaler = $new_profile->modal;
  $message = $messenger($_POST['u_name'],$err);
  $modal = $modaler($message,$err);
  print($message);
} else {
  $fields->err_arr = [];
}
// DOM
// objectify the form template
$templater = $new_profile->form;
// begin document
BOC_Util::do_doc_head_element(['../../style/profile.css'],'Create Profile');
BOC_Util::do_page_header($modal);
// pass form status arguments to the template executable
$templater('index.php',$err,$fields->atts_arr,$fields->vals_arr,$fields->err_arr);
//
BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../../script/nav-modal.js']);




?>

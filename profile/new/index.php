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

include '../includes/templates/new_profile.php';

$err = null;
$atts_arr = array();
$vals_arr = array();
$fields = ['email','u_name','p_word_1','p_word_2'];
$placeholders = ['email address','user name','password','re-enter password'];
//
foreach( $fields as $field) {
  if ( !empty($_POST) && !empty($_POST[$field]) ) {
    $atts_arr[$field] = 'value';
    $vals_arr[$field] = $_POST[$field];
  } else {
    $err = array_search($field,$fields);
    //
    $atts_arr[$field] = 'placeholder';
    $vals_arr[$field] = $placeholders[array_search($field,$fields)];
  }
}
//
if (null===$err) {
  $db_client = new BOC_DB_Control();
  $user = new BOC_User('',$db_client);
  $result = $user->create_user(
    $_POST['u_name'],$_POST['p_word_1'],$_POST['email']
  );
  if ($result) {

  }
}
//
$templater = $new_profile->form;
//
BOC_Util::do_doc_head_element(['../../style/profile.css']);
BOC_Util::do_page_header('');

$templater('index.php',$err,$atts_arr,$vals_arr);

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element([]);




?>

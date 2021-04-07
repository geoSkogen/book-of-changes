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

function sort_fields($post) {
  $err_arr = array();
  $atts_arr = array();
  $vals_arr = array();
  $fields = ['email','u_name','p_word_1','p_word_2'];
  $placeholders = ['email address','user name','password','re-enter password'];
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

$fields = sort_fields($_POST);
$err = null;
$modal = '';
$result = array('resp'=>null,'err'=>null);

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
    print('err');
    print($err);
  } else {
    $err = ($err) ? $err : 5;
  }
  // objectify modal template executables & pass them error codes
  $messenger = $new_profile->message;
  $modaler = $new_profile->modal;
  $message = $messenger($_POST['u_name'],$err);
  $modal = $modaler($message,$err);
  print($message);
}
// objectify the form template
$templater = $new_profile->form;
// begin document
BOC_Util::do_doc_head_element(['../../style/profile.css']);
BOC_Util::do_page_header($modal);
// pass form status arguments to the template executable
$templater('index.php',$err,$fields->atts_arr,$fields->vals_arr,$fields->err_arr);
//
BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../../script/nav-modal.js']);




?>

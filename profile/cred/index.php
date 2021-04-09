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

// globals - check form and login states
$util = new BOC_Util();
$admin = new BOC_Admin();
//$admin->get_permission(1,true,'/book-of-changes/profile/');

$err = null;
$result = array('resp'=>null,'err'=>null);
$modal = '';

$fields = $util->sort_fields(
  $_POST,
  ['u_name','p_word','new_p_word','renew_p_word'],
  ['user name','current password','new password','re-type new password']
);
// procedure
if (!empty($_POST)) {
  // amy submission
  if (!count(array_keys($fields->err_arr))) {
    // valid fields - try login
    $db = new BOC_DB_Control();
    $user = new BOC_User($_POST['u_name'],$db);
    $result['resp'] = $user->update_user(
      array('p_word'=>$fields->$vals_arr['new_p_word'])
    );
    $result['err'] = (!$result['resp']) ? 1 : $result['err'];
    // get the results of the update attempt
  } else {
    $err = 4;
    // some empty fields - error code is length of fields array
  }
} else {
  $fields->err_arr = [];
  // default form state - no errors
}
// DOM
// objectify the form template
$templater = $creds->update_form;
// begin document
BOC_Util::do_doc_head_element(['../../style/profile.css'],'Change Password');
BOC_Util::do_page_header($modal);

echo $creds->header;
// pass form status arguments to the template executable
$templater('index.php',$err,$fields->atts_arr,$fields->vals_arr,$fields->err_arr);
//
BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../../script/nav-modal.js']);

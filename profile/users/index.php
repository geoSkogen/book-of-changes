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
if (!class_exists('BOC_Users')) {
  include_once '../includes/classes/boc_users.php';
}

include '../includes/templates/users.php';
include '../includes/records/boc_data.php';

$admin = new BOC_Admin();
$db = new BOC_DB_Control();
//$admin->get_permission(1,true,'/book-of-changes/profile/');
$users = new BOC_Users($db);
$table = $users_template->menu;
$title_str = 'Users';
$hexes = [];

foreach($hex_data->names_arr as $hex_name) {
  if (array_search($hex_name,$hex_data->names_arr)) {
    $hexes[] = array('hex_name'=>$hex_name);
  }
}

$select_ui = $users_template->select_form_fraggle;
$begin_form = $users_template->select_form_top;

$select_field_users = $select_ui($users->all,'addressee','u_name');
$select_field_hexes = $select_ui($hexes,'msg_hexagram','hex_index');

$msg_form_top = $begin_form('../archives/new/index.php','message');
$hex_form_top = $begin_form('../archives/new/index.php','hexmessage');

$msg_modal = $msg_form_top . $users_template->close_modal . $select_field_users .
  $users_template->message_form_fraggle . $users_template->form_coda;

$hex_modal = $hex_form_top . $users_template->close_modal . $select_field_users .
  $select_field_hexes . $users_template->missive_form_fraggle .
  $users_template->form_coda;

$modals = $msg_modal . $hex_modal;


BOC_Util::do_doc_head_element(['../../style/users.css'],$title_str);
BOC_Util::do_page_header($modals);

$table($users->all);

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(
  ['../../script/nav-modal.js','../../script/messenger-control.js']
);

?>

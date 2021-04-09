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

$admin = new BOC_Admin();
$db = new BOC_DB_Control();
//$admin->get_permission(1,true,'/book-of-changes/profile/');
$users = new BOC_Users($db);
$table = $users_template->menu;
$title_str = 'Users';


BOC_Util::do_doc_head_element(['../../style/users.css'],$title_str);
BOC_Util::do_page_header('');

$table($users->all);

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../../script/nav-modal.js']);

?>

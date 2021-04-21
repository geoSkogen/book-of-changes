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
if (!class_exists('BOC_Archives')) {
  include_once '../includes/classes/boc_archives.php';
}

include '../includes/templates/archive.php';

$util = new BOC_Util();
$admin = new BOC_Admin();

$admin->get_permission(1,true,'/book-of-changes/profile/');

$default_filter = ($_SESSION['user']) ? $_SESSION['user'] : null;
$db_client = new BOC_DB_Control();

$archives = new BOC_Archives($default_filter,$db_client);

$make_table = $archive_template->archive_table;

$err = ( !count($archives->addressed) ) ? 'messages not found': null;
$modal = $archive_template->archive_modal;
$result = array('resp'=>null,'err'=>null);
$title_str = 'Your Archive';
//print_r($archives->addressed);
BOC_Util::do_doc_head_element(['../../style/archive.css'],$title_str);
BOC_Util::do_page_header($modal);

if (!$err) {
  $api_el = $make_table($archives->addressed);
} else {
  echo $err;
  $api_el = '';
}

$footer_injectables = $archive_template->footer_icons . $api_el;

BOC_util::do_page_footer($footer_injectables);
BOC_Util::do_doc_foot_element(
  [
    '../../resources/hex-chars.js',
    '../../script/nav-modal.js',
    '../../script/archive-control.js',
    '../../script/archive-control.js',
  ]
);





?>

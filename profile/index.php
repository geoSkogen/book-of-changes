<?php
if (!class_exists('BOC_Admin')) {
  include_once 'includes/classes/boc_admin.php';
}
if (!class_exists('BOC_Util')) {
  include_once 'includes/classes/boc_util.php';
}
if (!class_exists('BOC_DB_Control')) {
  include_once 'includes/classes/boc_db_control.php';
}


$err = null;
$admin = new BOC_Admin();
$db = new BOC_DB_Control();
$article = $admin->make_session_frame('index.php',$err);

BOC_Util::do_doc_head_element(['../style/profile.css']);
BOC_Util::do_page_header('');

echo $article;

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element([]);

?>

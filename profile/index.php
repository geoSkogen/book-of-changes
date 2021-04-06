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

if (!class_exists('BOC_User')) {
  include_once 'includes/classes/boc_user.php';
}

$err = null;
$fields = ['u_name','p_word'];
if (!empty($_POST)) {
  foreach( $fields as $field) {
    if (!empty($_POST[$field])) {
    } else {
      $err = array_search($field,$fields);
    }
  }
}

$admin = new BOC_Admin();
$db = new BOC_DB_Control();
$user = new BOC_User('tim',$db);

if (!$user->id) {
  $user->create_user('tim','password','time@time.ti');
}

$token = $user->validate_user('password');
print($token);

$article = $admin->make_session_frame('index.php',$err);

BOC_Util::do_doc_head_element(['../style/profile.css']);
BOC_Util::do_page_header('');

echo $article;

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element([]);

?>

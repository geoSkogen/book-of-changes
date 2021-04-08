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

function sort_fields($post) {
  $err_arr = array();
  $atts_arr = array();
  $vals_arr = array();
  $fields = ['u_name','p_word'];
  $placeholders = ['user name','password'];
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
$result = array('resp'=>null,'err'=>null);
$admin = new BOC_Admin();

if (!empty($_POST)) {
  if (!count(array_keys($fields->err_arr))) {

    $db = new BOC_DB_Control();
    $user = new BOC_User($_POST['u_name'],$db);
    $token = $user->validate_user($_POST['u_name'],$_POST['p_word']);
    $nonce = ($token) ? $admin->validate_session($_POST['u_name'],$token) : null;
    print($token);

  } else {
    $err = 3;
  }
} else {
  $fields->err_arr = [];
}
$article = $admin->make_session_frame(
  'index.php',$err,$fields->atts_arr,$fields->vals_arr,$fields->err_arr
);
$title_str = ($admin->logged_in) ? 'Profile' : 'Log In';
BOC_Util::do_doc_head_element(['../style/profile.css'],$title_str);
BOC_Util::do_page_header('');

echo $article;

if ($admin->logged_in) {
  include 'includes/templates/profile.php';
  $toggle_form = $profile->toggle_form;
  $toggle_form($user->uname,$user->email);
}

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../script/nav-modal.js','../script/profile-editor.js']);

?>

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
// incorporate into util object as static method ? use field arrs as args . . .
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


// globals - check form and login states

//session_start();

//$_SESSION['user'] = 'tonky the pocky';
$fields = sort_fields($_POST);
$err = null;
$result = array('resp'=>null,'err'=>null);
$admin = new BOC_Admin();
// amy submission
if (!empty($_POST)) {
  if (!count(array_keys($fields->err_arr))) {
    // valid fields - try login
    $db = new BOC_DB_Control();
    $user = new BOC_User($_POST['u_name'],$db);
    $this_user = $user->validate_user($_POST['u_name'],$_POST['p_word']);
    $err = (!is_numeric($this_user)) ? $admin->validate_session($_POST['u_name'],$this_user) : $this_user;
    //print($this_user);
  } else {
    // missing fields error code
    $err = 3;
  }
} else {
  // default state - no submission
  $fields->err_arr = [];
}
// session frame : login/logout screen
$article = $admin->make_session_frame(
  'index.php',$err,$fields->atts_arr,$fields->vals_arr,$fields->err_arr
);
//  head element injectable title
$title_str = ($admin->logged_in) ? 'Profile' : 'Log In';
// begin html document
BOC_Util::do_doc_head_element(['../style/profile.css'],$title_str);
BOC_Util::do_page_header('');

echo $article;

if ($admin->is_logged_in()) {
  include 'includes/templates/profile.php';
  $db = new BOC_DB_Control();
  $user = new BOC_User($_SESSION['user'],$db);
  $toggle_form = $profile->toggle_form;
  $toggle_form($user->uname,$user->email);
}

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element(['../script/nav-modal.js','../script/profile-editor.js']);
// end html document
?>

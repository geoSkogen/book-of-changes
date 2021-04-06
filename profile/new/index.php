<?php

if (!class_exists('BOC_Util')) {
  include_once '../includes/classes/boc_util.php';
}

include '../includes/templates/new_profile.php';

$err = null;
$fields = ['email','u_name','p_word_1','p_word_2'];
$placeholders = ['email address','user name','password','re-enter password'];
$atts_arr = array();
$vals_arr = array();
foreach( $fields as $field) {
  $atts_arr[$field] = 'placeholder';
  $vals_arr[$field] = $placeholders[array_search($field,$fields)];
}
if (!empty($_POST)) {
    if (!empty($_POST[$field])) {
      $atts_arr[$field] = 'value';
      $vals_arr[$field] = $_POST['field'];
    } else {
      $err = array_search($field,$fields);
    }

}


$templater = $new_profile->form;

BOC_Util::do_doc_head_element(['../../style/profile.css']);
BOC_Util::do_page_header('');

$templater('index.php',$err,$atts_arr,$vals_arr);

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element([]);




?>

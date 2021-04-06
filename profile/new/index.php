<?php

if (!class_exists('BOC_Util')) {
  include_once '../includes/classes/boc_util.php';
}

include '../includes/templates/new_profile.php';

$templater = $new_profile->form;

BOC_Util::do_doc_head_element(['../../style/profile.css']);
BOC_Util::do_page_header('');

$templater('index.php',null);

BOC_util::do_page_footer('');
BOC_Util::do_doc_foot_element([]);




?>

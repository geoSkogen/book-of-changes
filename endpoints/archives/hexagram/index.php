<?php

if ($_SERVER['REQUEST_METHOD']==='POST') {

  if (!class_exists('BOC_Util')) {
    include_once '../../../profile/includes/classes/boc_util.php';
  }
  if (!class_exists('BOC_DB_Control')) {
    include_once '../../../profile/includes/classes/boc_db_control.php';
  }
  if (!class_exists('BOC_Admin')) {
    include_once '../../../profile/includes/classes/boc_admin.php';
  }
  if (!class_exists('BOC_User')) {
    include_once '../../../profile/includes/classes/boc_user.php';
  }
  if (!class_exists('BOC_Archive')) {
    include_once '../../../profile/includes/classes/boc_archive.php';
  }

  require '../../../' . BOC_User::$api_users_path;

  $str = '';

  $util = new BOC_Util();

  $db = new BOC_DB_Control();

  $admin = new BOC_Admin();

  $user = new BOC_User('',$db);

  $data = json_decode(file_get_contents("php://input"),true);

  $fields = $util->sort_fields(
    $data,
    ['author','addressee','body','hex_index','mvng_lines','post_type','api_user','api_key'],
    ['author','addressee','body','hex_index','mvng_lines','post_type','api_user','api_key']
  );

  $str .=  ' ' . json_encode($data) . ' ' . json_encode($fields);

  if ( empty($fields->err_arr['addressee']) && empty($fields->err_arr['hex_index']) ) {

    if ($admin->is_logged_in()) {

      $token = $user->validate_user(
        $fields->vals_arr['api_user'],
        $fields->vals_arr['api_key']
      );

      if (!is_numeric($token['resp'])) {

        $fieds->vals_arr['post_type'] = (!empty($fieds->err_arr['post_type'])) ?
          'hexagram' : $fields->vals_arr['post_type'];

        $fieds->vals_arr['author'] = (!empty($fieds->err_arr['author'])) ?
          $fieds->vals_arr['addressee'] : $fields->vals_arr['author'];

        $archive = new BOC_Archive(
          $fields->vals_arr['hex_index'],
          $fields->vals_arr['author'],
          $fields->vals_arr['post_type'],
          $fields->vals_arr['addressee'],
          $fields->vals_arr['body'],
          $fields->vals_arr['mvng_lines'],
          $db
        );
        $str .= ' your hexagram was saved ';
      } else {

      }
    } else {
      $str .= ' your session expired ';
    }
    //echo $result;
    echo $str;
    die();
    //
  } else {
    //
    $str .= ' post data object missing required fields ';
    echo $str;
    die();
  }

} else {
  $str .= ' get request got ';
  echo $str;
  die();
}






?>

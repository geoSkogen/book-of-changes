<?php

class BOC_REST_Router {

  public $util;
  public $db;
  public $user;

  function __construct() {

    if (!class_exists('BOC_Util')) {
      include_once 'boc_util.php';
    }
    if (!class_exists('BOC_DB_Control')) {
      include_once 'boc_db_control.php';
    }
    if (!class_exists('BOC_User')) {
      include_once '../../../profile/includes/classes/boc_user.php';
    }

    $this->util = new BOC_Util();

    $this->db = new BOC_DB_Control();

    $this->user = new BOC_User('',$this->db);
  }

  function post_archive($post_type,$required_field,$data) {

    if (!class_exists('BOC_Archive')) {
      include_once '../../../profile/includes/classes/boc_archive.php';
    }

    $args = array_merge(BOC_Archive::$post_props,['api_user','api_key']);

    $fields = $this->util->sort_fields(
      $data,
      $args,
      $args
    );

    $str = '';
    print_r($fields);
    if ( empty($fields->err_arr['addressee']) && empty($fields->err_arr[$required_field]) ) {

      $token = $this->user->validate_user(
        $fields->vals_arr['api_user'],
        $fields->vals_arr['api_key']
      );

      if (!is_numeric($token)) {

        $fieds->vals_arr['post_type'] = (!empty($fieds->err_arr['post_type'])) ?
          $post_type : $fields->vals_arr['post_type'];

        $fields->vals_arr['author'] = (!empty($fields->err_arr['author'])) ?
          $fieds->vals_arr['addressee'] : $fields->vals_arr['author'];

        $archive = new BOC_Archive(
          $fields->vals_arr['hex_index'],
          $fields->vals_arr['author'],
          $fields->vals_arr['post_type'],
          $fields->vals_arr['addressee'],
          $fields->vals_arr['body'],
          $fields->vals_arr['mvng_lines'],
          $this->db
        );
        $str .= ' your ' . $post_type . '  was saved ';
        echo $str;
      } else {
        $str .= ' API client credentials were invalid for ' . $fields->vals_arr['api_user'];
        echo $str;
      }
    } else {
      //
      $str .= ' post data object missing required fields, addressee or ' . $required_field;
      echo $str;
    }
    return ($archive) ? $archive : $str;
  }

}

?>

<?php
class BOC_Admin {
  public $logged_in;

  function __construct() {
    $now = time();

    $this->logged_in = (
      ( !empty($_SESSION['valid']) && !empty($_SESSION['deadline']) ) &&
      ( ($_SESSION['deadline']-$now) > 0 )
      ) ? true : false;
  }

  public function make_session_frame($handler_path) {
    $str = '';
    if ($this->logged_in) {

    } else {
      $form_frame = "<form id='login-form' method='POST' action='$handler_path' class='login'>";
      $form_frame .= "<div flex-col flex-start'>";
      $uname_in = "<div id='unmerr' class='form-error flex-row flex-center'>";
      $uname_in .= "<input type='text' name='u_name' id='login-uname' class='login-form'/></div>";
      $pword_in = "<div id='pwderr' class='form-error flex-row flex-center'>";
      $pword_in .= "<input type='password' name='p_word' id='login-pword' class='login-form'/></div>";
      $submit_form = "<div id='submitter' class='form-error flex-row flex-center'>";
      $submit_form .= "<input type='submit' value='login' id='login-submit' class='no-button'/>";
      $submit_form .= "</div></form>";
      $str = $form_frame . $uname_in . $pword_in . $submit_form;
    }
    return $str;
  }
}
?>

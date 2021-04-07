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

  public function make_session_frame($handler_path,$err,$atts_arr,$vals_arr,$err_arr) {
    $str = '';
    $err_msg = '';
    if ($this->logged_in) {

    } else {
      if (is_numeric($err)) {
        switch($err) {
          case 0 :
            break;
          default :
        }
      }
      $inputs = '';
      $form_alert = "<div id='login-alert' class=''>$err_msg</div>";
      $form_frame = (null!=$err) ? $form_alert : '';
      $form_frame .= "<form id='login-form' method='POST' action='$handler_path' class='login'>";
      $form_frame .= "<div flex-col flex-start'>";

      foreach(array_keys($vals_arr) as $name) {
        $inputs .= "<div id='$name-err' class='form-wrapper flex-row flex-center'>";
        $inputs .= "<input type='" . $vals_arr[$name] ."' name='$name' id='login-uname' class='login-form'";
        $inputs .= $atts_arr[$name] .'="' . $vals_arr[$name] . '" /></div>';
      }

      $submit = "<div id='submitter' class='form-wrapper flex-row flex-center'>";
      $submit .= "<input type='submit' value='login' id='login-submit' class='no-button'/>";

      $form_foot = "</div></div></form>";
      //
      $str = $form_frame . $inputs . $submit . $form_foot;
    }
    return $str;
  }
}
?>

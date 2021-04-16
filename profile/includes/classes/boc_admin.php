<?php
class BOC_Admin {

  public $logged_in;
  public $uname;
  public $email;
  public $token;

  function __construct() {
    if (!session_id() ) {
     session_start();
    }
    $now = time();

    $this->logged_in = (
      !empty($_SESSION['login']) && !empty($_SESSION['deadline']) &&
      ( ($_SESSION['deadline']-$now) > 0 )
    );
    $this->uname = (!empty($_SESSION['user'])) ? $_SESSION['user'] : $this->uname;
  }

  public function is_logged_in() {
    $now = time();
    $logged_in = (
      !empty($_SESSION['login']) && !empty($_SESSION['deadline']) &&
      ( $_SESSION['login'] && ($_SESSION['deadline']-$now) > 0 )
      ) ? true : false;
    return $logged_in;
  }

  public function get_permission($level_int,$deport_bool,$uri_str) {
    $visa = ($this->is_logged_in()) ? $_SESSION['deadline'] : null;
    switch($level_int) {
      case 1 :
        // is admin . . . etc.
        // cancel visa
        break;
      default :
    }
    if (!$visa) {
      if ($deport_bool) {
        header("Location: $uri_str");
      } else {
        die('A bell is a cup until it is struck.');
      }
    } else {
      return true;
    }
  }

  public function validate_session($uname,$token) {
    //session_start();
    $arr = explode(':',$token);
    $_SESSION['login'] = true;
    $_SESSION['user'] = $uname;
    $_SESSION['u_id'] = $arr[0];
    $_SESSION['deadline'] = $arr[1]+540000;
    $this->logged_in = true;
    $this->uname = $uname;
    return $_SESSION['deadline'];
  }

  public function make_session_frame($handler_path,$err,$atts_arr,$vals_arr,$err_arr) {
    include 'includes/templates/profile.php';
    $str = '';
    $err_msg = '';
    if ($this->logged_in) {

      $header = "<div id='profile-wrap' class='flex-col flex-start'>
      <h1 class='flex-row flex-center'>$profile->badge $this->uname</h1>
      <h2>☰  ☱  ☲  ☳  ☴  ☵  ☶  ☷</h2></div>";

      $str = $header;

    } else {
      if (is_numeric($err)) {
        switch($err) {
          case 1 :
            $err_msg = 'no existing profile';
            break;
          case 2 :
            $err_msg = 'invalid password';
            break;
          case 3 :
            $err_msg = 'some fields left blank';
          default :
            $err_msg = '';
        }
      }
      $inputs = '';
      $header = '<div id="form-wrap" class="flex-col flex-start">
        <h1 class="flex-row flex-center">' . $profile->badge . 'login</h1>
        <h2>☰  ☱  ☲  ☳  ☴  ☵  ☶  ☷</h2>';
      $form_alert = "<div id='login-alert' class=''>$err_msg</div>";
      $form_frame = (null!=$err) ? $form_alert : '';
      $form_frame .= "<form id='login-form' method='POST' action='$handler_path'
       class='login  flex-col flex-start'>";

      foreach(array_keys($vals_arr) as $name) {
        $err_class = (!empty($err_arr[$name])) ? 'error' : '';
        $inputs .= "<div id='$name-err' class='form-wrapper flex-row flex-center'>";
        $inputs .= "<input type='" . $vals_arr[$name] ."' name='$name' id='login-uname' class='login-form $err_class'";
        $inputs .= $atts_arr[$name] .'="' . $vals_arr[$name] . '" /></div>';
      }

      $submit = "<div id='submitter' class='form-wrapper flex-row flex-center'>";
      $submit .= "<input type='submit' value='login' id='login-submit' class='no-button'/></div>";

      $form_foot = "</form>";
      $anchors = "<div class='anchor-wrapper flex-row flex-center'>";
      $anchors .= "<a id='lost' class='login-anchor' href='#'>lost password?</a>";
      $anchors .= "</div><div class='anchor-wrapper flex-row flex-center'>";
      $anchors .= "<a id='new' class='login-anchor' href='new/'>don't have a profile? create one</a></div>";
      $form_foot .= $anchors . "</div>";
      //
      $str = $header . $form_frame . $inputs . $submit . $form_foot;
    }
    return $str;
  }
}
?>

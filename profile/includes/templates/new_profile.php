<?php
$new_profile = new stdClass();

$new_profile->form = function ($handler_path,$err) {
  ?>
  <form id="new-profile-form" class="flex-row flex-center"
        action="<?php echo $handler_path; ?>" method="POST">
    <input type="email" id="new-profile-email" class="new-proifle-input"/>
    <div class="form-error" id="emlerr"></div>
    <input type="text" id="new-profile-uname" class="new-proifle-input"/>
    <div class="form-error" id="unmerr"></div>
    <input type="password" id="new-profile-pword" class="new-proifle-input"/>
    <div class="form-error" id="pw1err"></div>
    <input type="password" id="new-profile-repword" class="new-proifle-input"/>
    <div class="form-error" id="pw2err"></div>
    <input type="submit" id="submit-buttom" class="no-button" value="create user"/>
  </form>
  <?php
};

$new_profile->message =  function ($uname,$err) {
  if (is_numeric($err)) {
    switch ($err) {
      case 0 :
        $str = ' | unknown user ';
        break;
      case 1 :
        $str = ' | invalid password ';
        break;
      case 1 :
        $str = ' | passwords do not match';
        break;
      default;
        $str = ' | unlisted error';
    }
    $err_msg = "<h3>something went wrong&mdash; $str </h3>";
  } else {
    $err_msg = '<h3>the internet is broken, sorry</h3>';
  }
  $go_message = "<h3>a new profile has been created for $uname</h3>";
  return (null!=$err) ? $err_msg : $go_msg;
};

?>

<?php
$new_profile = new stdClass();

$new_profile->form = function ($handler_path,$err,$input_att,$input_val) {
  ?>
  <form id="new-profile-form" class="flex-col flex-start"
        action="<?php echo $handler_path; ?>" method="POST">
    <div class="form-error flex-row flex-center" id="emlerr">
      <input type="email" name="email" id="new-profile-email" class="new-profile-input"
      <?php echo $input_att['email'] . '="' . $input_val['email']. '"'; ?> />
    </div>
    <div class="form-error flex-row flex-center" id="unmerr">
      <input type="text" name="u_name" id="new-profile-uname" class="new-profile-input"
       <?php echo $input_att['u_name'] . '="' . $input_val['u_name']. '"'; ?> />
    </div>
    <div class="form-error flex-row flex-center" id="pw1err">
      <input type="password" name="p_word_1" id="new-profile-pword" class="new-profile-input"
      <?php echo $input_att['p_word_1'] . '="' . $input_val['p_word_1'] . '"'; ?> />
    </div>
    <div class="form-error flex-row flex-center" id="pw2err">
      <input type="password" name="p_word_2" id="new-profile-repword" class="new-profile-input"
      <?php echo $input_att['p_word_2'] . '="' . $input_val['p_word_2']. '"' ?> />
    </div>
    <div id='submitter' class='form-error flex-row flex-center'>
      <input type="submit" id="submit-buttom" class="no-button" value="create user" />
    </div>
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

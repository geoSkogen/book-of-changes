<?php
$new_profile = new stdClass();

$new_profile->form = function ($handler_path,$err,$input_att,$input_val) {
  $types = ['email'=>'email','p_word_1'=>'password','p_word_2'=>'password'];
  $names = array_keys($input_val);
  ?>
  <form id="new-profile-form" class="flex-col flex-start"
        action="<?php echo $handler_path; ?>" method="POST">

  <?php for ($i = 0 ; $i < count($names); $i++) {
          $att = $input_att[$names[$i]];
          $val = $input_val[$names[$i]];
          $type = ( in_array($names[$i],array_keys($types)) ) ? $types[$names[$i]] : 'text';
  ?>
    <div class="form-error flex-row flex-center" id="<?php echo $names[$i]; ?>-err" >
      <input type="<?php echo $type; ?>" name="<?php echo $names[$i]; ?>"
       id="new-profile-<?php echo $names[$i]; ?>" class="new-profile-input"
       <?php echo $att . '="' . $val . '"'; ?> />
    </div>

  <?php } ?>

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

<?php
$new_profile = new stdClass;

$new_profile->form = function ($handler_path,$err,$input_att,$input_val,$err_arr) {
  $types = ['email'=>'email','p_word_1'=>'password','p_word_2'=>'password'];
  $names = array_keys($input_val);
  ?>
<div id="form-wrap" class="flex-col flex-start">
  <h1>new profile</h1>
  <h2>☰ | ☱ | ☲ | ☳ | ☴ | ☵ | ☶ | ☷</h2>
  <form id="new-profile-form" class="flex-col flex-start"
        action="<?php echo $handler_path; ?>" method="POST">

  <?php for ($i = 0 ; $i < count($names); $i++) {
          $err_class = ( !empty($err_arr[$names[$i]]) ) ? 'error' : '';
          $att = $input_att[$names[$i]];
          $val = $input_val[$names[$i]];
          $type = ( in_array($names[$i],array_keys($types)) ) ? $types[$names[$i]] : 'text';
  ?>
    <div class="form-wrapper flex-row flex-center" id="<?php echo $names[$i]; ?>-wrap" >
      <input type="<?php echo $type; ?>" name="<?php echo $names[$i]; ?>"
       id="new-profile-<?php echo $names[$i]; ?>" class="new-profile-input <?php echo $err_class; ?>"
       <?php echo $att . '="' . $val . '"'; ?> />
    </div>

  <?php } ?>

    <div id='new-submit' class='form-wrapper flex-row flex-center'>
      <input type="submit" id="submit-buttom" class="no-button" value="create user" />
    </div>
  </form>
</div>
  <?php
};

$new_profile->modal = function ($message,$err) {
  $toggle_class = (!$err) ? 'success' : 'error';
  $toggle_link = (!$err) ? 'proceed to profile' : 'try again';
  ?>
  <div id='hex-modal' class="full-modal">
    <div id="close-hex-modal" class="close-modal">&laquo;</div>
    <div id="hex-modal-content">
  <?php echo $message ?>
      <a class="<?php echo $toggle_class; ?>"><?php echo $toggle_link; ?></a>
    </div>
  </div>
  <?php
};

$new_profile->message =  function ($uname,$err) {
  if (is_numeric($err)) {
    switch ($err) {
      case 1 :
        $str = '| duplicate email ';
        break;
      case 2 :
        $str = '| duplicate user name ';
        break;
      case 3 :
      case 4 :
        $str = '| passwords do not match';
        break;
      case 5 :
        $str = '| some fields were blank ';
        break;
      default;
        $str = '| unlisted error';
    }
    $err_msg = "<h3>something went wrong&mdash;$str</h3>";
  } else {
    $err_msg = '<h3>the internet is broken, sorry</h3>';
  }
  $go_msg = "<h3>a new profile has been created for $uname</h3>";
  return ($err) ? $err_msg : $go_msg;
};

?>

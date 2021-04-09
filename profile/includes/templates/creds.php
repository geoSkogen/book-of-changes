<?php

$creds = new stdClass;

$creds->update_form = function ($handler_path,$err,$atts_arr,$vals_arr,$err_arr) {
  ?>
  <div class="flex-col flex-start">
    <form id="edit-pword-form" class="" method="POST" action="<?php echo $handler_path; ?>" >
  <?php
  foreach($atts_arr as $key => $val) {
    $type = ( array_search($key,array_keys($atts_arr)) ) ? 'password' : 'text';
    $class = (!empty($err_arr[$key])) ?  'error' : '';
  ?>
      <h4>
        <div class="flex-row flex-between">
          <input name="<?php echo $key; ?>" id="" class="edit-profile-input <?php echo $class; ?>"
           <?php echo $val; ?>="<?php echo $vals_arr[$key]; ?>" type="<?php echo $type; ?>" />
        </div>
      </h4>
  <?php
  }
  ?>
      <input type="submit" value="update password" class="no-button" />
    </form>
  </div>
  <?php
};

$creds->modal = '';

$creds->badge = "<div id='badge-frame'>
  <img id='badge-img' src='/book-of-changes/resources/images/75px-Tao.svg.png' />
  </div>";

$creds->header = "<div id='profile-wrap' class='flex-col flex-start'>
  <h1 class='flex-row flex-center'>$creds->badge Change Password</h1>
  <h2>☰  ☱  ☲  ☳  ☴  ☵  ☶  ☷</h2></div>";



?>

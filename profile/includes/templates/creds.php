<?php

$creds = new stdClass;

$creds->update_form = function ($handler_path,$err,$atts_arr,$vals_arr,$err_arr) {
  ?>
  <div class="flex-col flex-start">
  <?php
  foreach($atts_arr as $key => $val) {
  ?>
    <h3>
      <div class="flex-row flex-between">
        <input name="<?php echo $key; ?>" id="" class="edit-profile-input"
         <?php echo $val; ?>="<?php echo $vals_arr[$key]; ?>" />
      </div>
    </h3>
  <?php
  }
  ?>
  </div>
  <?php
};

$creds->badge = "<div id='badge-frame'>
  <img id='badge-img' src='/book-of-changes/resources/images/75px-Tao.svg.png' />
  </div>";

$creds->header = "<div id='profile-wrap' class='flex-col flex-start'>
  <h1 class='flex-row flex-center'>$creds->badge Change Password</h1>
  <h2>☰  ☱  ☲  ☳  ☴  ☵  ☶  ☷</h2></div>";



?>

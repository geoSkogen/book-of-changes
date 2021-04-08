<?php

$profile = new stdClass;

$profile->toggle_form = function ($uname,$email) {
  ?>
  <div class="flex-col flex-start">
    <h3>
      <div class="flex-row flex-between">
        <div id="edit_u_name" class="toggle-in" data-toggle="1"><?php echo $uname ?></div>
        <a class="toggle-it" href='#update_u_name' data-toggle="1">edit</a>
      </div>
    </h3>
    <h4>
      <div class="flex-row flex-between">
        <div id="edit_email" class="toggle-in" data-toggle="1"><?php echo $email ?></div>
        <a class="toggle-it" href='#update_email' data-toggle="1">edit</a>
      </div>
    </h4>
    <h5>
      <div class="flex-row flex-between">
        <div class="" id="lock-icon-wrapper">
          <i id="lock-icon" class="fas fa-unlock-alt" data-toggle="1"></i>
        </div>
        <a class="no-toggle" href='#update_p_word' >change password</a>
      </div>
    </h5>
    <div class="flex-row flex-center">
      <div id="no-submit" class="no-button">save changes</div>
    </div>
    <div id="form-appendix"></div>
  </div>
  <?php
};

$profile->badge = "<div id='badge-frame'>
  <img id='badge-img' src='/book-of-changes/resources/images/75px-Tao.svg.png' />
  </div>";



?>

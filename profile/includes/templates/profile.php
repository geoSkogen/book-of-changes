<?php

$profile = new stdClass;

$profile->toggle_form = function ($uname,$email) {
  ?>
  <div class="flex-col flex-start">
    <h3>
      <div class="flex-row flex-between">
        <div class="toggle-in"><?php echo $uname ?></div>
        <a class="toggle-it" href='#'>edit</a>
      </div>
    </h3>
    <h4>
      <div class="flex-row flex-between">
        <div class="toggle-in"><?php echo $email ?></div>
        <a class="toggle-it" href='#'>edit</a>
      </div>
    </h4>
    <h5>
      <div class="flex-row flex-between">
        <div class="toggle-in" id="lock-icon-wrapper">
          <i id="hex-filter" class="fas fa-unlock-alt" data-toggle="1"></i>
        </div>
        <a class="toggle-it" href='#'>change password</a>
      </div>
    </h5>
  </dov>
  <?php
};

$profile->badge = "<div id='badge-frame'>
  <img id='badge-img' src='/book-of-changes/resources/images/75px-Tao.svg.png' />
  </div>";



?>

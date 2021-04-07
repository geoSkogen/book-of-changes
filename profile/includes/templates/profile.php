<?php

$profile = new stdClass;

$profile->toggle_form = function ($uname,$email) {
  ?>
  <div class="flex-col flex-start">
    <h3>
      <div class="flex-row flex-between">
        <div><?php echo $uname ?></div>
        <a href='#'>edit</a>
      </div>
    </h3>
    <h4>
      <div class="flex-row flex-between">
        <div><?php echo $email ?></div>
        <a href='#'>edit</a>
      </div>
    </h4>
    <h5>
      <div class="flex-row flex-between">
        <div>change password</div>
        <a href='#'>#</a>
      </div>
    </h5>
  </dov>
  <?php
}

?>

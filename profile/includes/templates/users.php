<?php
$users_template = new stdClass;

$users_template->menu = function ($users_table) {
?><div id="users-menu" class="flex-col flex-start"><?php
  foreach($users_table as $user_row) {
    ?>
    <div id="" class="flex-row flex-center user-row">
      <div class="user-wrapper">
        <span class="u-name-it"><?php echo $user_row['u_name']?></span>
        <a href="#message" class="message-user">
        </a>
        <a href="#hexmessage"class="hexmessage-user">
        </a>
      </div>
    </div>
<?php } ?>
  </div>
<?php
}


?>

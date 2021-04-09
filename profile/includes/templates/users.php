<?php
$users_template = new stdClass;

$users_template->menu = function ($users_table) {
?><div id="users-menu" class="flex-col flex-start"><?php
  foreach($users_table as $user_row) {
    ?>
    <div id="" class="user-row">
      <div class="flex-row flex-between user-wrapper">
        <div class="u-name-it"><?php echo $user_row['u_name']?></div>
        <div id="icons-wrapper" cllass="flex-row flex-center">
          <a href="#message" id="message-user">
            <i class="far fa-envelope"></i>
          </a>
          <a href="#hexmessage" id="hexmessage-user">
            <i class="fas fa-bars"></i>
          </a>
        </div>
      </div>
    </div>
<?php } ?>
  </div>
<?php
}


?>

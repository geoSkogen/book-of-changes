<?php

include '../includes/records/boc_data.php';

$users_template = new stdClass;

$users_template->menu = function ($users_table) {
?><div id="users-menu" class="flex-col flex-start"><?php
  foreach($users_table as $user_row) {
    ?>
    <div id="" class="user-row">
      <div class="flex-row flex-between user-wrapper">
        <div class="u-name-it"><?php echo $user_row['u_name']?></div>
        <div id="icons-wrapper" cllass="flex-row flex-center">
          <a href="#" class="message-user">
            <i class="far fa-envelope"></i>
          </a>
          <a href="#" class="hexmessage-user">
            <i class="fas fa-bars"></i>
          </a>
        </div>
      </div>
    </div>
<?php } ?>
  </div>
<?php
};

$users_template->select_form_top = function ($handler_path,$form_name) {
  $str = "<form id='$form_name-modal' class='modal-form' method='POST' action=$handler_path>";
  return $str;
};

$users_template->form_coda = "<div class='flex-row flex-center'>
  <input type='submit' value='send' class='no-button' /></div>
  </form>";

$users_template->close_modal = "<div class='close-modal-form-wrapper flex-row flex-end'>
  <div class='close-modal-form'>&times</div></div>";

$users_template->select_form_fraggle = function ($table,$this_field_name,$key_field_name) {
  $str = "<div id='$this_field_name-wrapper' class='flex-row flex-center'>";
  $str .= "<select id='select-$this_field_name' class='chunky' name='$this_field_name' />";
  $count = 1;
  //print_r($table);
  foreach ($table as $row) {
    $this_nickname = ( !empty($row[$key_field_name]) ) ?
      $row[$key_field_name] : null;
    $value = ($this_field_name==='addressee') ? $this_nickname : $count;
    $str .= ($this_nickname) ?
      "<option class='choose' value='$value' >$this_nickname</option>" : '';
    $count++;
  }
  $str .= "</select>";
  $str .= '</div>';
  return $str;
};

$users_template->message_form_fraggle =
  '<div class="flex-row flex-center">
    <textarea id="message-body" name="body" class="send-body" rows="12" cols="32" >
    </textarea>
  </div>';

$users_template->missive_form_fraggle =
  '<div class="flex-row flex-center">
    <input id="missive-text" name="body" class="send-body" />
  </div>';




?>

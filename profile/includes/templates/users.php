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
};

$users_template->select_form_top = function ($handler_path,$form_name) {
  $str = "<form id='$form_name-modal' class='modal-form' method='POST' action=$handler_path>";
  return $str;
};

$users_template->form_coda = "</form>";

$users_template->select_form_fraggle = function ($table,$this_field_name,$key_field_name) {
  $str = "<div id='$this_field_name-wrapper' class='flex-row flex-center'>";
  $str .= "<select id='select-$this_field_name' class='chunky' name='$this_field_name' />";
  foreach ($table as $row) {
    $this_nickname = ( !empty($row[$key_field_name]) ) ?
      $row[$key_field_name] : null;
    $str .= ($this_nickname) ?
      "<option class='choose' value='$this_nickname' >$this_nickname</option>" : '';
  }
  $str .= "</select>";
  $str .= '</div>';
  return $str;
};

$users_template->message_form_fraggle =
  '<div class="flex-row flex-center">
    <textarea id="message-body" name="msg_body" rows="4" cols="48">
    </textarea>
  </div>';

$users_template->missive_form_fraggle =
  '<div class="flex-row flex-center">
    <input id="missive-text" name="msv_text" class="" />
  </div>';




?>

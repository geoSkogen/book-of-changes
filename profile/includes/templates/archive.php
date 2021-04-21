<?php

include '../includes/records/boc_data.php';
$archive_template = new stdClass;

$archive_template->archive_modal = "<div class='flex-row flex-center'><div id='message-modal'>";
$archive_template->archive_modal .= "<div class='close-modal-wrapper flex-row flex-end'>";
$archive_template->archive_modal .= "<div class='close-message-modal'>&times</div></div>";

$archive_template->archive_modal .= "<div id='header-wrapper' class='flex-row flex-center'>";
$archive_template->archive_modal .= "<div id='author' class='header-fraggle'></div>";
$archive_template->archive_modal .= "<div id='hex_index' class='header-fraggle'></div>";
$archive_template->archive_modal .= "<div id='date_time' class='header-fraggle'></div>";
$archive_template->archive_modal .= "</div>";
$archive_template->archive_modal .= "<div id='moving_lines' ></div>";
$archive_template->archive_modal .= "<div id='body' ></div>";
$archive_template->archive_modal .= "</div></div>";

$archive_template->archive_table = function ($table) {
  global $hex_data;
  $result_table = [];
  $archive_props = [
    'author','hex_char','date_time',
  ];
  $api_props = [
   'addressee','author','body','date_time','hex_index','mvng_lines'
  ];
  $row_index = 0;
  ?>
  <div id='message-archive' class='archive-list flex-col flex-start'>
    <div class="row-wrapper flex-row flex-center">
      <div class="table-labels-wrapper flex-row flex-between">
        <div class="label-fraggle">from</div>

        <div class="label-fraggle">when</div>
      </div>
    </div>
  <?php
  foreach($table as $row) {
    $result_row = [];
    $row_class = (!empty($row['post_type'])) ? $row['post_type'] . '-row'  : 'no-row';
  ?>
    <div class="row-wrapper flex-row flex-center">
      <div id="message-<?php echo strval($row_index); ?>" class="message-wrapper flex-row flex-between">
        <?php
        foreach ($archive_props as $prop) {

          $content = (!empty($row[$prop])) ? $row[$prop] : '';
          $class = $prop . ' fraggle';

          if ($prop==='hex_char') {
            $content = (!empty($row['hex_index'])) ?
              $hex_data->chars_arr[$row['hex_index']] : "<i class='fas fa-envelope-open-text msg-icon'></i>";
          }
          
          if ($prop==='date_time') {
            $cron_arr = explode(' ',$row[$prop]);
            $date_arr = explode('-',$cron_arr[0]);
            $time_arr = explode(':',$cron_arr[1]);
            $content = $date_arr[1] . '-' . $date_arr[2] . ' ' . $time_arr[0] . ':' . $time_arr[1];
          }
          ?>
          <div class="<?php echo $class; ?>"><?php echo $content; ?></div>
          <?php
        }
        foreach ($api_props as $prop) {
          $result_row[$prop] = $row[$prop] ? $row[$prop] : '';
        }
        ?>
      </div>
    </div>
  <?php
  $result_table[] = $result_row;
  $row_index++;
  }
  $result = '<div id="archive-api">' . json_encode($result_table) . '</div>';
  return $result;
};

$archive_template->footer_icons =
"<div id='footer-wrap' class='flex-row flex-between'>
    <i id='hex-new-item' class='fas fa-plus' data-toggle='1'></i>
    <i id='hex-filter' class='fas fa-filter' data-toggle='1'></i>
  </div>
  <div id='filter-menu-frame'>
    <select id='filter-menu'>
      <option id='hexagram-filter' class='filter-option'>my hexagrams</option>
      <option id='txtmsg-filter' class='filter-option' selected>my messages</option>
      <option id='hexmsg-filter' class='filter-option'>hex-messages</option>
      <option id='user-filter' class='filter-option'>fllter by user</option>
      <option id='user-filter' class='filter-option'>all arcives</option>
    </select>
  </div>";

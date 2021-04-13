<?php

include '../includes/records/boc_data.php';
$archive_template = new stdClass;



$archive_template->archive_table = function ($table) {
  global $hex_data;
  $result_table = [];
  $archive_props = [
    'author','hex_char','date_time',
  ];
  $api_props = [
   'addressee','author','body','date_time','hex_index','mvng_lines'
  ];
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
      <div class="message-wrapper flex-row flex-between">
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
  }
  ?>
  <?php
  return $result_table;
};

$archive_template->get_hex_collection = function ($index) {
  $collection = array();

  return $collection;
};

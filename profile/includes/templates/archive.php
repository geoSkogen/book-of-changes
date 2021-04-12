<?php

include '../includes/records/boc_data.php';
$archive_template = new stdClass;



$archive_template->archive_table = function ($table) {
  $archive_props = [
    'author','hex_char','body','date_time',
  ];
  ?>
  <div id='user-archive' class='archive-list flex-col flex-start'>
  <?php
  foreach($table as $row) {
    $row_class = (!empty($row['post_type'])) ? $row['post_type'] . '-row'  : 'no-row';
  ?>
    <div class="flex-row flex-center">
      <div class="message-wrapper">
        <?php
        foreach ($archive_props as $prop) {

          $content = (!empty($row[$prop])) ? $row[$prop] : '';
          $class = $prop . '-fraggle';
          if ($prop==='hex_char') {
            $content = (!empty($row['hex_index'])) ?
              $hex_data->chars_arr[$row['hex_index']] : '';
          }
          ?>
          <div class="<?php echo $class; ?>"><?php echo $content; ?></div>
          <?php
        }
        ?>
      </div>
    </div>
  <?php
  }
  ?>
  </div>
  <?php
};

$archive_template->get_hex_collection = function ($index) {
  $collection = array();

  return $collection;
};

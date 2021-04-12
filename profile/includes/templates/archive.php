<?php

include '../includes/records/boc_data.php';
$archive_template = new stdClass;



$archive_template->archive_table = function ($table) {
  $archive_props = [
    'author','hex_char','body','date_time',
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

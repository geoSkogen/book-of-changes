<?php

$response_array = [];

if ($_SERVER['REQUEST_METHOD']==='GET') {

require '../../../src/controller/BookOfChangesController.php';

$library_file = file_get_contents('../../../data/book/hex-data.json');
$typeface_file = file_get_contents('../../../data/book/hex-chars.json');

$library = $library_file ? json_decode($library_file) : null;
$typeface = $typeface_file ? json_decode($typeface_file) : null;

if ($library && $typeface) {
  $book = new BookOfChangesController(
    $library->hex_bin_arr,
    $library->tri_bin_arr,
    $library->hex_name_arr,
    $library->tri_names_arr,
    $library->purports_inner,
    $library->purports_outer,
    $library->moving_lines_inner,
    $library->moving_lines_outer,
    $typeface->hex_lines_chars_arr,
    $typeface->hex_chars_table,
    $typeface->tri_lines_chars_arr,
    $typeface->tri_chars_arr,
    $library->inner_indices,
    $library->sovereign_indices
  );

  $controller_args = new stdClass;
  $controller_args->verbose = false;
  $controller_args->dual_result = false;
  $controller_args->moving_lines = '';
  $controller_args->id = null;

  if (isset($_GET['id'])) {

    $controller_args->id = $_GET['id'];

    if (
      isset($_GET['verbose']) &&
      ($_GET['verbose']==='true' || $_GET['verbose']==='TRUE')
    ) {
      $controller_args->verbose = true;
    }

    if (
      isset($_GET['dual']) &&
      ($_GET['dual']==='true' || $_GET['dual']==='TRUE')
    ) {
      $controller_args->dual_result = true;
    }

    if (isset($_GET['moving_lines'])) {
      $valid_arg_str = '';
      for ($char_index = 0; $char_index < strlen($_GET['moving_lines']); $char_index++) {
        if ($char_index <= 6) {
          if (intval($_GET['moving_lines'][$char_index]) <= 6) {
            $valid_arg_str .= $_GET['moving_lines'][$char_index];
          }
        }
      }
      if ($valid_arg_str) {
        $controller_args->moving_lines = $valid_arg_str;
      }
    }

    $response_array = $book->getHexagram(
      $controller_args->id,
      $controller_args->moving_lines,
      $controller_args->verbose,
      $controller_args->dual_result
    );
  }
} else {
  $response_array = [ 'error' => 'database not found' ];
}

} else {
  $response_array = [ 'error' => 'unsupported HTTP method' ];
}

print(json_encode($response_array));

?>

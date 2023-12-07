<?php

require '../../../src/controller/BookOfChangesController.php';

$library_file = file_get_contents('../../../data/book/hex-data.json');
$typeface_file = file_get_contents('../../../data/book/hex-chars.json');

$library = $library_file ? json_decode($library_file) : null;
$typeface = $typeface_file ? json_decode($typeface_file) : null;

$response_array = '';

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

  $request_query_args = [];

  $queries = explode('&',$_SERVER['QUERY_STRING']);
  foreach($queries as $index => $query_str) {
    $key_val_arr = explode('=',$query_str);
    $request_query_args[$key_val_arr[0]] = $key_val_arr[1];
  }

  if (isset($request_query_args['id'])) {

    $response_array = $book->getTrigramBody($request_query_args['id']);

  } else {
    $response_array = [ 'error' => 'invalid ID number' ];
  }
} else {
  $response_array = [ 'error' => 'database not found' ];
}

print(json_encode($response_array));

?>

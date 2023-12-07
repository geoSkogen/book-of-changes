<?php

$library_file = file_get_contents('../../../../data/book/hex-data.json');
$typeface_file = file_get_contents('../../../../data/book/hex-chars.json');

$library = $library_file ? json_decode($library_file) : null;
$typeface = $typeface_file ? json_decode($typeface_file) : null;

$response_array = [];

if ($library && $typeface) {

  foreach($library->sovereign_indices as $sovereign_index) {
    $response_array[] = [
      'title' => $library->hex_name_arr[$sovereign_index],
      'uri' => '/api/v1/hexagrams/?id=' . strval($sovereign_index)
    ];
  }

} else {
  $response_array = [ 'error' => 'database not found' ];
}

print(json_encode($response_array));

?>

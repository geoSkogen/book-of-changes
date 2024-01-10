<?php

$response_array = [];

if ($_SERVER['REQUEST_METHOD']==='GET') {

require '../../../../src/controller/BookOfChangesController.php';

$library_file = file_get_contents('../../../../data/book/hex-data.json');
$typeface_file = file_get_contents('../../../../data/book/hex-chars.json');

$library = $library_file ? json_decode($library_file) : null;
$typeface = $typeface_file ? json_decode($typeface_file) : null;

if ($library && $typeface) {

  $book = new BookOfChangesController($library,$typeface);

  if (isset($_GET['segment']) && isset($_GET['id'])) {

    $response_array = $book->getHexagramsByTrigram(
      $_GET['segment'],
      $_GET['id']
    );

  } else if (isset($_GET['top']) && isset($_GET['bottom'])) {

    $response_array = $book->getHexagramByTrigrams($_GET['bottom'],$_GET['top']);

  } else {

    $response_array = [ 'error' => 'unrecognized arguments'];
  }
} else {
  $response_array = [ 'error' => 'database not found' ];
}

} else {
  $response_array = [ 'error' => 'unsupported HTTP method' ];
}

print(json_encode($response_array));

?>

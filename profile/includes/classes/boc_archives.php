<?php
class Archives {
  public $authored;

  function __construct($uname,$db) {
    $sql = "SELECT * FROM archives WHERE author = '{$uname}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    $this->authored = ( count($result_arr) ) ? $result_arr :[];
  }
}
?>

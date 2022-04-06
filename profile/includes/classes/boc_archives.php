<?php
class BOC_Archives {
  public $addressed;
  public $client;

  function __construct($uname,$db) {
    $result_arr = [];
    $this->client = $db;
    $sql = "SELECT * FROM archives WHERE addressee = '{$uname}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    $this->addressed = ( count($result_arr) ) ? $result_arr : [];
  }

  function get_filtered_results($filter) {
    $table = [];
    return $table;
  }
}
?>

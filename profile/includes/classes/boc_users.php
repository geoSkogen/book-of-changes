<?php
class BOC_Users {

  public $all;
  public $client;
  function __construct($db_client) {
    $this->client = $db_client;
    $this->all = $this->select_users();

  }

  function select_users() {
    $result_arr = [];
    $sql = "SELECT * FROM users";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr :[];
  }
}

?>

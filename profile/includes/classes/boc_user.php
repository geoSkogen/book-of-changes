<?php
class BOC_User {

  public $email;
  public $uname;
  public $id;
  public $client;
  public $token;

  function __construct($uname,$db_client) {
    $this->client = $db_client;
    $result = $this->select_user($uname);
    if ($result) {
      $this->email = $result['email'];
      $this->uname = $uname;
      $this->id = $result['id'];
    } else {
      $result = null;
    }
  }

  public function create_user($uname,$pword,$email) {
    $sql = "INSERT INTO users (u_name,p_word,email) VALUES ('$uname','$pword','$email')";
    $result = $this->client->query($sql);
    if ($result) {
      $this->email = $email;
      $this->uname = $uname;
      //$this->id = $result->id;
    }
  }

  public function select_user($uname) {
    $result_arr = [];
    $sql = "SELECT * FROM users WHERE u_name = '{$uname}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0] : null;
  }

  public function select_user_prop($user,$prop) {
    $result_arr = [];
    $sql = "SELECT {$prop} FROM users WHERE u_name = '{$user}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0][$prop] : null;
  }

  public function edit_user($row) {

  }

  public function destroy_user($uname) {

  }

  public function validate_user($pword) {
    $result = null;
    $resp = $this->select_user_prop('tim','p_word');
    if ($pword===$resp) {
      $result = microtime();
    }
    $this->token = $result;
    return $result;
  }




}
?>

<?php
class BOC_User {

  public $email;
  public $uname;
  public $id;
  public $client;

  function __construct($uname,$db_client) {
    $this->client = $db_client;
    $row = $this->select_user($uname);
    if ($row) {
      $this->email = $row['email'];
      $this->uname = $uname;
      $this->id = $row['id'];
    }
  }

  public function create_user($uname,$pword,$email) {
    $sql = "INSERT INTO users (u_name,p_word,email) VALUES ('$uname','$pword','$email')";
    $result = $this->client->query($sql);
    if ($result) {
      $this->email = $result['email'];
      $this->uname = $uname;
      $this->id = $result['id'];
    }
  }

  public function select_user($uname) {
    $sql = "SELECT * FROM users WHERE u_name EQUALS '{$uname}' ";
    $result = $this->client->query($sql);
    return $result;
  }

  public function edit_user($row) {

  }

  public function destroy_user($uname) {
    
  }



}
?>

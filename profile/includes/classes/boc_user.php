<?php
class BOC_User {

  public $email;
  public $uname;
  public $id;
  public $client;
  public $token;
  public static $api_users_path = 'profile/includes/records/creds.php';

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
    $existing = false;
    $result = array('resp' => null, 'err' => null);
    $existing = $this->select_user($uname);
    if ($existing) { $result['err'] = 2; }
    $existing = $this->select_user_by_prop('email',$email);
    if ($existing) { $result['err'] = 1; }
    $sql = "INSERT INTO users (u_name,p_word,email) VALUES ('$uname','$pword','$email')";
    $resp = $this->client->query($sql);
    if ($resp) {
      $this->email = $email;
      $this->uname = $uname;
      //$this->id = $result->id;
      $result['resp'] = $resp;
    }
    return $result;
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

  public function select_user_by_prop($key,$val) {
    $result_arr = [];
    $sql = "SELECT * FROM users WHERE {$key} = '{$val}'";
    $resp = $this->client->query($sql);
    while ($row = mysqli_fetch_array($resp)) {
      $result_arr[] = $row;
    }
    return (count($result_arr)) ? $result_arr[0] : null;
  }

  public function edit_user($assoc) {
    $sql = "UPDATE users SET ";
    $index = 0;
    foreach ($assoc as $key => $val) {
       $sql .= ($index) ? "," : "";
       $sql .= $key . "= '{$val}'";
       $index++;
    }
    $sql .= " WHERE id = {$this->id}";
    $resp = $this->client->query($sql);
    return $resp;
  }

  public function destroy_user($uname) {

  }

  public function validate_user($uname,$pword) {
    $result = null;
    $resp = $this->select_user_prop($uname,'p_word');
    if ($pword===$resp) {
      $user = $this->select_user($uname);
      if ($user['id']) {
        $this->token = '#' .  $user['id'] .':'. time();
        $this->id = $user['id'];
        $this->uname = $user['u_name'];
        $this->email = $user['email'];
        $result = $this->token;
      } else {
        $result = 1;
      }
    } else {
      $result = 2;
    }
    return $result;
  }




}
?>

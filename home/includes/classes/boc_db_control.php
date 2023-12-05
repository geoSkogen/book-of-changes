<?php
class BOC_DB_Control {
  public $connection;

  function __construct() {
    $results = [];
    $table_cols = [];
    $this->config();
    $this->db_conn();
    foreach([DB_UTABLE,DB_XTABLE] as $table_name) {
      $test_query = "SHOW TABLES LIKE '%{$table_name}'";
      if ($this->query($test_query)->num_rows>0) {

      } else {

        $table_cols['users'] =  "CREATE TABLE users (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          u_name text NOT NULL,
          p_word varchar(24) NOT NULL,
          email varchar(64) NOT NULL,
          PRIMARY KEY(id)
        )";
        $table_cols['archives'] = "CREATE TABLE archives (
          id mediumint(9) NOT NULL AUTO_INCREMENT,
          hex_index mediumint(9) NOT NULL,
          mvng_lines text NOT NULL,
          date_time varchar(64) NOT NULL,
          post_type text NOT NULL,
          author text NOT NULL,
          body text NOT NULL,
          addressee text NOT NULL,
          PRIMARY KEY(id)
        )";
        $results[] = $this->query($table_cols[$table_name]);
      }
    }
    //return $results;
  }

  public function config() {
    $db_conn = array(
      'DB_USER'=>'book_of_changes',
      'DB_PASSWORD'=>'book_of_changeS_22',
      'DB_HOST'=>'localhost',
      'DB_NAME'=>'book_of_changes',
      'DB_UTABLE'=> 'users',
      'DB_XTABLE'=> 'archives'
    );
    foreach($db_conn as $key => $val) {
      if ( !defined($key) ) {
        DEFINE ($key, $val);
      }

    }
  }

  public function db_conn() {
    $this->connection = new mysqli(DB_HOST,DB_USER,DB_PASSWORD,DB_NAME);
    if ($this->connection->connect_errno) {
      die("db connect error: " . $this->connection->connect_errno . '<br/>');
    }

    if ($this->connection) {
  
    }
  }

  public function escape_string($string) {
    $escaped_str = $this->connection->real_escape_string($string);
    return $escaped_str;
  }

  public function query($sql) {
    $clean_str = $this->escape_string($sql);
    $result = $this->connection->query($sql);
    if (!$result) {

    }
    return $result;
  }

}
?>

<?php
class BOC_Archive {
  public $hex_index;
  public $author;
  public $date_time;
  public $post_type;
  public $addressee;
  public $body;
  public $mvng_lines;

  public $client;

  function __construct($id,$usr,$type,$to,$msg,$mvrs_arr,$db_client) {
    $props = [
      'hex_index','author','date_time',
      'post_type','addressee','body','mvng_lines'
    ];
    $now = date("Y-m-d H:i:s");
    $movers = implode(',', $mvrs_arr);
    $args = [
      $id,$usr,$now,$type,$to,$msg,$movers
    ];
    for ($i = 0; $i < count($args); $i++) {
      $this->{$props[$i]} = $args[$i];
    }
    $this->props = $props;
    $this->client = $db_client;
    $this->create();
  }

  function create() {
    $result = null;
    $prop_str = implode(',',$this->props);
    $vals_str = '';
    foreach( $this->props as $prop ) {
      $vals_str .= (array_search($prop,$this->props)) ? "," : "";
      $vals_str .= "'" . $this->{$prop} . "'";
    }
    $sql = "INSERT INTO archives ($prop_str) VALUES ($vals_str)";
    $resp = $this->client->query($sql);
    print_r($sql);
    if ($resp) {
      $result =  $resp;
      print_r($resp);
    }
    return $result;
  }
}

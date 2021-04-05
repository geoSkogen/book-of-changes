<?php
class BOC_Util {

  function __construct() {

  }

  public static function do_doc_head_element($style_paths) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <title>
         易經 &ndash; I Ching &ndash; Book of Changes
      </title>
      <link rel='icon' href='../resources/images/tao-75-red.png' type='image/x-icon'/ >
      <link rel="stylesheet" href="../style/main.css"/>

      <?php
      foreach ($style_paths as $style_path) {
        echo "<link rel='stylesheet' href='$style_path'/>";
      }
      ?>
      
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

      <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.5.0/css/all.css"
          integrity="sha384-B4dIYHKNBt8Bc12p+WXckhzcICo0wtJAoU8YZTY5qE0Id1GSseTk6S+L3BlXeVIU"
          crossorigin="anonymous"/>

      <!--<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">-->

      <!--<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>-->

      <!--<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.8/angular.min.js"></script>-->

      <!--<script src="https://cdn.jsdelivr.net/npm/vue@2.5.17/dist/vue.js"></script> -->

    </head>
    <?php
  }

  public static function do_doc_foot_element($script_paths) {
    $script_els = '';
    foreach($script_paths as $script_path) {
      $script_els .=
        "<script type='application/javascript' src='$script_path'></script>";
    }
    echo $script_els;
    ?>
    </html>
    <?php
  }

  public static function do_page_header() {
    ?>
    <body>
    <header></header>
    <?php
  }

  public static function do_page_footer() {
    ?>
    <footer></footer>
    </body>
    <?php
  }
}
?>

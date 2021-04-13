<?php
class BOC_Util {

  function __construct() {

  }

  public function sort_fields($post,$fields,$placeholders) {
    $err_arr = array();
    $atts_arr = array();
    $vals_arr = array();
    //print_r($post);
    foreach( $fields as $field) {
      if ( !empty($post) && !empty($post[$field]) ) {
        $atts_arr[$field] = 'value';
        $vals_arr[$field] = $post[$field];
      } else {
        $err_arr[$field] = true;
        //
        $atts_arr[$field] = 'placeholder';
        $vals_arr[$field] = $placeholders[array_search($field,$fields)];
      }
    }
    return (object)array(
      'atts_arr'=>$atts_arr,'vals_arr'=>$vals_arr, 'err_arr'=>$err_arr
    );
  }

  public static function do_doc_head_element($style_paths,$title_str) {
    ?>
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" name="viewport" content="width=device-width, initial-scale=1">
      <meta http-equiv="X-UA-Compatible" content="IE=edge"/>
      <title>
         <?php echo $title_str; ?> 易經 Book of Changes
      </title>
      <link rel='icon' href='/book-of-changes/resources/images/tao-75-red.png' type='image/x-icon'/ >
      <link rel="stylesheet" href="/book-of-changes/style/main.css"/>

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

  public static function do_page_header($str) {
    ?>
    <body>
      <div id="relshell">
        <!-- navigation icon -->
        <div id="nav-hex">
          <div class="nav-hex-line"></div>
          <div class="nav-hex-line"></div>
          <div class="nav-hex-line"></div>
          <div class="nav-hex-line"></div>
          <div class="nav-hex-line"></div>
          <div class="nav-hex-line"></div>
        </div>

        <!-- navigation menu -->
        <div id="nav-modal-shell">
          <div id="nav-modal">
            <div id="close-nav-modal" class="close-modal">&laquo;</div>
            <ul id="nav-list">
              <li class="nav-option">
                <a class="nav-anchor"id="build" data-display="block,none" data-opacity="10,3.3" data-decor="underline,none" href="/book-of-changes/build/">build</a>
              </li>
              <li class="nav-option">
                <a class="nav-anchor" id="explore" data-display="block,none" data-opacity="10,3.3" data-decor="underline,none" href="#">explore</a>
                <div id="subnav-modal">
                  <ul id="explore-list" class="nav-sublist">
                    <li class="nav-suboption">
                      <a class="subnav-anchor explore" href="/book-of-changes/trigrams/">八卦<br/>trigrams</a>
                    </li>
                    <li class="nav-suboption">
                      <a class="subnav-anchor explore" href="/book-of-changes/hexagrams/">卦<br/>hexagrams</a>
                    </li>
                    <li class="nav-suboption">
                      <a class="subnav-anchor explore" href="/book-of-changes/i-ching/">易經<br/>the book</a>
                    </li>
                    <li class="nav-suboption">
                      <a class="subnav-anchor explore" href="/book-of-changes/ex-machina/">貞<br/>ex machina</a>
                  </ul>
                </div>
              </li>
              <li class="nav-option">
                <a class="nav-anchor" id="profile" data-display="block,none" data-opacity="10,3.3" data-decor="underline,none" href="#">profile</a>
                <div id="subnav-modal">
                  <ul id="profile-list" class="nav-sublist">
                    <li class="nav-suboption">
                      <a class="subnav-anchor profile" href="#">history</a>
                    </li>
                    <li class="nav-suboption">
                      <a class="subnav-anchor profile" href="#">library</a>
                    </li>
                    <li class="nav-suboption">
                      <a class="subnav-anchor profile" href="#">guide</a>
                    </li>
                    <li class="nav-suboption">
                      <a class="subnav-anchor profile" href="#">logout</a>
                    </li>
                  </ul>
                </div>
              </li>
            </ul>
          </div><!-- nav modal-->
        </div><!-- nav modal shell -->

        <!-- interpretive text modal -->
    <?php echo $str; ?>

      </div><!-- relshell end -->

      <div id="app" class="flex-row flex-center">

    <?php
  }

  public static function do_page_footer($str) {
    ?>
      </div> <!-- ends main app body -->

    <?php echo $str; ?>

    </body>
    <?php
  }
}
?>

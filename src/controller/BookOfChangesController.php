<?php

class BookOfChangesController {

  protected $hexagramLineConfigurations = [];
  protected $trigramLineConfigurations = [];

  protected $hexagramTitles = [];
  protected $generalPurportsInner = [];
  protected $generalPurportsOuter = [];
  protected $linePurportsInner = [];
  protected $linePurportsOuter = [];

  protected $hexagramLineCharacters = [];
  protected $hexagramCharacters = [];
  protected $hexagramNames = [];

  protected $trigramTitleElements = [];
  protected $trigramQualities = [];
  protected $trigramLineCharacters = [];
  protected $trigramCharacters = [];
  protected $trigramNames = [];

  protected $innerHexagramIndices = [];
  protected $sovereignHexagramIndices = [];

  function __construct(
    array $hex_bin_arr,
    array $tri_bin_arr,
    array $hex_name_arr,
    array $tri_names_arr,
    array $purports_inner,
    array $purports_outer,
    array $moving_lines_inner,
    array $moving_lines_outer,
    array $hex_lines_chars_arr,
    array $hex_chars_table,
    array $tri_lines_chars_arr,
    array $tri_chars_arr,
    array $inner_indices,
    array $sovereign_indices
  )
  {
    $this->hexagramLineConfigurations = $hex_bin_arr;
    $this->trigramLineConfigurations = $tri_bin_arr;

    $this->hexagramTitles = $hex_name_arr;
    $this->generalPurportsInner = $purports_inner;
    $this->generalPurportsOuter = $purports_outer;
    $this->linePurportsInner = $moving_lines_inner;
    $this->linePurportsOuter = $moving_lines_outer;

    $this->hexagramLineCharacters = $hex_lines_chars_arr;
    $this->trigramLineCharacters = $tri_lines_chars_arr;

    $this->innerHexagramIndices = $inner_indices;
    $this->sovereignHexagramIndices = $sovereign_indices;


    foreach ($tri_names_arr as $table_row) {
      $this->trigramTitleElements[]=$table_row[0];
      $this->trigramQualities[]=$table_row[1];
    }

    foreach ($hex_chars_table as $table_row) {
      $this->hexagramCharacters[]=$table_row[0];
      $this->hexagramNames[]=$table_row[1];
    }

    foreach ($tri_chars_arr as $table_row) {
      $this->trigramCharacters[]=$table_row[1];
      $this->trigramNames[]=$table_row[0];
    }
  }

  public function getHexagram(string $hex_id, string $moving_lines, bool $verbose, bool $dual_result) {
    $response_arr = [];
    if (intval($hex_id) && isset($this->hexagramLineConfigurations[intval($hex_id)])) {
      if (strlen($moving_lines) && $dual_result) {
        $response_arr = [
          $this->getHexBody($hex_id,$moving_lines,$verbose),
          $this->getHexBody(
            $this->getHexIdByMovingLines(
              $this->hexagramLineConfigurations[intval($hex_id)],
              $moving_lines,
              $verbose
            ),
            '',
            $verbose
          )
        ];
      } else {
        $response_arr = $this->getHexBody($hex_id,$moving_lines,$verbose);
      }
    }
    return $response_arr;
  }

  public function getHexBody(string $hex_id, string $moving_lines, bool $verbose) {
    $response = [];
    $hex_index = intval($hex_id);
    $response['title'] = $this->hexagramTitles[$hex_index];
    $response['message_inner'] = $this->generalPurportsInner[$hex_index];
    $response['message_outer'] = $this->generalPurportsOuter[$hex_index];
    if (strlen($moving_lines)) {
      $reponse['lines_inner'] = [];
      $reponse['lines_outer'] = [];
      for($char_index = 0; $char_index < strlen($moving_lines); $char_index++) {
        if (intval($moving_lines[$char_index])) {
          $response['lines_inner'][] = $this->linePurportsInner[$hex_index][intval($moving_lines[$char_index])];
          $response['lines_outer'][] = $this->linePurportsOuter[$hex_index][intval($moving_lines[$char_index])];
        }
      }
    } else {
      $response['lines_inner'] = [$this->linePurportsInner[$hex_index][0]];
      $response['lines_outer'] = [$this->linePurportsOuter[$hex_index][0]];
    }
    $response['inner_hexagram'] = $this->getHexHeader(
      $this->getInnerHexIdByLineConfig(
        $this->hexagramLineConfigurations[$hex_index]
      )
    );
    $response['innermost_hexagram'] = $this->getHexHeader(
      $this->getInnerHexIdByLineConfig(
        $this->hexagramLineConfigurations[intval($response['inner_hexagram']['id'])]
      )
    );
    if ($verbose) {
      $response[''] = '';
    }
    return $response;
  }

  public function getHexHeader(string $hex_id) {
    $response = [];
    $hex_index = intval($hex_id);
    $response['title'] = $this->hexagramTitles[$hex_index];
    $response['id'] = $hex_id;
    return $response;
  }

  public function getHexIdByMovingLines(string $line_config, string $moving_lines) {
    $still_lines = '';
    for($char_index = 0; $char_index < strlen($line_config); $char_index++) {
      if (strpos($moving_lines,strval($char_index+1)) || strpos($moving_lines,strval($char_index+1))===0) {
        $still_lines .= $line_config[$char_index] ==='0' ? '1' : '0';
      } else {
        $still_lines .= $line_config[$char_index];
      }
    }
    return strval(
      array_search(
        $still_lines,
        $this->hexagramLineConfigurations
      )
    );
  }

  public function getInnerHexIdByLineConfig(string $line_config) {
    $inner_line_config = [
      $line_config[1],
      $line_config[2],
      $line_config[3],
      $line_config[2],
      $line_config[3],
      $line_config[4],
    ];
    return strval(
      array_search(
        implode('',$inner_line_config),
        $this->hexagramLineConfigurations
      )
    );
  }
}

?>

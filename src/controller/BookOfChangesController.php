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

  function __construct(stdClass $library,stdClass $typeface)
  {
    $this->hexagramLineConfigurations = $library->hex_bin_arr;
    $this->trigramLineConfigurations = $library->tri_bin_arr;

    $this->hexagramTitles = $library->hex_name_arr;
    $this->generalPurportsInner = $library->purports_inner;
    $this->generalPurportsOuter = $library->purports_outer;
    $this->linePurportsInner = $library->moving_lines_inner;
    $this->linePurportsOuter = $library->moving_lines_outer;

    $this->hexagramLineCharacters = $typeface->hex_lines_chars_arr;
    $this->trigramLineCharacters = $typeface->tri_lines_chars_arr;

    $this->innerHexagramIndices = $library->inner_indices;
    $this->sovereignHexagramIndices = $library->sovereign_indices;


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

    if (preg_match('/^[10]{6}$/',$hex_id)) {
      $hex_index = array_search($hex_id,$this->hexagramLineConfigurations);
    } else if (intval($hex_id)) {
      $hex_index = intval($hex_id);
    } else {
      $hex_index = null;
    }

    if ($hex_index) {
      if (isset($this->hexagramLineConfigurations[$hex_index])) {
        if (strlen($moving_lines) && $dual_result) {
          $response_arr = [
            $this->getHexBody(strval($hex_index),$moving_lines,$verbose),
            $this->getHexBody(
              $this->getHexIdByMovingLines(
                $this->hexagramLineConfigurations[$hex_index],
                $moving_lines,
                $verbose
              ),
              '',
              $verbose
            )
          ];
        } else {
          $response_arr = $this->getHexBody(strval($hex_index),$moving_lines,$verbose);
        }
      }
    } else {
      $response_arr = ['error'=> 'unrecognized ID format'];
    }
    return $response_arr;
  }

  public function getHexagramsByTrigram(string $segment, string $trigram_line_config) {
    $response_arr = [];
    $error = '';
    if (preg_match('/^[10]{3}$/',$trigram_line_config)) {
      $match_indices = [];
      foreach($this->hexagramLineConfigurations as $hex_index => $hex_line_config) {
        if ($segment==='top') {
          if ($trigram_line_config === substr($hex_line_config,3,3)) {
            $response_arr[] = $this->getHexHeader(strval($hex_index));
          }
        } else if ($segment==='bottom') {
          if ($trigram_line_config === substr($hex_line_config,0,3)) {
            $response_arr[] = $this->getHexHeader(strval($hex_index));
          }
        } else {
          $error = 'unrecognized argument';
        }
      }
    } else {
      $error = 'unrecognized data format';
    }
    if ($error) {
      $response_arr = ['error' => $error];
    }
    return $response_arr;
  }

  public function getTrigramBody(string $line_config) {
    $response_arr = [];
    if ($index = array_search($line_config,$this->trigramLineConfigurations)) {
      $response_arr['title'] = $this->trigramTitleElements[$index] . ' | ' . $this->trigramQualities[$index];
      $response_arr['name'] = $this->trigramNames[$index];
      $response_arr['character'] = $this->trigramCharacters[$index];
      $response_arr['lines'] = $this->trigramLineCharacters[$index];
    }
    return $response_arr;
  }

  public function getTrigrams(string $hex_id) {
    $response_arr = [];
    if (isset($this->hexagramLineConfigurations[intval($hex_id)])) {
      $lower_line_config = substr(
        $this->hexagramLineConfigurations[intval($hex_id)],
        0,
        3
      );
      $upper_line_config = substr(
        $this->hexagramLineConfigurations[intval($hex_id)],
        3,
        3
      );
      $response_arr['lower'] = $this->getTrigramBody($lower_line_config);
      $response_arr['upper'] = $this->getTrigramBody($upper_line_config);
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
    if ($verbose) {
      $trigrams = $this->getTrigrams($hex_id);
      $response['trigram_lower'] = $trigrams['lower'];
      $response['trigram_upper'] = $trigrams['upper'];

      $response['name'] = $this->hexagramNames[$hex_index];
      $response['character'] = $this->hexagramCharacters[$hex_index];
      $response['lines'] = $this->hexagramLineCharacters[$hex_index];

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
    }
    return $response;
  }

  public function getHexHeader(string $hex_id) {
    $response = [];
    $hex_index = intval($hex_id);
    $response['title'] = $this->hexagramTitles[$hex_index];
    $response['uri'] = '/api/v1/hexagrams/?id=' . $hex_id;
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
